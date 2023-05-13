<template>
  <div
    v-if="!isFragment"
    :class="['selection-btn-field', {
      'selection-btn-field--is-fragment': isFragment
    }]"
    ref="field"
  />

  <Teleport
    v-if="field || isFragment"
    :to="field"
    :disabled="isFragment"
  >
    <button
      v-for="(item, i) in items"
      :key="item.value"
      :class="['selection-btn-field__btn', {
        'selection-btn-field__btn--active': !item.justButton && activeItems[item.value],
        'selection-btn-field__btn--has-label': item.label,
        'selection-btn-field__btn--open-right': !!activeItems[items[i + 1]?.value],
        'selection-btn-field__btn--open-left': !!activeItems[items[i - 1]?.value]
      }]"
      :aria-label="item.ariaLabel"
      @click="(onlyEmit || item.justButton) ? emit('itemClick', item.value) : toggle(item.value)"
      v-bind="buttonAttrs"
    >
      <i v-if="item.icon" :class="item.icon" />
      {{ item.label }}
    </button>
  </Teleport>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { ref } from 'vue'

const props = defineProps<{
  active: Record<string, boolean>,
  items:{
    value: string,
    ariaLabel?: string,
    label?: string,
    icon?: string,
    justButton?: boolean
  }[],
  onlyEmit?: boolean,
  buttonAttrs?: Record<string, unknown>
  isFragment?: boolean
}>()

const emit = defineEmits([
  'update:active',
  'itemClick'
])
const field = ref<HTMLElement>()

const activeItems = useVModel(props, 'active', emit)
function toggle (v: string) {
  activeItems.value[v] = !activeItems.value[v]
  emit('itemClick', v)
}
</script>

<style lang="scss" scope>
@use '../scss' as r;

.selection-btn-field {
  display: flex;

  &:not(&--is-fragment) {
    @include r.box;
    margin: 1rem 0;
    overflow-x: auto;
    padding: .5rem;
  }

  &__btn {
    appearance: none;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    flex: 1 0 2.5rem;
    height: 2.5rem;
    width: 2.5rem;
    border-radius: r.$radius - .25rem;

    transition: .2s;

    &:hover:not(&--active) {
      background: lighten(r.$bg-secondary, 5%);
    }

    &--has-label {
      width: auto;
      padding: 0 1rem;
      border-radius: r.$radius;
      white-space: nowrap;
      i {
        margin-right: .5rem;
      }
    }

    &--active {
      background: r.$text-primary;
      color: r.$bg-secondary;

      &.selection-btn-field__btn {
        &--open-right {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        &--open-left {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      }
    }

  }
}
</style>
