<template>
  <h2>
    Technik Crew App<br>
    Development started since
  </h2>
  <h3>
    {{ days }} Days<br>
    {{ hours }} Hours<br>
    {{ minutes }} Minutes<br>
    {{ seconds }} Seconds<br>
    {{ miliseconds }} Miliseconds
  </h3>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const time = ref('0')
const days = ref()
const hours = ref()
const minutes = ref()
const seconds = ref()
const miliseconds = ref()

const start = 1669823168271

update()
function update () {
  const elapsed = Date.now() - start
  days.value = Math.floor(elapsed / (24 * 60 * 60 * 1000))
  hours.value = Math.floor(elapsed / (60 * 60 * 1000)) % 24
  minutes.value = Math.floor(elapsed / (60 * 1000)) % 60
  seconds.value = Math.floor(elapsed / 1000) % 60
  miliseconds.value = elapsed % 1000
}
setInterval(update)
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;600&display=swap');

body {
  background: black;
  color: white;
  font-family: Poppins, sans-serif;
  text-align: center;
  height: 100vh;
  margin: 0;
  display: grid;
  place-items: center;
  padding-bottom: 5rem;
  box-sizing: border-box;
}

h2 {
  font-weight: 300;
}
h3 {
  font-weight: 600;
}
</style>
