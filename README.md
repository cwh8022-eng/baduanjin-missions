# 八段錦 AI 闖關 — GitHub Pages + PWA

## 使用方式
1. 將 Teachable Machine Pose 匯出的模型三檔放到 `model/` 目錄：`model.json`、`metadata.json`、`weights.bin`。
2. 開啟 `index.html`（建議使用 VS Code Live Server）測試。
3. 推到 GitHub：
   - 建新 repo（Public）。
   - 把整個資料夾上傳或 `git push`。
   - 於 Repo Settings → Pages → Source 選擇 `Deploy from a branch`、`Branch: main /root`。
   - 片刻後，頁面將出現在 `https://<使用者>.github.io/<repo>/`。
4. 第一次線上開啟後即可離線快取（PWA）。

> 注意：相機在行動裝置上需要 HTTPS 或 localhost，GitHub Pages 預設為 HTTPS，無需額外設定。
