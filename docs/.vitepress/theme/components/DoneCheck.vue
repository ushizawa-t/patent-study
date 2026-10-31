<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useData, useRoute } from 'vitepress'
import { load, normalizePath, remove, save } from '../storage'

const route = useRoute()
const { site } = useData()
const done = ref(false)
// route.path には base（/patent-study/）が付くので外してからキーにする
const key = () => `done:${normalizePath('/' + route.path.slice(site.value.base.length))}`

onMounted(() => {
  done.value = load<boolean>(key(), false)
})

function toggle() {
  done.value = !done.value
  if (done.value) save(key(), true)
  else remove(key())
}
</script>

<template>
  <div class="done-check">
    <button type="button" :class="{ on: done }" @click="toggle">
      {{ done ? '✓ 学習済み（クリックで取り消し）' : 'このページを学習済みにする' }}
    </button>
    <span class="note">記録はこのブラウザの中にだけ保存されます。</span>
  </div>
</template>

<style scoped>
.done-check {
  margin: 40px 0 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
}
button {
  border: 1px solid var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  border-radius: 999px;
  padding: 6px 18px;
  font-weight: 600;
  font-size: 14px;
}
button.on {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-white);
}
.note {
  font-size: 12px;
  color: var(--vp-c-text-3);
}
</style>
