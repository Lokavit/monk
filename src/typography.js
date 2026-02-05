// src/typography.js

export class Typography {
  constructor(options = {}) {
    // 預設配置
    this.options = {
      spaceRequired: true, // 是否需要中英混排空格
      fixPunctuation: true, // 是否修正標點
      trimLines: true, // 是否修剪行首尾空格
      ...options,
    };
  }

  /**
   * 核心優化函數
   */
  optimize(text) {
    if (!text || typeof text !== "string") return "";

    let result = text;

    // 先處理行首尾空格
    if (this.options.trimLines) {
      result = result
        .split("\n")
        .map((line) => line.trim())
        .join("\n");
    }

    // 處理中英混排空格
    if (this.options.spaceRequired) {
      result = this.addPanguSpace(result);
    }

    // 修正標點
    if (this.options.fixPunctuation) {
      result = this.convertPunctuation(result);
    }

    // 4. 段首縮進 (針對非標題、非列表的純文字行)
    if (this.options.indentChinese) {
      result = result
        .split("\n")
        .map((line) => {
          // 只有當行首是中文字符，且不是 Markdown 標語 (#) 或列表 (-) 時才縮進
          if (/^[\u4e00-\u9fa5]/.test(line)) {
            return "　　" + line; // 插入兩個全形空格
          }
          return line;
        })
        .join("\n");
    }

    return result;
  }

  /**
   * 中西文混排自動加空格 (Pangu Space)
   */
  addPanguSpace(text) {
    return (
      text
        // 在中文字符與英文字母/數字/特定符號間插入空格
        .replace(/([\u4e00-\u9fa5])([a-zA-Z0-9@#+=\[({/])/g, "$1 $2")
        .replace(/([a-zA-Z0-9@#+=\])}/])([\u4e00-\u9fa5])/g, "$1 $2")
    );
  }

  /**
   * 全半角標點轉換 (核心邏輯：在中文包圍中修正半角標點)
   */
  convertPunctuation(text) {
    // 定義轉換對照表
    const mapping = {
      ",": "，",
      ".": "。",
      "?": "？",
      "!": "！",
      ";": "；",
      ":": "：",
      "(": "（",
      ")": "）",
    };

    // 這裡我們採用一個相對穩健的策略：
    // 如果半角標點緊鄰中文字符，則將其轉換
    let processed = text;
    Object.keys(mapping).forEach((semi) => {
      const full = mapping[semi];
      // 匹配：中文+半角 或 半角+中文
      const regex = new RegExp(
        `([\u4e00-\u9fa5])\\${semi}|\\${semi}([\u4e00-\u9fa5])`,
        "g"
      );
      processed = processed.replace(regex, (match, p1, p2) => {
        return p1 ? `${p1}${full}` : `${full}${p2}`;
      });
    });

    return processed;
  }

  /**
   * 字數統計 (針對小說：中文算 1 字，英文單詞算 1 字)
   */
  static countWords(text) {
    if (!text) return 0;
    const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const english = (
      text.replace(/[\u4e00-\u9fa5]/g, " ").match(/\b\S+\b/g) || []
    ).length;
    return chinese + english;
  }
}
