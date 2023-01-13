<template>
  <UserPage
    :addBtn="true"
    @addBtn="router.push('/equipment/add')"
    :search="true"
    @search="search"
    @searchOpen="inSearchMenu = $event"
    :searchRecents="[
    ]"
  >
    <template #title>
      <i class="bi-speaker"/>Equipment
    </template>

    <EquipmentList :equipment="equipment" />
  </UserPage>
</template>

<script lang="ts" setup>
import { onActivated, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import UserPage from '../layout/UserPage.vue'
import EquipmentList from '../components/EquipmentList.vue'
import { Equipment } from '../model/equipment'
const router = useRouter()

const equipment = ref([])

const searchQuery = ref('')
const inSearchMenu = ref(false)
function search (e: {
  type: string,
  value: string
}) {
  if (e.type === 'search') {
    searchQuery.value = e.value
  } else if (e.type === 'open-close') {
    inSearchMenu.value = e.value
  }
}

onMounted(() => {
  updateEquipment()
  console.log(equipment.value)
})

async function updateEquipment () {
  equipment.value = await Equipment.get()
}
</script>
