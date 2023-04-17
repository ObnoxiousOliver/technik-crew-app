<template>
  <UserPage
    :addBtn="true"
    :addBtnTo="{ name: 'equipment-add' }"
    :search="true"
    @search="search"
  >
    <template #title>
      <i class="bi-speaker"/>Equipment
    </template>
    <template #btns>
      <Btn :to="{ name: 'locations' }" aria-label="Standorte">
        <i class="bi-geo-alt" />
      </Btn>
      <Btn :to="{ name: 'equipment-scan' }" aria-label="Equipment Code Scannen">
        <i class="bi-qr-code-scan" />
      </Btn>
    </template>

    <!-- <LensCard /> -->

    <SettingsList>
      <EquipmentListButton
        v-for="item in eqList"
        :key="item.type === 'group' ? item.name : item.equipment.id"
        :item="item"
      />
    </SettingsList>

    <!-- <EquipmentList :equipment="equipment" /> -->
  </UserPage>
</template>

<script lang="ts" setup>
// import LensCard from '../components/LensCard.vue'
import { computed } from 'vue'
import UserPage from '../../layout/UserPage.vue'
// import EquipmentList from '../components/EquipmentList.vue'
import SettingsList from '../../components/SettingsList.vue'
import EquipmentListButton from '../../components/EquipmentListButton.vue'
import { useEquipment } from '@/stores/equipment'

const equipment = useEquipment()

const eqList = computed(() => {
  const list = []

  equipment.groups.forEach((group: string) => {
    list.push({
      type: 'group',
      name: group,
      equipment: equipment.equipment.filter(eq => eq.group === group)
    })
  })

  equipment.equipment.filter(eq => !eq.group).forEach((eq: any) => {
    list.push({
      type: 'equipment',
      equipment: eq
    })
  })

  // list.sort((a: any, b: any) => {
  //   if (a.type === 'group' && b.type === 'equipment') {
  //     return -1
  //   } else if (a.type === 'equipment' && b.type === 'group') {
  //     return 1
  //   } else {
  //     return a.name.localeCompare(b.name)
  //   }
  // })

  return list
})
</script>
