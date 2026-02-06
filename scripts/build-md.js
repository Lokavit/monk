import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

import { Typography } from "../src/typography.js";
import { formatToBuddhist } from "../src/format.js";
import { genIndexTpl, genContentTpl } from "../src/genTemplate.js";

// 初始化路徑與工具
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// md 解析 代碼高亮
const md = new MarkdownIt({
  html: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre><code class="hljs">' +
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
          "</code></pre>"
        );
      } catch (__) {}
    }
    return (
      '<pre><code class="hljs">' + md.utils.escapeHtml(str) + "</code></pre>"
    );
  },
});

// 源內容倉庫
const SOURCE_DIR = path.resolve(__dirname, "../../anicca/");
// 輸出文件夾
const DIST_DIR = path.resolve(__dirname, "../dist/");

// 需要讀取源內容倉庫的文件夾，在此手動羅列
const CATEGORIES = [
  "development",
  "linux",
  // Literary & Creative
  "reflections",
  "self-existence",
  "daemon-lock",
  "abyss",
  "deliverance",
  "life",
  //   "pili", // 未來霹靂的文字稿，如果有興趣。
];

async function build() {
  console.log("🚀 Starting Dev Build with Buddhist Calendar...");
  // 確保輸出目錄存在
  await fs.ensureDir(DIST_DIR);

  // 讀取 SOURCE_DIR 下的所有內容
  const entries = await fs.readdir(SOURCE_DIR, { withFileTypes: true });
  console.log(`內容源:`, entries);

  for (const entry of entries) {
    // 3. 過濾條件：必須是文件夾，且在白名單中
    if (entry.isDirectory() && CATEGORIES.includes(entry.name)) {
      const categoryName = entry.name;
      console.log(`正在處理分類: ${categoryName}`);

      const categoryPath = path.join(SOURCE_DIR, categoryName);
      const files = await fs.readdir(categoryPath);
      // console.log(`files:`, files);
      // 存儲每一個分類先的元數據提取
      const metaList = [];

      for (const file of files) {
        if (file.endsWith(".md")) {
          const filePath = path.join(categoryPath, file);
          const content = await fs.readFile(filePath, "utf-8");
          // 解析元數據
          const { data, content: markdown } = matter(content);
          console.log(`data:`, data);
          // 字數統計 (使用靜態方法)
          const wordCount = Typography.countWords(markdown);
          // 將md渲染爲html
          const htmlContent = md.render(markdown);
          // --- 處理日期 ---
          const rawDate = data.date || new Date().toISOString().split("T")[0];
          const buddhistDate = formatToBuddhist(rawDate);
          // 元數據
          const fileName = file.replace(".md", ".html");
          const postData = {
            title: data.title || file.replace(".md", ""),
            date: rawDate,
            buddhistDate: buddhistDate,
            tags: data.tags || [],
            description:
              data.description?.trim() ||
              markdown.slice(0, 60).replace(/[#*`]/g, "") + "...",
            wordCount,
            author: "Monk",
            link: fileName,
          };
          metaList.push(postData);

          const outputDir = path.join(DIST_DIR, categoryName);
          // console.log(`outputDir:`, outputDir);
          // 確保該分類的文件夾存在（例如 dist/linux/）
          await fs.ensureDir(outputDir);

          const outputFilePath = path.join(
            outputDir,
            file.replace(".md", ".html")
          );

          // 寫入模板和內容
          const finalHtml = genContentTpl(categoryName, postData, htmlContent);

          // 寫入文件
          await fs.writeFile(outputFilePath, finalHtml);

          console.log(`✔ 已生成: ${outputFilePath}`);
        }
        // console.log(`metaList:`, metaList);
      }
      // 按日期降序排序
      metaList.sort((a, b) => new Date(b.date) - new Date(a.date));
      // 輸出 JSON 索引供 index.html 渲染列表使用
      const outputDir = path.join(DIST_DIR, categoryName);
      await fs.outputJson(path.join(outputDir, "data.json"), metaList, {
        spaces: 2,
      });

      // --- 生成該分類的 index.html ---
      const indexHtml = genIndexTpl(categoryName);
      await fs.writeFile(path.join(outputDir, "index.html"), indexHtml);

      console.log(
        `✅ Category [${categoryName}] generated with index.html and data.json`
      );
    }
  }
}

build().catch(console.error);
