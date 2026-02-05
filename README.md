# monk

```bash
./sync.sh
```

## 分站

| 模塊名稱    | 目錄路徑               | 內容定義                             |
| ----------- | :--------------------- | :----------------------------------- |
| ABOUT       | about/index.html       | 個人簡歷、聯繫方式、自我介紹。       |
| PROJECTS    | projects/index.html    | 其他 Web 應用、開源作品集。          |
| EDU         | edu/index.html         | 教育類產品、教學系統、教育相關專案。 |
| DEVELOPMENT | dev/index.html         | 技術筆記、開發文檔、架構設計。       |
| Games       | games/index.html       | 獨立遊戲作品展示與試玩頁面。         |
| LINUX       | linux/index.html       | Linux 完整學習。                     |
| TOOLS       | tools/index.html       | 自己開發的實用小工具、插件。         |
| NOVELS      | novels/index.html      | 長篇、短篇小說存稿與連載。           |
| REFLECTIONS | reflections/index.html | 影視書評、讀書筆記與靈感二創         |
| LIFE        | life/index.html        | 生活隨筆、日誌、感悟。               |

<!--
# IDEA & ACTION

karma:業[非唯一]
sutra:真諦
stupa:塔,佛塔,舍利塔
sumeru:須彌山
prajna:般若
bhiksu:比丘
lokavit:世間解
SahaLand 娑婆世界
SAMSARA 　輪迴轉世
 -->

<!-- 下一步，我們來優先處理 NOVELS。我有以下幾個問題：

3. 整個 NOVELS 的表現 monk/novels/index.html 我有以下思路：採用 css 做出類似書籍的效果，顯示小小說名稱、作者、簡介、狀態(連載|完結)、字數等信息。點擊書籍，展開簡單的 flex 自動換行佈局的目錄，目錄只有簡單的 Chapters 01 | Chapters 02 等。
   採用 CSS 做出「書籍感」能與一般的博客系統拉開差距。
   設計建議：
   封面圖：即使沒有畫，也可以用 CSS 畫一個純色的、帶有螢光邊框的矩陣代表書脊。
   展開動畫：點擊書籍時，利用 CSS 的 max-height 或 grid-template-rows 製作一個平滑展開的下拉列表。
   目錄簡潔化：Chapters 01 這種命名非常適合你的 Cyberpunk 風格。

4. 字數統計，我們似乎已經在 js-core 中實現過，可以直接引入使用。
   實現方式：在 HTML 生成階段，腳本調用 js-core 的邏輯計算 .md 文件的字數。
   展示層：將計算好的字數寫入 Meta 數據中，最終顯示在書架的「字數」欄位。這樣前端加載時不需要計算，直接讀取靜態數值，性能最優。 -->
