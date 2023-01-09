<template>
  <UserPage
    :addBtn="true"
    @addBtn="router.push('/equipment/add')"
    :search="true"
  >
    <template #title>
      <i class="bi-speaker"/>Equipment
    </template>

  </UserPage>
</template>

<script lang="ts" setup>
import { onActivated, ref } from 'vue'
import { useRouter } from 'vue-router'
import UserPage from '../layout/UserPage.vue'
import { Equipment } from '../model/equipment'

const router = useRouter()

const equipment = ref([])
const history = ref({})

onActivated(() => {
  updateEquipment()
})

async function updateEquipment () {
  equipment.value = await Equipment.get()

  for (const eq of equipment.value) {
    history.value[eq.id] = await eq.getHistory()
  }
}
</script>
