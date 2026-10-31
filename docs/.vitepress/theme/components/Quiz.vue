<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { load, save } from '../storage'

interface Question {
  q: string
  choices: string[]
  answer: number
  explain: string
  source?: string
}
interface QuizFile {
  title?: string
  questions: Question[]
}

const props = defineProps<{ id: string }>()

const files = import.meta.glob<QuizFile>('../../../data/quizzes/*.json', { eager: true, import: 'default' })
const quiz = computed<QuizFile | undefined>(() => files[`../../../data/quizzes/${props.id}.json`])

const picked = ref<(number | null)[]>([])
const best = ref<number | null>(null)

function reset() {
  picked.value = (quiz.value?.questions ?? []).map(() => null)
}
reset()

onMounted(() => {
  best.value = load<number | null>(`quiz:${props.id}`, null)
})

const answered = computed(() => picked.value.filter((p) => p !== null).length)
const correct = computed(
  () => picked.value.filter((p, i) => p !== null && p === quiz.value?.questions[i].answer).length
)
const total = computed(() => quiz.value?.questions.length ?? 0)
const finished = computed(() => total.value > 0 && answered.value === total.value)

function choose(qi: number, ci: number) {
  if (picked.value[qi] !== null) return
  picked.value[qi] = ci
  if (finished.value && (best.value === null || correct.value > best.value)) {
    best.value = correct.value
    save(`quiz:${props.id}`, correct.value)
  }
}
</script>

<template>
  <div v-if="quiz" class="quiz">
    <div class="quiz-head">
      <span class="quiz-label">確認クイズ</span>
      <span class="quiz-title">{{ quiz.title ?? '理解度チェック' }}</span>
      <span v-if="best !== null" class="quiz-best">これまでの最高：{{ best }} / {{ total }}</span>
    </div>

    <ol class="quiz-list">
      <li v-for="(item, qi) in quiz.questions" :key="qi" class="quiz-item">
        <p class="quiz-q" v-html="item.q" />
        <div class="quiz-choices">
          <button
            v-for="(c, ci) in item.choices"
            :key="ci"
            type="button"
            class="quiz-choice"
            :class="{
              chosen: picked[qi] === ci,
              right: picked[qi] !== null && ci === item.answer,
              wrong: picked[qi] === ci && ci !== item.answer
            }"
            :disabled="picked[qi] !== null"
            @click="choose(qi, ci)"
          >
            <span class="mark">{{ picked[qi] !== null && ci === item.answer ? '○' : picked[qi] === ci ? '×' : '' }}</span>
            <span v-html="c" />
          </button>
        </div>
        <div v-if="picked[qi] !== null" class="quiz-explain" :class="picked[qi] === item.answer ? 'ok' : 'ng'">
          <p class="verdict">{{ picked[qi] === item.answer ? '正解です！' : '残念、もう一度考えてみましょう。' }}</p>
          <p v-html="item.explain" />
          <p v-if="item.source" class="src">出典：{{ item.source }}</p>
        </div>
      </li>
    </ol>

    <div class="quiz-foot">
      <span>{{ answered }} / {{ total }} 問回答　正解 {{ correct }} 問</span>
      <button v-if="answered > 0" type="button" class="quiz-reset" @click="reset">もう一度解く</button>
    </div>
    <p v-if="finished" class="quiz-done">
      {{ correct === total ? '全問正解です。この調子！' : '解説を読み返して、もう一度チャレンジしてみましょう。' }}
    </p>
  </div>
  <p v-else class="quiz-missing">クイズ「{{ id }}」が見つかりません（docs/data/quizzes/{{ id }}.json）。</p>
</template>

<style scoped>
.quiz {
  margin: 32px 0;
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 12px;
  padding: 20px 20px 12px;
  background: var(--vp-c-bg-soft);
}
.quiz-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px 12px;
  margin-bottom: 8px;
}
.quiz-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--vp-c-white);
  background: var(--vp-c-brand-1);
  border-radius: 999px;
  padding: 2px 10px;
}
.quiz-title {
  font-weight: 700;
}
.quiz-best {
  margin-left: auto;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.quiz-list {
  padding-left: 1.4em;
}
.quiz-item {
  margin: 20px 0;
}
.quiz-q {
  font-weight: 600;
  margin: 0 0 10px;
}
.quiz-choices {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.quiz-choice {
  display: flex;
  gap: 8px;
  text-align: left;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  border-radius: 8px;
  padding: 10px 12px;
  line-height: 1.6;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.quiz-choice:not(:disabled):hover {
  border-color: var(--vp-c-brand-1);
}
.quiz-choice:disabled {
  cursor: default;
}
.quiz-choice .mark {
  flex: 0 0 1.2em;
  font-weight: 700;
}
.quiz-choice.right {
  border-color: var(--vp-c-green-1);
  background: var(--vp-c-green-soft);
}
.quiz-choice.wrong {
  border-color: var(--vp-c-red-1);
  background: var(--vp-c-red-soft);
}
.quiz-explain {
  margin-top: 10px;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  background: var(--vp-c-bg);
  border-left: 4px solid var(--vp-c-green-1);
}
.quiz-explain.ng {
  border-left-color: var(--vp-c-yellow-1);
}
.quiz-explain p {
  margin: 4px 0;
}
.quiz-explain .verdict {
  font-weight: 700;
}
.quiz-explain .src {
  color: var(--vp-c-text-2);
  font-size: 12px;
}
.quiz-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  border-top: 1px dashed var(--vp-c-divider);
  padding-top: 10px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.quiz-reset {
  border: 1px solid var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  border-radius: 999px;
  padding: 2px 14px;
  font-size: 13px;
}
.quiz-done {
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
.quiz-missing {
  color: var(--vp-c-red-1);
}
</style>
