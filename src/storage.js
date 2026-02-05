// src/storage.js

export class StorageManager {
  constructor(prefix = "monk-") {
    this.prefix = prefix;
    // 檢查是否在瀏覽器環境且 localStorage 可用
    this.isAvailable = typeof window !== "undefined" && !!window.localStorage;
  }

  // 內部工具：生成帶前綴的 key，防止與其他網站數據衝突
  _getKey(key) {
    return `${this.prefix}${key}`;
  }

  set(key, value) {
    if (!this.isAvailable) return;
    try {
      // 統一轉為 JSON 字符串，這樣可以存儲對象、數組、數字等
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(this._getKey(key), serializedValue);
    } catch (e) {
      console.error("Storage set error:", e);
    }
  }

  get(key, defaultValue = null) {
    if (!this.isAvailable) return defaultValue;
    try {
      const item = localStorage.getItem(this._getKey(key));
      // 如果找不到，返回默認值
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error("Storage get error:", e);
      return defaultValue;
    }
  }

  remove(key) {
    if (this.isAvailable) {
      localStorage.removeItem(this._getKey(key));
    }
  }
}

// 導出一個默認實例方便直接使用，也支持 new 導出多個實例
export const storage = new StorageManager();
