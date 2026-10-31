<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

interface Answer {
  label: string
  next: string
}
interface Node {
  title: string
  body: string
  link?: { text: string; href: string }
  answers?: Answer[]
  result?: 'ok' | 'ng' | 'stop'
}

// 審査基準 第III部第2章第3節 1.（判断の流れ）と 第2節 3.（(1)〜(4)の手順）をもとにしたフロー
const nodes: Record<string, Node> = {
  start: {
    title: 'ステップ1：請求項に係る発明を認定できますか？',
    body: '請求項の記載をもとに、明細書・図面と出願時の技術常識も考えながら、用語の意味をはっきりさせます。明細書を読んでもなお何を言っているのか分からない場合は、発明の認定ができません。',
    link: { text: 'B1 請求項に係る発明の認定', href: '/core/b1-claim' },
    answers: [
      { label: 'はい、認定できる', next: 'cited' },
      { label: 'いいえ、明細書等を見ても不明確', next: 'unclear' }
    ]
  },
  unclear: {
    title: '発明の認定は行いません',
    body: 'この場合、新規性・進歩性の判断の前に「明確性要件」（36条6項2号）の問題になります。社内判定なら、研究員にヒアリングして発明の中身をはっきりさせるところからです。',
    link: { text: 'C6 記載要件', href: '/related/c6-description' },
    result: 'stop'
  },
  cited: {
    title: 'ステップ2：引用発明を認定し、対比します。相違点はありますか？',
    body: '先行技術の中から引用発明を認定し、請求項に係る発明の発明特定事項と比べて、一致点と相違点を洗い出します。独立した2つ以上の引用発明を組み合わせて対比してはいけません。',
    link: { text: 'B4 引用発明の認定 / B5 対比', href: '/core/b5-compare' },
    answers: [
      { label: '相違点がない', next: 'noNovelty' },
      { label: '相違点がある', next: 'step1' }
    ]
  },
  noNovelty: {
    title: '新規性なし',
    body: '請求項に係る発明と引用発明との間に相違点がないので、新規性を有していないと判断します（29条1項）。',
    link: { text: 'B6 新規性の判断', href: '/core/b6-novelty' },
    result: 'ng'
  },
  step1: {
    title: 'ステップ3：相違点について、論理付けができますか？（手順(1)）',
    body: '主引用発明から出発して、副引用発明を適用したり、技術常識を考えたりして、当業者が相違点を埋められる理屈（論理付け）が立つかを考えます。<br>使う材料は「進歩性が否定される方向に働く要素」：動機付け（技術分野の関連性・課題の共通性・作用機能の共通性・示唆）、設計変更等、単なる寄せ集め。',
    link: { text: 'B8 否定する方向の要素', href: '/core/b8-inventive-negative' },
    answers: [
      { label: '論理付けできない（相違点に対応する副引用発明がなく、設計変更等でもない など）', next: 'okStep2' },
      { label: '論理付けできそう', next: 'step3' }
    ]
  },
  okStep2: {
    title: '進歩性あり（手順(2)）',
    body: '否定する方向の要素だけで論理付けができないので、進歩性を有していると判断します。',
    result: 'ok'
  },
  step3: {
    title: 'ステップ4：肯定する方向の要素も含めて総合評価すると？（手順(3)）',
    body: '「進歩性が肯定される方向に働く要素」も含めて、全体で評価し直します。<br>・引用発明と比べた有利な効果（予測を超えた顕著な効果は有力な事情）<br>・阻害要因（主引用発明の目的に反する、機能しなくなる、など）<br>要素の「あり・なし」だけでなく、その程度の差も踏まえて評価します。',
    link: { text: 'B9 肯定する方向の要素', href: '/core/b9-inventive-positive' },
    answers: [
      { label: '総合評価すると論理付けできない', next: 'okStep4' },
      { label: '総合評価しても論理付けできる', next: 'ngStep4' }
    ]
  },
  okStep4: {
    title: '進歩性あり（手順(4)前段）',
    body: '肯定する方向の事情（顕著な効果、阻害要因など）を踏まえると論理付けができないので、進歩性を有していると判断します。',
    result: 'ok'
  },
  ngStep4: {
    title: '進歩性なし（手順(4)後段）',
    body: '総合評価しても当業者が容易に想到できたと論理付けられるので、進歩性を有していないと判断します（29条2項）。<br>社内判定なら、相違点を広げる別の特徴がないか、効果のデータで押せないかを研究員と一緒に考えてみましょう。',
    result: 'ng'
  }
}

const history = ref<string[]>(['start'])
const current = computed(() => nodes[history.value[history.value.length - 1]])

function go(next: string) {
  history.value.push(next)
}
function back() {
  if (history.value.length > 1) history.value.pop()
}
function restart() {
  history.value = ['start']
}
</script>

<template>
  <div class="flow">
    <ol class="trail">
      <li v-for="(id, i) in history" :key="i" :class="{ now: i === history.length - 1 }">{{ nodes[id].title.replace(/（.*?）/g, '') }}</li>
    </ol>

    <div class="card" :class="current.result">
      <h3>{{ current.title }}</h3>
      <p v-html="current.body" />
      <p v-if="current.link" class="link">
        関連：<a :href="withBase(current.link.href)">{{ current.link.text }}</a>
      </p>
      <div v-if="current.answers" class="answers">
        <button v-for="a in current.answers" :key="a.label" type="button" @click="go(a.next)">{{ a.label }}</button>
      </div>
    </div>

    <div class="ctrl">
      <button type="button" :disabled="history.length === 1" @click="back">← ひとつ戻る</button>
      <button type="button" :disabled="history.length === 1" @click="restart">最初から</button>
    </div>
  </div>
</template>

<style scoped>
.flow {
  margin: 24px 0;
}
.trail {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  list-style: none;
  padding: 0 !important;
  margin: 0 0 12px;
  font-size: 12px;
}
.trail li {
  margin: 0 !important;
  color: var(--vp-c-text-3);
}
.trail li:not(:last-child)::after {
  content: ' →';
}
.trail li.now {
  color: var(--vp-c-brand-1);
  font-weight: 700;
}
.card {
  border: 2px solid var(--vp-c-brand-soft);
  border-radius: 14px;
  padding: 18px 20px;
  background: var(--vp-c-bg-soft);
}
.card.ok {
  border-color: var(--vp-c-green-1);
  background: var(--vp-c-green-soft);
}
.card.ng {
  border-color: var(--vp-c-red-1);
  background: var(--vp-c-red-soft);
}
.card.stop {
  border-color: var(--vp-c-yellow-1);
  background: var(--vp-c-yellow-soft);
}
.card h3 {
  margin: 0 0 8px;
  border: none;
  padding: 0;
}
.link {
  font-size: 14px;
}
.answers {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}
.answers button {
  text-align: left;
  border: 1px solid var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 600;
  line-height: 1.5;
}
.answers button:hover {
  background: var(--vp-c-brand-soft);
}
.ctrl {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}
.ctrl button {
  font-size: 13px;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  padding: 2px 12px;
}
.ctrl button:disabled {
  opacity: 0.4;
}
</style>
