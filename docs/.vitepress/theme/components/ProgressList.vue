<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import { load, normalizePath } from '../storage'

interface Item {
  text: string
  link: string
}
interface Group {
  text: string
  items: Item[]
}

const { theme } = useData()
const groups = computed<Group[]>(() => (theme.value.sidebar as Group[]).filter((g) => g.text !== '資料'))
const tick = ref(0)
const ready = ref(false)

function refresh() {
  tick.value++
}
onMounted(() => {
  ready.value = true
  window.addEventListener('patent-study:update', refresh)
  window.addEventListener('storage', refresh)
})
onBeforeUnmount(() => {
  window.removeEventListener('patent-study:update', refresh)
  window.removeEventListener('storage', refresh)
})

function isDone(link: string) {
  void tick.value
  return ready.value && load<boolean>(`done:${normalizePath(link)}`, false)
}
const doneCount = computed(() => groups.value.flatMap((g) => g.items).filter((i) => isDone(i.link)).length)
const totalCount = computed(() => groups.value.flatMap((g) => g.items).length)
</script>

<template>
  <div class="progress">
    <div class="bar-wrap" role="progressbar" :aria-valuenow="doneCount" :aria-valuemax="totalCount">
      <div class="bar" :style="{ width: `${totalCount ? (doneCount / totalCount) * 100 : 0}%` }" />
    </div>
    <p class="count">学習済み：{{ doneCount }} / {{ totalCount }} ページ</p>
    <div class="groups">
      <section v-for="g in groups" :key="g.text">
        <h4>{{ g.text }}</h4>
        <ul>
          <li v-for="i in g.items" :key="i.link" :class="{ done: isDone(i.link) }">
            <span class="check">{{ isDone(i.link) ? '✓' : '・' }}</span>
            <a :href="withBase(i.link)">{{ i.text }}</a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<style scoped>
.progress {
  margin: 16px 0 24px;
}
.bar-wrap {
  height: 10px;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
  overflow: hidden;
}
.bar {
  height: 100%;
  background: var(--vp-c-brand-1);
  transition: width 0.3s;
}
.count {
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0 24px;
}
h4 {
  margin: 16px 0 4px;
  font-size: 15px;
}
ul {
  list-style: none;
  padding-left: 0 !important;
  margin: 0;
}
li {
  margin: 2px 0 !important;
  font-size: 14px;
}
.check {
  display: inline-block;
  width: 1.4em;
  color: var(--vp-c-text-3);
}
li.done .check {
  color: var(--vp-c-green-1);
  font-weight: 700;
}
</style>
