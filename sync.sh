#!/bin/bash

# 定義路徑變數（根據你的實際目錄結構調整）
JS_CORE="../js-core/src"
CSS_CORE="../css-core"

# 建立目標資料夾（如果不存在）
mkdir -p ./src
mkdir -p ./assets

# 同步 JS 核心文件
cp $JS_CORE/theme.js ./src/
cp $JS_CORE/i18n.js ./src/
cp $JS_CORE/storage.js ./src/
cp $JS_CORE/typography.js ./src/
cp $JS_CORE/format.js ./src/

# 同步 CSS 核心文件
cp $CSS_CORE/variables.css ./assets/
cp $CSS_CORE/typography.css ./assets/
cp $CSS_CORE/reset.css ./assets/

echo "✅ Core files sync completed!"