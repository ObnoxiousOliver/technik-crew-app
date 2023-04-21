<template>
  <li
    :class="['settings-list-item', {
      'settings-list-item--danger': props.danger
    }]"
  >
    <component
      :is="props.isButton ? 'button' : 'RouterLink'"
      class="settings-list-item__button"
      v-wave
      :to="props.to"
      @click="emit('click')"
    >
      <div class="settings-list-item__content">
        <slot />
      </div>
      <i v-if="props.arrow" class="settings-list-item__arrow bi-chevron-right" />
    </component>

    <slot name="over" />
  </li>
</template>

<script lang="ts" setup>
const emit = defineEmits(['click'])

const props = defineProps({
  to: [Object, String],
  danger: Boolean,
  isButton: Boolean,
  arrow: { type: Boolean, default: () => true }
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.settings-list-item {
  position: relative;

  &--danger {
    color: r.$danger;
  }

  &__button {
    appearance: none;
    background: none;
    border: none;
    font: inherit;
    width: 100%;
    text-align: left;
    display: flex;
    color: inherit;
    text-decoration: none;
    padding: 0 1.5rem;
    line-height: 3rem;
    height: 3rem;
  }

  &__content {
    height: 100%;
    flex: 1 1 auto;

    :deep(i) {
      margin-right: 1rem;
    }
  }
}
</style>
