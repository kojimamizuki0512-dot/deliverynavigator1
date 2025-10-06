/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        app: "#0f1217",              // 背景（深いダーク）
        "app-panel": "#141923",      // パネル
        "app-muted": "#9aa4b2",      // 説明文
        brand: "#4ea8ff",            // 青（基本）
        success: "#34d399",          // 緑（ポジティブ）
        gold: "#f5c451",             // 金（達成）
        warn: "#facc15",             // 黄（注意）
        "app-fore": "#dbe3ee",       // 文字
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.25)",
      },
      borderRadius: {
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
