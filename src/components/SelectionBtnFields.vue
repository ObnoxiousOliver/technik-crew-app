<template>
  <div class="selection-btn-fields">
    <template
      v-for="(field, i) in fields"
      :key="i"
    >
      <SelectionBtnField
        :isFragment="true"
        :items="field"
        v-model:active="activeItems"
        :buttonAttrs="buttonAttrs"
        :onlyEmit="onlyEmit"
        @itemClick="emit('itemClick', $event)"
      />
      <div class="selection-btn-fields__divider" v-if="i !== fields.length - 1" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import SelectionBtnField from './SelectionBtnField.vue'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  fields: {
    value: string
    ariaLabel?: string
    label?: string
    icon?: string,
    justButton?: boolean
  }[][]
  onlyEmit?: boolean
  active: Record<string, boolean>
  buttonAttrs?: Record<string, unknown>
}>()

const emit = defineEmits([
  'update:active',
  'itemClick'
])

const activeItems = useVModel(props, 'active', emit)
</script>

<style lang="scss" scope>
@use '../scss' as r;

.selection-btn-fields {
  @include r.box;
  padding: .25rem;
  margin: 1rem 0;
  display: flex;
  overflow-x: auto;

  &__divider {
    flex: 0 0 auto;
    width: 1px;
    background: r.$bg-stroke;
    margin: .5rem .25rem;
  }
}
</style>
