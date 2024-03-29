import { createApp } from 'vue'
import App from './App.vue'
import RouterPage from './layout/RouterPage.vue'
import AppButton from './components/AppButton.vue'
import Spinner from './components/LoadingSpinner.vue'
// import InputField from './components/InputField.vue'
// import UsernameDisplay from './components/UsernameDisplay.vue'
// import Dropdown from './components/DropdownSelection.vue'
// import ToggleSwitch from './components/ToggleSwitch.vue'
// import ActionSheet from './components/ActionSheet.vue'
// import ActionSheetButton from './components/ActionSheetButton.vue'
// import ActionSheetDivider from './components/ActionSheetDivider.vue'
// import FormContainer from './components/FormContainer.vue'
// import FormInfo from './components/FormInfo.vue'
// import FormGroup from './components/FormGroup.vue'
// import TextBox from './components/TextBox.vue'
// import Slider from './components/InputSlider.vue'
// import LocationDisplay from './components/LocationDisplay.vue'
// import InfoCard from './components/InfoCard.vue'
import router from './router'
import VWave from 'v-wave'
import { FocusTrap } from 'focus-trap-vue'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { createPinia } from 'pinia'
import 'bootstrap-icons/font/bootstrap-icons.scss'
import './registerServiceWorker'
import './main'
import { enableMultiTabIndexedDbPersistence, getFirestore } from 'firebase/firestore'

// #region Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDKTBOLLL7-L_OFFnQ1cJtyqwG2iAQn_UA',
  authDomain: 'leibniz-technik-crew.firebaseapp.com',
  projectId: 'leibniz-technik-crew',
  storageBucket: 'leibniz-technik-crew.appspot.com',
  messagingSenderId: '942452136166',
  appId: '1:942452136166:web:e87215a8a6ae2620f4c327'
}
const app = initializeApp(firebaseConfig)
getAuth(app)
getStorage(app)
enableMultiTabIndexedDbPersistence(getFirestore(app))
// #endregion

// #region Create a Pinia instance
const pinia = createPinia()
// #endregion

// #region Create and mount app
createApp(App)
  .component('FocusTrap', FocusTrap)
  .component('Page', RouterPage)
  .component('Btn', AppButton)
  .component('Spinner', Spinner)
  // .component('InputField', InputField)
  // .component('Username', UsernameDisplay)
  // .component('Dropdown', Dropdown)
  // .component('Toggle', ToggleSwitch)
  // .component('ActionSheet', ActionSheet)
  // .component('ActionSheetButton', ActionSheetButton)
  // .component('ActionSheetDivider', ActionSheetDivider)
  // .component('FormContainer', FormContainer)
  // .component('FormInfo', FormInfo)
  // .component('FormGroup', FormGroup)
  // .component('Textbox', TextBox)
  // .component('Slider', Slider)
  // .component('LocationDisplay', LocationDisplay)
  // .component('InfoCard', InfoCard)
  // .use(vfmPlugin())
  .use(VWave, {
    duration: 0.5
  })
  .use(pinia)
  .use(router)
  .mount('#app')
// #endregion

// #region Configure Virtualkeyboard
if ('virtualKeyboard' in navigator) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (navigator.virtualKeyboard as any).overlaysContent = true
}
// #endregion
