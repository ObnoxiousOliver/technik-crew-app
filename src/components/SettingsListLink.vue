<template>
  <li
    :class="['settings-list-item', {
      'settings-list-item--danger': props.danger
    }]"
  >
    <Component
      :is="props.isButton ? 'button' : 'RouterLink'"
      class="settings-list-item__button"
      v-wave
      :to="props.to"
      @click="emit('click')"
      :type="props.isButton ? 'button' : undefined"
    >
      <div class="settings-list-item__content">
        <slot />
      </div>
      <i v-if="props.arrow === 'link'" class="settings-list-item__arrow bi-box-arrow-up-right" />
      <i v-else-if="props.arrow" class="settings-list-item__arrow bi-chevron-right" />
    </Component>

    <slot name="over" />
  </li>
</template>

<script lang="ts" setup>
const emit = defineEmits(['click'])

const props = defineProps({
  to: [Object, String],
  danger: Boolean,
  isButton: Boolean,
  arrow: { type: [Boolean, String], default: () => true }
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
    width: 0;
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    :deep(i) {
      margin-right: 1rem;
    }
  }
}
</style>
