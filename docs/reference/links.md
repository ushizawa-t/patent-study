# 出典・参考リンク

## この教材の出典

- 特許庁「特許・実用新案審査基準」
- 特許庁「特許・実用新案審査ハンドブック」
  - 附属書A「特許・実用新案審査基準」事例集
  - 附属書B「特許・実用新案審査基準」の特定技術分野への適用例

本文中の「原文」の囲みは、上記資料の記載をそのまま引用しています。そのほかの説明は、新人向けにやさしく言い換えた**社内教育用の解説**です。正式な解釈は必ず原文で確認してください。

## 公式サイト

- [特許・実用新案審査基準（特許庁）](https://www.jpo.go.jp/system/laws/rule/guideline/patent/tukujitu_kijun/index.html)
- [特許・実用新案審査ハンドブック（特許庁）](https://www.jpo.go.jp/system/laws/rule/guideline/patent/handbook_shinsa/index.html)
- [特許法（e-Gov 法令検索）](https://laws.e-gov.go.jp/law/334AC0000000121)

::: warning 改訂の確認
審査基準・ハンドブックは改訂されることがあります。この教材は、取り込んだ時点の版（審査基準の一部に 2026.7 の改訂表記あり）をもとにしています。判定で迷ったときは、公式サイトの最新版を確認しましょう。
:::

## 教材の更新方法（教育担当者向け）

| やりたいこと | 編集するファイル |
|---|---|
| 本文を直す | `docs/` 以下の各 `.md` ファイル |
| クイズを追加・修正する | `docs/data/quizzes/<ページID>.json` |
| 対比表ワークを追加する | `docs/data/compare/<ID>.json` と `docs/practice/compare.md` |
| メニューを変える | `docs/.vitepress/config.mts` の `sidebar` |

GitHub の `main` ブランチに反映すると、自動でサイトが更新されます。
