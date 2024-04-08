import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { routerHistory } from "./router"

window.h = routerHistory

createApp(App).mount('#app')
