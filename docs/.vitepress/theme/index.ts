import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Quiz from './components/Quiz.vue'
import DoneCheck from './components/DoneCheck.vue'
import ProgressList from './components/ProgressList.vue'
import InventiveFlow from './components/InventiveFlow.vue'
import CompareWork from './components/CompareWork.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Quiz', Quiz)
    app.component('DoneCheck', DoneCheck)
    app.component('ProgressList', ProgressList)
    app.component('InventiveFlow', InventiveFlow)
    app.component('CompareWork', CompareWork)
  }
} satisfies Theme
