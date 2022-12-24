<template>
  <UserPage>
    <template #title>
      <i class="bi-speaker"/>Equipment
    </template>

    {{ equipment }}

    <button @click="addEquipment">Add</button>

  </UserPage>
</template>

<script lang="ts" setup>
import { addDoc, collection, getDocs, getFirestore, query } from '@firebase/firestore'
import { onMounted, ref } from 'vue'
import UserPage from '../layout/UserPage.vue'
import { Equipment, EquipmentDB } from '../model/equipment'

const db = getFirestore()

const equipment = ref([])

async function addEquipment () {
  await addDoc(collection(db, 'equipment'), new Equipment({
    name: 'Some Eq'
  }).toDB())

  updateEquipment()
}

onMounted(() => {
  updateEquipment()
})

async function updateEquipment () {
  const querySnapshot = await getDocs(query(collection(db, 'equipment')))

  equipment.value = []

  querySnapshot.forEach(doc => {
    equipment.value.push(doc.data() as EquipmentDB)
  })
}
</script>
