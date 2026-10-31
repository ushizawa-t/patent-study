# 特許判定トレーニング

新規性・進歩性の判定を、特許庁の審査基準・審査ハンドブックに沿って学ぶ新人向け教材です（VitePress 製の静的サイト）。

## ローカルで見る

```sh
npm install
npm run dev      # http://localhost:5173/patent-study/
```

## 公開

`main` ブランチに push すると、GitHub Actions（`.github/workflows/deploy.yml`）でビルドされ GitHub Pages に公開されます。
初回のみ、リポジトリの Settings → Pages → Build and deployment → Source を「GitHub Actions」にしてください。

## 編集のしかた

| やりたいこと | ファイル |
|---|---|
| 本文 | `docs/**/*.md` |
| 確認クイズ | `docs/data/quizzes/<id>.json`（ページ内の `<Quiz id="<id>" />` と対応） |
| 対比表ワーク | `docs/data/compare/<id>.json`（`<CompareWork id="<id>" />` と対応） |
| メニュー・サイト設定 | `docs/.vitepress/config.mts` |

本文中の `::: info 原文（…）` の囲みは、条文・審査基準・ハンドブックの記載をそのまま引用する場所です。言い換えずに原文のまま載せてください。

## 出典

特許庁「特許・実用新案審査基準」「特許・実用新案審査ハンドブック」（附属書A・Bを含む）
