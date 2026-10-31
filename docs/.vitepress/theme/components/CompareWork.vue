<script setup lang="ts">
import { computed, ref } from 'vue'

interface Element {
  text: string
  answer: 'same' | 'diff'
  note: string
}
interface Work {
  title: string
  claim: string
  reference: string
  elements: Element[]
  conclusion: string
  source?: string
}

const props = defineProps<{ id: string }>()
const files = import.meta.glob<Work>('../../../data/compare/*.json', { eager: true, import: 'default' })
const work = computed<Work | undefined>(() => files[`../../../data/compare/${props.id}.json`])

const marks = ref<('same' | 'diff' | null)[]>((work.value?.elements ?? []).map(() => null))
const checked = ref(false)

const allMarked = computed(() => marks.value.every((m) => m !== null))
const score = computed(() => marks.value.filter((m, i) => m === work.value?.elements[i].answer).length)

function mark(i: number, v: 'same' | 'diff') {
  if (checked.value) return
  marks.value[i] = v
}
function reset() {
  marks.value = marks.value.map(() => null)
  checked.value = false
}
</script>

<template>
  <div v-if="work" class="cw">
    <h3 class="cw-title">{{ work.title }}</h3>
    <div class="cw-docs">
      <div class="doc">
        <p class="doc-label">請求項（本願）</p>
        <p v-html="work.claim" />
      </div>
      <div class="doc">
        <p class="doc-label">引用発明（先行技術）</p>
        <p v-html="work.reference" />
      </div>
    </div>

    <p class="cw-how">請求項を分けて書いた各要素（発明特定事項）が、引用発明と「一致」するか「相違」するかを選んでください。</p>
    <table class="cw-table">
      <thead>
        <tr>
          <th>発明特定事項</th>
          <th class="sel">あなたの判断</th>
          <th v-if="checked" class="ans">答え</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(el, i) in work.elements" :key="i">
          <td>
            <span v-html="el.text" />
            <p v-if="checked" class="note" v-html="el.note" />
          </td>
          <td class="sel">
            <button type="button" :class="{ on: marks[i] === 'same' }" :disabled="checked" @click="mark(i, 'same')">一致</button>
            <button type="button" :class="{ on: marks[i] === 'diff' }" :disabled="checked" @click="mark(i, 'diff')">相違</button>
          </td>
          <td v-if="checked" class="ans" :class="marks[i] === el.answer ? 'ok' : 'ng'">
            {{ el.answer === 'same' ? '一致' : '相違' }}
            <span>{{ marks[i] === el.answer ? '○' : '×' }}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="cw-ctrl">
      <button v-if="!checked" type="button" class="primary" :disabled="!allMarked" @click="checked = true">答え合わせ</button>
      <button v-else type="button" @click="reset">もう一度</button>
      <span v-if="checked">{{ score }} / {{ work.elements.length }} 正解</span>
    </div>
    <div v-if="checked" class="cw-conclusion">
      <p class="label">まとめ</p>
      <p v-html="work.conclusion" />
      <p v-if="work.source" class="src">出典：{{ work.source }}</p>
    </div>
  </div>
</template>

<style scoped>
.cw {
  margin: 28px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 18px 20px;
}
.cw-title {
  margin: 0 0 12px !important;
  border: none !important;
  padding: 0 !important;
}
.cw-docs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}
.doc {
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
}
.doc p {
  margin: 4px 0;
}
.doc-label {
  font-weight: 700;
  font-size: 12px;
  color: var(--vp-c-brand-1);
}
.cw-how {
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.cw-table {
  display: table;
  width: 100%;
  font-size: 14px;
}
.cw-table th.sel,
.cw-table td.sel {
  white-space: nowrap;
  width: 1%;
}
.cw-table td.sel button {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 2px 10px;
  margin: 2px;
}
.cw-table td.sel button.on {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
}
.cw-table td.ans {
  white-space: nowrap;
  font-weight: 700;
}
.cw-table td.ans.ok {
  color: var(--vp-c-green-1);
}
.cw-table td.ans.ng {
  color: var(--vp-c-red-1);
}
.note {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.cw-ctrl {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
}
.cw-ctrl button {
  border: 1px solid var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  border-radius: 999px;
  padding: 4px 16px;
  font-weight: 600;
}
.cw-ctrl button.primary {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
}
.cw-ctrl button:disabled {
  opacity: 0.4;
}
.cw-conclusion {
  margin-top: 12px;
  background: var(--vp-c-tip-soft);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
}
.cw-conclusion .label {
  font-weight: 700;
  margin: 0;
}
.src {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
