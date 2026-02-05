import { storage } from "./storage.js";

// 1. 內置的基礎配色方案
const DEFAULT_SCHEMES = {
  Teal: {
    background: "#1a170f",
    foreground: "#eceae5",
    accent: "#32858b",
  },
  Viking: {
    background: "#0e1923",
    foreground: "#d6e8ee",
    accent: "#5accf0",
  },
  Matrix: {
    background: "#121212",
    foreground: "#4eee85",
    accent: "#4eee85",
  },
  Pistachio: {
    background: "#1d2021",
    foreground: "#ebdbb2",
    accent: "#8ec07c",
  },
};

export class ThemeManager {
  constructor(options = {}) {
    this.themes = { ...DEFAULT_SCHEMES, ...(options.customThemes || {}) };
    this.storageKey = "app-theme";
    // 初始化時先從存儲中讀取，沒有則用默認值
    this.currentTheme = storage.get(
      this.storageKey,
      options.defaultTheme || "Matrix"
    );

    // 訂閱者隊列
    this.listeners = [];
  }

  // 核心方法：切換主題
  setTheme(name) {
    if (!this.themes[name]) return;
    this.currentTheme = name;
    // 持久化保存
    storage.set(this.storageKey, name);
    // 只負責通知訂閱者，不操作 DOM
    this.notify();
  }

  // 獲取當前主題的所有 CSS 變量對象
  getVariables() {
    return this.themes[this.currentTheme];
  }

  getThemeList() {
    return Object.keys(this.themes);
  }

  // 訂閱變化（這是對接 Vue/React/Web/SSR 的關鍵）
  subscribe(callback) {
    this.listeners.push(callback);
    // 立即執行一次，確保訂閱者拿到初始狀態
    callback(this.getVariables(), this.currentTheme);

    // 返回取消訂閱的函數
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  notify() {
    const vars = this.getVariables();
    this.listeners.forEach((callback) => callback(vars, this.currentTheme));
  }
}
