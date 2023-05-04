<template>
  <UserPage
    :addBtn="true"
    :addBtnTo="{ name: 'equipment-add' }"
    :search="true"
    @search="search"
  >
    <template #title>
      <i class="bi-speaker" />Equipment
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

    <Spinner v-if="eqList.length === 0 && equipment.loading" />

    <template v-else-if="eqList.length === 0">
      <p class="text-secondary text-center">
        Kein Equipment
      </p>
    </template>

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
import { Equipment } from '@/model/equipment'

const equipment = useEquipment()

interface EqListItem {
  type: 'group' | 'equipment'
  name?: string
  equipment?: Equipment | Equipment[]
}

const eqList = computed<EqListItem[]>(() => {
  const list: EqListItem[] = []

  equipment.groups.forEach((group: string) => {
    list.push({
      type: 'group',
      name: group,
      equipment: equipment.equipment.filter(eq => eq.group === group)
    })
  })

  equipment.equipment.filter(eq => !eq.group).forEach((eq) => {
    list.push({
      type: 'equipment',
      equipment: eq
    })
  })

  list.sort((a, b) => {
    if (a.type === 'group' && b.type === 'equipment') {
      return -1
    } else if (a.type === 'equipment' && b.type === 'group') {
      return 1
    } else if (a.type === 'group' && b.type === 'group') {
      return a.name?.localeCompare(b.name) ?? 0
    } else {
      return a.equipment.name?.localeCompare(b.equipment.name) ?? 0
    }
  })

  return list
})
</script>
