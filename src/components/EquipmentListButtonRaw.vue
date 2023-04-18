<template>
  <SettingsListLink
    v-bind="$attrs"
    :to="{
      name: 'equipment-details',
      params: { id: eq.id }
    }"
    class="equipment-list-button"
    :arrow="false"
  >
    <div class="equipment-list-button__content">

      <i :class="['equipment-list-button__icon', typeInfo[eq.type]?.icon ?? typeInfo.other.icon]"/>

      <div class="equipment-list-button__name">
        {{ eq.name }}
      </div>

      <div class="equipment-list-button__location">
        {{ eq.location ?? 'N/A' }}
      </div>

      <div class="equipment-list-button__amount">
        {{ eq.amount ? `${eq.amount}x` : '' }}
      </div>

      <div class="equipment-list-button__qr-code">
        <i v-if="eq.code" class="bi-qr-code-scan" />
      </div>

    </div>

    <template #over>
      <Btn
        class="equipment-list-button__options-btn"
        transparent
        @click="showSheet = true"
      >
        <i class="bi-three-dots-vertical" />
      </Btn>
    </template>
  </SettingsListLink>

  <ActionSheet v-model:show="showSheet">
    <template #title>
      <i :class="['equipment-list-button__icon', typeInfo[eq.type]?.icon ?? typeInfo.other.icon]"/>{{ eq.name }}
    </template>

    {{ eq.description }}
    <span class="text-secondary" v-if="!eq.description">
      Keine Beschreibung
    </span>

    <template #buttons>
      <ActionSheetButton :to="{ name: 'equipment-details', params: { id: eq.id } }">
        <i class="bi-pencil-square" />Bearbeiten
      </ActionSheetButton>
      <ActionSheetDivider />

      <template v-if="eq.group">
        <ActionSheetButton @click="removeGroup">
          <i class="bi-box-arrow-down" />Aus <b>{{eq.group}}</b> entfernen
        </ActionSheetButton>
        <ActionSheetButton @click="renameGroup">
          <i class="bi-input-cursor-text" />Gruppe umbenennen
        </ActionSheetButton>
        <ActionSheetButton>
          <i class="bi-geo-alt" />Standort von <b>{{eq.group}}</b> ändern
        </ActionSheetButton>
      </template>

      <template v-else>
        <ActionSheetButton @click="addToGroup">
          <i class="bi-box-arrow-in-up" />In Gruppe einfügen
        </ActionSheetButton>
        <ActionSheetButton
          :to="{
            name: 'equipment-edit',
            params: {
              id: eq.id,
              field: 'location'
            }
          }"
        >
          <i class="bi-geo-alt" />Standort ändern
        </ActionSheetButton>
      </template>
      <ActionSheetDivider />
      <ActionSheetButton>
        <i class="bi-x-lg" />Abbrechen
      </ActionSheetButton>
    </template>
  </ActionSheet>
</template>

<script lang="ts" setup>
import { Equipment, EquipmentTypeInfo } from '@/model/equipment'
import { computed, ref } from 'vue'
import SettingsListLink from './SettingsListLink.vue'

const props = defineProps<{
  eq: Equipment
}>()
const equipment = computed(() => props.eq)

const showSheet = ref(false)

const typeInfo = EquipmentTypeInfo

function removeGroup () {
  equipment.value.setGroup(null)
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.equipment-list-button {
  i {
    margin: 0;
  }

  &__content {
    height: 100%;
    width: stretch;
    display: grid;
    grid-template-columns: 2rem 4fr 3fr minmax(1rem, 1fr) 2rem;
    align-items: stretch;
    padding-right: 1rem;
    line-height: 1;

    & > * {
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
    }
  }

  &__amount {
    color: r.$text-secondary;
  }

  &__qr-code {
    text-align: center;
    color: r.$text-secondary;

    i {
      margin: 0;
    }
  }

  &__options-btn {
    @include r.btnSquare(2rem);
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1rem;
  }

  &__location {
    color: r.$text-secondary;
    font-size: 0.8rem;
  }
}
</style>
