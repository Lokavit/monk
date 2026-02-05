import { storage } from "./storage.js";

export class I18nManager {
  constructor(options = {}) {
    this.messages = options.messages || {}; // 業務級傳進來的字典
    this.storageKey = "app-locale";
    // 初始化時讀取已保存的語言
    this.locale = storage.get(
      this.storageKey,
      options.defaultLocale || "zh-CN"
    );
    this.listeners = [];
  }

  // 業務級切換語言
  setLocale(locale) {
    if (!this.messages[locale]) return;
    this.locale = locale;
    // 持久化保存
    storage.set(this.storageKey, locale);
    this.notify();
  }

  // 核心翻譯函數：支持 path 查找，如 'nav.home'
  t(path) {
    const keys = path.split(".");
    let result = this.messages[this.locale];

    for (const key of keys) {
      if (result && result[key]) {
        result = result[key];
      } else {
        return path; // 找不到則返回路徑本身，方便調試
      }
    }
    return result;
  }

  getLocaleList() {
    return Object.keys(this.messages);
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.locale);
    return () =>
      (this.listeners = this.listeners.filter((l) => l !== callback));
  }

  notify() {
    this.listeners.forEach((callback) => callback(this.locale));
  }
}
