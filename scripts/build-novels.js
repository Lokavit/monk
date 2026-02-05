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

const SOURCE_ROOT = path.resolve(__dirname, "../../anicca/novels");
const DIST_ROOT = path.resolve(__dirname, "../novels");

// --- 佛曆格式化函數 (完全復刻) ---
function formatToBuddhist(dateStr) {
  try {
    const date = new Date(dateStr);
    const formatter = new Intl.DateTimeFormat("en-GB-u-ca-buddhist", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${formatter.format(date)}`;
  } catch (e) {
    return dateStr;
  }
}

async function build() {
  console.log("🚀 Starting Novels Multi-level Build...");
  await fs.ensureDir(DIST_ROOT);

  // 1. 讀取所有小說文件夾 (如: pili-bi-hai)
  const novelDirs = (await fs.readdir(SOURCE_ROOT)).filter((f) =>
    fs.statSync(path.join(SOURCE_ROOT, f)).isDirectory()
  );

  const libraryData = []; // 存放所有小說的總索引

  for (const slug of novelDirs) {
    const sourcePath = path.join(SOURCE_ROOT, slug);
    const distPath = path.join(DIST_ROOT, slug);
    await fs.ensureDir(distPath);

    const files = (await fs.readdir(sourcePath))
      .filter((f) => f.endsWith(".md"))
      .sort(); // 按文件名 001, 002 排序

    const chaptersData = [];

    // 2. 遍歷該小說下的所有章節
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const rawContent = await fs.readFile(
        path.join(sourcePath, file),
        "utf-8"
      );
      const { data, content } = matter(rawContent);

      const optimizedBody = typo.optimize(content);
      const wordCount = Typography.countWords(content);
      const htmlBody = md.render(optimizedBody);
      const rawDate = data.date || new Date().toISOString().split("T")[0];
      const buddhistDate = formatToBuddhist(rawDate);
      const fileName = file.replace(".md", ".html");

      // 導航鏈接邏輯
      const prevFile = i > 0 ? files[i - 1].replace(".md", ".html") : null;
      const nextFile =
        i < files.length - 1 ? files[i + 1].replace(".md", ".html") : null;

      const postData = {
        title: data.title || fileName,
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
      chaptersData.push(postData);

      // 3. 生成章節 HTML (注意 CSS 路徑多了一層 ../../)
      const finalHtml = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>${postData.title} - ${slug}</title>
    <script> 
        (function() {
            const saved = localStorage.getItem('theme-name') || 'Matrix';
            document.documentElement.setAttribute('data-theme', saved);
            if (saved === 'Matrix') document.documentElement.style.background = '#000';
            else document.documentElement.style.background = '#fff';
        })();
    </script>
    <link rel="stylesheet" href="../../assets/variables.css">
    <link rel="stylesheet" href="../../assets/typography.css">
    <link rel="stylesheet" href="../../assets/main.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Sans+TC:wght@100;300;400;700&display=swap" rel="stylesheet">
    <style>
        .novel-header { border-bottom: dashed 1px var(--accent); padding-bottom: 2em; margin-bottom: 2em; }
        .post-meta { font-size: 0.9em; opacity: 0.8; font-family: 'Noto Sans TC', sans-serif; }
        .novel-nav { display: flex; justify-content: space-between; margin-top: 4em; padding-top: 2em; border-top: 1px dashed var(--accent); }
        .novel-nav a { color: var(--accent); text-decoration: none; font-size: 0.9em; }
    </style>
    <script type="module" src="../../src/app.js"></script>
</head>
<body>
   <header>
      <h1 class="header_site_name">
        <a href="../../index.html" style="text-decoration: none; color: inherit">Monk's Personal Site</a>
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
        
        <nav class="novel-nav">
            ${
              prevFile
                ? `<a href="./${prevFile}">← PREVIOUS</a>`
                : "<span></span>"
            }
            <a href="./index.html">CONTENTS</a>
            ${nextFile ? `<a href="./${nextFile}">NEXT →</a>` : "<span></span>"}
        </nav>
    </article>
</body>
</html>`;

      await fs.writeFile(path.join(distPath, fileName), finalHtml);
    }

    // 4. 生成每部小說的專屬目錄數據 (chapters.json)
    await fs.outputJson(path.join(distPath, "data.json"), chaptersData, {
      spaces: 2,
    });

    libraryData.push({
      slug: slug,
      title: slug.toUpperCase(),
      updated: chaptersData[chaptersData.length - 1].date,
      chapterCount: chaptersData.length,
    });
    console.log(`  - Novel Done: ${slug}`);
  }

  // 5. 生成小說總列表數據
  await fs.outputJson(path.join(DIST_ROOT, "data.json"), libraryData, {
    spaces: 2,
  });
  console.log("✅ Novels Build Complete.");
}

build().catch((err) => console.error("❌ Build failed:", err));
