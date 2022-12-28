import { createApp } from 'vue'
import App from './App.vue'
import RouterPage from './layout/RouterPage.vue'
import AppButton from './components/AppButton.vue'
import InputField from './components/InputField.vue'
import UsernameDisplay from './components/UsernameDisplay.vue'
import Dropdown from './components/DropdownSelection.vue'
import ToggleSwitch from './components/ToggleSwitch.vue'
import ActionSheet from './components/ActionSheet.vue'
import ActionSheetButton from './components/ActionSheetButton.vue'
import Spinner from './components/LoadingSpinner.vue'
import router from './router'
import VWave from 'v-wave'
import { FocusTrap } from 'focus-trap-vue'

import 'bootstrap-icons/font/bootstrap-icons.scss'
import './registerServiceWorker'
// import { vfmPlugin } from 'vue-final-modal'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { createPinia } from 'pinia'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDKTBOLLL7-L_OFFnQ1cJtyqwG2iAQn_UA',
  authDomain: 'leibniz-technik-crew.firebaseapp.com',
  projectId: 'leibniz-technik-crew',
  storageBucket: 'leibniz-technik-crew.appspot.com',
  messagingSenderId: '942452136166',
  appId: '1:942452136166:web:e87215a8a6ae2620f4c327'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
getAuth(app)
getFirestore(app)

const pinia = createPinia()

// Create and mount app
createApp(App)
  .component('FocusTrap', FocusTrap)
  .component('Page', RouterPage)
  .component('Btn', AppButton)
  .component('InputField', InputField)
  .component('Dropdown', Dropdown)
  .component('Toggle', ToggleSwitch)
  .component('Username', UsernameDisplay)
  .component('ActionSheet', ActionSheet)
  .component('ActionSheetButton', ActionSheetButton)
  .component('Spinner', Spinner)
  // .use(vfmPlugin())
  .use(VWave)
  .use(pinia)
  .use(router)
  .mount('#app')
