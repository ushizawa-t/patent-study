import { defineConfig } from 'vitepress'

// GitHub Pages ではリポジトリ名がパスになる（https://<user>.github.io/patent-study/）
const base = process.env.BASE_PATH ?? '/patent-study/'

export default defineConfig({
  lang: 'ja',
  title: '特許判定トレーニング',
  description: '新規性・進歩性の判定を、審査基準に沿ってやさしく学ぶ新人向け教材',
  base,
  cleanUrls: true,
  lastUpdated: true,
  head: [['link', { rel: 'icon', href: `${base}favicon.svg`, type: 'image/svg+xml' }]],

  themeConfig: {
    nav: [
      { text: 'はじめに', link: '/start/' },
      { text: '新規性・進歩性', link: '/core/b1-claim' },
      { text: '周辺の要件', link: '/related/c1-enlarged-prior' },
      { text: '演習', link: '/practice/' },
      { text: '資料', link: '/reference/statutes' }
    ],

    sidebar: [
      {
        text: 'A. はじめに',
        items: [
          { text: 'この教材の使い方', link: '/start/' },
          { text: 'A1 判定業務の全体像', link: '/start/overview' },
          { text: 'A2 審査基準とハンドブック', link: '/start/sources' }
        ]
      },
      {
        text: 'B. 新規性・進歩性（必修）',
        items: [
          { text: 'B1 請求項に係る発明の認定', link: '/core/b1-claim' },
          { text: 'B2 先行技術とは', link: '/core/b2-prior-art' },
          { text: 'B3 ウェブ上の先行技術', link: '/core/b3-web' },
          { text: 'B4 引用発明の認定', link: '/core/b4-cited' },
          { text: 'B5 対比', link: '/core/b5-compare' },
          { text: 'B6 新規性の判断', link: '/core/b6-novelty' },
          { text: 'B7 進歩性① 基本の考え方', link: '/core/b7-inventive-basic' },
          { text: 'B8 進歩性② 否定する方向の要素', link: '/core/b8-inventive-negative' },
          { text: 'B9 進歩性③ 肯定する方向の要素', link: '/core/b9-inventive-positive' },
          { text: 'B10 進歩性④ 注意点', link: '/core/b10-inventive-notes' },
          { text: 'B11 特別な表現を含むクレーム', link: '/core/b11-special-claims' },
          { text: 'B12 判断の基準時', link: '/core/b12-base-date' }
        ]
      },
      {
        text: 'C. 周辺の要件',
        items: [
          { text: 'C1 拡大先願（29条の2）', link: '/related/c1-enlarged-prior' },
          { text: 'C2 先願（39条）', link: '/related/c2-prior-app' },
          { text: 'C3 新規性喪失の例外（30条）', link: '/related/c3-grace-period' },
          { text: 'C4 先行技術調査の方法', link: '/related/c4-search' },
          { text: 'C5 発明該当性・産業上の利用可能性', link: '/related/c5-eligibility' },
          { text: 'C6 記載要件', link: '/related/c6-description' },
          { text: 'C7 発明の単一性', link: '/related/c7-unity' },
          { text: 'C8 補正・新規事項・除くクレーム', link: '/related/c8-amendment' },
          { text: 'C9 拒絶理由通知の読み方', link: '/related/c9-office-action' },
          { text: 'C10 優先権・分割', link: '/related/c10-priority' },
          { text: 'C11 その他の制度', link: '/related/c11-others' }
        ]
      },
      {
        text: 'D. 演習',
        items: [
          { text: '演習のすすめ方', link: '/practice/' },
          { text: '判断フローを体験する', link: '/practice/flow' },
          { text: '対比表ワーク', link: '/practice/compare' },
          { text: '事例演習（附属書A）', link: '/practice/cases' }
        ]
      },
      {
        text: '資料',
        items: [
          { text: '条文（原文）', link: '/reference/statutes' },
          { text: '要件の比較表', link: '/reference/comparison' },
          { text: '用語集', link: '/reference/glossary' },
          { text: '出典・参考リンク', link: '/reference/links' }
        ]
      }
    ],

    outline: { level: [2, 3], label: 'このページの内容' },
    docFooter: { prev: '前へ', next: '次へ' },
    lastUpdated: { text: '最終更新' },
    returnToTopLabel: 'ページの先頭へ',
    sidebarMenuLabel: 'メニュー',
    darkModeSwitchLabel: '表示モード',
    lightModeSwitchTitle: 'ライトモードにする',
    darkModeSwitchTitle: 'ダークモードにする',

    footer: {
      message:
        '出典：特許庁「特許・実用新案審査基準」「特許・実用新案審査ハンドブック」（附属書を含む）。本教材は社内教育用の解説です。正式な内容は必ず原文で確認してください。'
    },

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            // 日本語は単語の区切りがないので、漢字・かなの連続を2文字ずつ（bigram）に分けて索引する
            tokenize: (text: string) => {
              const cjk = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー々]/u
              const tokens: string[] = []
              for (const part of text.toLowerCase().split(/[\s\p{P}\p{S}]+/u)) {
                const runs =
                  part.match(
                    /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー々]+|[^\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}ー々]+/gu
                  ) ?? []
                for (const run of runs) {
                  if (!cjk.test(run)) {
                    tokens.push(run)
                  } else if (run.length === 1) {
                    tokens.push(run)
                  } else {
                    for (let i = 0; i < run.length - 1; i++) tokens.push(run.slice(i, i + 2))
                  }
                }
              }
              return tokens
            }
          },
          searchOptions: { prefix: true, fuzzy: false, combineWith: 'AND' }
        },
        translations: {
          button: { buttonText: '検索', buttonAriaLabel: '検索' },
          modal: {
            displayDetails: '詳細を表示',
            resetButtonTitle: 'リセット',
            backButtonTitle: '閉じる',
            noResultsText: '見つかりませんでした',
            footer: { selectText: '選択', navigateText: '移動', closeText: '閉じる' }
          }
        }
      }
    }
  }
})
