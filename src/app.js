// monk/src/app.js
import { ThemeManager } from "./theme.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. 初始化主題
  const theme = new ThemeManager({
    defaultTheme: "Matrix",
    customThemes: {},
  });

  theme.subscribe((vars) => {
    Object.keys(vars).forEach((k) =>
      document.documentElement.style.setProperty(`--${k}`, vars[k])
    );
  });

  // 3. 通用功能 (例如：點擊標題回到首頁，或字數淡入動畫)
  console.log("Anicca System Initialized.");
});
