// --- 佛曆格式化函數 ---
export const formatToBuddhist = (dateStr) => {
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
};
