// 分類下的目錄頁
export const genIndexTpl = (categoryName) => {
  // 將首字母大寫，例如 linux -> Linux
  const displayTitle =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return `
<!DOCTYPE html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${displayTitle} - Monk</title>
    <script>
      (function () {
        const saved = localStorage.getItem("theme-name") || "Matrix";
        document.documentElement.setAttribute("data-theme", saved);
        if (saved === "Matrix")
          document.documentElement.style.background = "#000";
      })();
    </script>
    <link rel="stylesheet" href="../../assets/variables.css" />
    <link rel="stylesheet" href="../../assets/main.css" />
    <link rel="stylesheet" href="../../assets/typography.css" />
    <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=Noto+Sans+TC:wght@100;300;400&display=swap" rel="stylesheet" />
    <style>
      .list-container { max-width: 800px; margin: 4em auto; padding: 0 20px; }
      .page-title { font-family: "Ma Shan Zheng", cursive; font-size: 3em; color: var(--accent); margin-bottom: 1em; border-bottom: 1px solid var(--accent); padding-bottom: 0.5em; text-transform: capitalize; }
      .post-item { margin-bottom: 1.5em; transition: transform 0.3s ease; list-style: none; border-bottom: 1px dashed var(--accent); padding-bottom: 1.5em; }
      .post-link { text-decoration: none; display: block; }
      .post-header { display: flex; justify-content: space-between; align-items: baseline; }
      .post-title { font-size: 1.5em; color: var(--accent); margin: 0; }
      .post-date { font-family: "Noto Sans TC", sans-serif; font-size: 0.9em; opacity: 0.6; color: var(--accent); }
      .post-desc { margin-top: 0.5em; font-size: 1em; opacity: 0.6; line-height: 1.6; color: var(--accent); }
      .post-tags { margin-top: 0.5em; display: flex; gap: 10px; }
      .tag { font-size: 0.7em; padding: 2px 8px; border: 1px solid var(--accent); border-radius: 4px; color: var(--accent); }
      .post-item:hover { transform: translateX(10px); }
      .post-word-count { font-size: 0.7em; opacity: 0.4; margin-top: 5px; color: var(--accent); }
    </style>
  </head>
  <body>
    <header>
      <h1 class="header_site_name">
        <a href="../../index.html" style="text-decoration: none; color: inherit">Monk's Personal Site</a>
      </h1>
      <div class="header_site_tip">Lotus. Dust. Zen. Void</div>
    </header>

    <div class="list-container">
      <h1 class="page-title">${displayTitle}</h1>
      <ul id="toc-list">
        <div class="loading">Loading records from data.json...</div>
      </ul>
    </div>

    <script type="module" src="../../src/app.js"></script>
    <script type="module">
      async function loadData() {
        const listElement = document.getElementById("toc-list");
        try {
          const response = await fetch("./data.json");
          const data = await response.json();
          listElement.innerHTML = ""; 

          data.forEach((post) => {
            const li = document.createElement("li");
            li.className = "post-item";
            const tagsHtml = post.tags.map((tag) => \`<span class="tag">\${tag}</span>\`).join("");

            li.innerHTML = \`
              <a href="./\${post.link}" class="post-link">
                <div class="post-header">
                  <h2 class="post-title">\${post.title}</h2>
                  <span class="post-date">\${post.buddhistDate}</span>
                </div>
                <div class="post-desc">\${post.description}</div>
                <div class="post-tags">\${tagsHtml}</div>
                <div class="post-word-count">字數: \${post.wordCount}</div>
              </a>
            \`;
            listElement.appendChild(li);
          });
        } catch (error) {
          console.error("Error loading data.json:", error);
          listElement.innerHTML = '<div class="error">Failed to load records.</div>';
        }
      }
      loadData();
    </script>
  </body>
</html>`;
};

// 內容頁面
export const genContentTpl = (categoryName, meta, str) => {
  const displayTitle =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  return `
  <!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <title>${meta.title} - ${displayTitle}</title>
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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
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
    <script type="module" src="../../src/app.js"></script>
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
            <h1>${meta.title}</h1>
            <div class="post-meta" >
            <span>Author: ${meta.author}</span> | 
                <span>Date: ${meta.buddhistDate}</span> | 
                <span>Words: ${meta.wordCount}</span>
            </div>
        </header>
        <section  >${str}</section>
    </article>

    
</body>
</html>
  `;
};
