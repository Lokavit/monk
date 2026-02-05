import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import { Typography } from "../src/typography.js";

// 初始化路徑與工具
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const md = new MarkdownIt({ html: true });
const typo = new Typography({ spaceRequired: true, fixPunctuation: true });

// 設定路徑 (假設 anicca 與 monk 併排)
const SOURCE_DIR = path.resolve(__dirname, "../../anicca/reflections");
const DIST_DIR = path.resolve(__dirname, "../reflections");
const TEMPLATE_PATH = path.resolve(__dirname, "./template.html"); // 我們稍後建立它

// --- 佛曆格式化函數 ---
function formatToBuddhist(dateStr) {
  try {
    const date = new Date(dateStr);
    // 使用 Intl 轉換為佛曆格式
    const formatter = new Intl.DateTimeFormat("en-GB-u-ca-buddhist", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    // 格式化後會變成 "5 Feb 2569"，我們手動加上 "BE"
    return `${formatter.format(date)}`;
  } catch (e) {
    return dateStr; // 萬一出錯則回傳原樣
  }
}

async function build() {
  console.log("🚀 Starting Reflections Build with Buddhist Calendar...");

  // 確保輸出目錄存在
  await fs.ensureDir(DIST_DIR);

  const files = await fs.readdir(SOURCE_DIR);
  const listData = [];

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const rawContent = await fs.readFile(path.join(SOURCE_DIR, file), "utf-8");
    const { data, content } = matter(rawContent);

    // 1. 排版優化
    const optimizedBody = typo.optimize(content);

    // 2. 字數統計 (使用靜態方法)
    const wordCount = Typography.countWords(content);

    // 3. 渲染 Markdown
    const htmlBody = md.render(optimizedBody);

    // --- 處理日期 ---
    const rawDate = data.date || new Date().toISOString().split("T")[0];
    const buddhistDate = formatToBuddhist(rawDate); // 轉換為 "5 Feb 2569 BE"

    // 4. 準備元數據
    const fileName = file.replace(".md", ".html");
    const postData = {
      title: data.title || "Untitled",
      date: rawDate,
      buddhistDate: buddhistDate,
      tags: data.tags || [],
      description:
        data.description?.trim() ||
        content.slice(0, 60).replace(/[#*`]/g, "") + "...",
      wordCount,
      author: "Monk",
      link: fileName,
    };

    listData.push(postData);

    // 5. 生成單體 HTML (這裡先簡單包裹，你可以之後放入 template.html)
    const finalHtml = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>${postData.title} - Reflections</title>
    <script>
        // 瞬間同步主題色，防止白閃或黑閃
        (function() {
            const saved = localStorage.getItem('theme-name') || 'Matrix';
            document.documentElement.setAttribute('data-theme', saved);
            if (saved === 'Matrix') document.documentElement.style.background = '#000';
            else document.documentElement.style.background = '#fff';
        })();
    </script>
    <link rel="stylesheet" href="../assets/variables.css">
    <link rel="stylesheet" href="../assets/typography.css">
    <link rel="stylesheet" href="../assets/main.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Sans+TC:wght@100;300;400;700&display=swap" rel="stylesheet">
    <style>
        header {
            border-bottom: dashed 1px var(--accent);
            padding-bottom: 2em;
            margin-bottom: 2em;
        }
        h1 { 
            color: var(--accent);
        }
        .post-meta {
            font-size: 0.9em;
            opacity: 0.8;
            font-family: 'Noto Sans TC', sans-serif;
        }
    </style>
    <script type="module" src="../src/app.js"></script>
</head>
<body  > 
    <header>
      <h1 class="header_site_name">
        <a href="./index.html" style="text-decoration: none; color: inherit"
          >Monk's Personal Site</a
        >
      </h1>
      <div class="header_site_tip">Lotus. Dust. Zen. Void</div>
    </header>
    <article class="post-content">
        <header  >
            <h1>${postData.title}</h1>
            <div class="post-meta" >
            <span>Author: ${postData.author}</span> | 
                <span>Date: ${postData.buddhistDate}</span> | 
                <span>Words: ${postData.wordCount}</span>
            </div>
        </header>
        <section class="body-text">${htmlBody}</section>
    </article>

    
</body>
</html>`;

    await fs.writeFile(path.join(DIST_DIR, fileName), finalHtml);
    console.log(`  - Rendered: ${fileName}`);
  }

  // 按日期降序排序
  listData.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 輸出 JSON 索引供 index.html 渲染列表使用
  await fs.outputJson(path.join(DIST_DIR, "data.json"), listData, {
    spaces: 2,
  });
  console.log("✅ Reflections Index Generated (data.json)");
}

build().catch((err) => console.error("❌ Build failed:", err));
