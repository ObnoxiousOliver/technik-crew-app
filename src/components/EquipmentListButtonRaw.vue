<template>
  <SettingsListLink
    v-bind="$attrs"
    :to="isGroup ? undefined : {
      name: 'equipment-details',
      params: { id: eq.id }
    }"
    :class="['equipment-list-button', {
      'equipment-list-button--group': isGroup,
      'equipment-list-button--group-open': groupOpen
    }]"
    :arrow="false"
    :isButton="isGroup"
    @click="emit('click')"
  >
    <div class="equipment-list-button__content">

      <div class="equipment-list-button__name-icon-container">
        <i v-if="isGroup" class="equipment-list-button__icon bi-chevron-right" />
        <i v-else :class="['equipment-list-button__icon', typeInfo[eq.type]?.icon ?? typeInfo.other.icon]" />

        <div class="equipment-list-button__name">
          {{ eq.name }}
          <span v-if="eq?.amount && eq?.amount > 1" class="equipment-list-button__amount">
            {{ eq.amount }}x
          </span>
        </div>
      </div>

      <div v-if="isGroup ? eq.equipment[0]?.location : eq.location" class="equipment-list-button__location">
        <LocationDisplay :id="isGroup ? eq.equipment[0]?.location : eq.location" />
      </div>

      <template v-if="!isGroup">
        <!-- <div class="equipment-list-button__qr-code-amount-container">
          <div v-if="eq?.amount && eq?.amount > 1" class="equipment-list-button__amount">
            {{ eq.amount }}x
          </div> -->
        <div v-if="eq.code" class="equipment-list-button__qr-code">
          <i class="bi-qr-code-scan" />
        </div>
        <!-- </div> -->
      </template>

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
      <i :class="['equipment-list-button__icon', typeInfo[eq.type]?.icon ?? typeInfo.other.icon]" />{{ eq.name }}
    </template>

    {{ eq.description }}
    <span class="text-secondary" v-if="!eq.description">
      Keine Beschreibung
    </span>

    <template #buttons>
      <template v-if="!isGroup">
        <ActionSheetButton
          :to="{
            name: 'equipment-edit',
            params: { id: eq.id },
            query: { back: route.fullPath }
          }"
        >
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
          <ActionSheetButton
            :to="{
              name: 'equipment-edit-location',
              params: { id: eq.id },
              query: { back: route.fullPath }
            }"
          >
            <i class="bi-geo-alt" />Standort von <b>{{eq.group}}</b> ändern
          </ActionSheetButton>
        </template>

        <template v-else>
          <ActionSheetButton @click="addToGroup">
            <i class="bi-box-arrow-in-up" />In Gruppe einfügen
          </ActionSheetButton>
          <ActionSheetButton
            :to="{
              name: 'equipment-edit-location',
              params: { id: eq.id },
              query: { back: route.fullPath }
            }"
          >
            <i class="bi-geo-alt" />Standort ändern
          </ActionSheetButton>
        </template>
      </template>

      <template v-else>
        <ActionSheetButton
          :to="{
            name: 'equipment-edit-location',
            params: { id: eq.equipment[0].id },
            query: { back: route.fullPath, group: eq.name }
          }"
        >
          <i class="bi-geo-alt" />Standort von <b>{{eq.name}}</b> ändern
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
import { useRoute } from 'vue-router'
import SettingsListLink from './SettingsListLink.vue'
import ActionSheet from './ActionSheet.vue'
import ActionSheetButton from './ActionSheetButton.vue'
import ActionSheetDivider from './ActionSheetDivider.vue'
import LocationDisplay from './LocationDisplay.vue'

const route = useRoute()
const emit = defineEmits(['click'])

const props = defineProps<{
  eq: Equipment | { type: 'group', name: string, equipment: Equipment[] },
  groupOpen?: boolean
}>()
const equipment = computed(() => props.eq)
const isGroup = computed(() => equipment.value.type === 'group')

const showSheet = ref(false)

const typeInfo = EquipmentTypeInfo

function removeGroup () {
  equipment.value.setGroup(null)
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.equipment-list-button {
  &--group {

  }

  i {
    margin: 0;
  }

  &__icon {
    width: 1rem;
    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);

    .equipment-list-button--group-open & {
      transform: rotate(90deg);
    }
  }

  &__content {
    height: 100%;
    width: stretch;
    display: flex;
    align-items: stretch;
    padding-right: 2rem;

    gap: .5rem;

    & > * {
      display: flex;
      align-items: center;
    }
  }

  &__name, &__location {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__name-icon-container {
    flex: 0 0 65%;
    display: grid;
    grid-template-columns: 2rem 1fr;
    align-items: stretch;
  }

  &__amount {
    color: r.$text-secondary;
    font-size: .8rem;
  }

  &__qr-code {
    width: 0;
    flex: 0 1 1rem;
    overflow: hidden;
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
    width: 0;
    flex: 1 1 auto;
    overflow: hidden;
    color: r.$text-secondary;
    font-size: 0.8rem;
  }
}
</style>
