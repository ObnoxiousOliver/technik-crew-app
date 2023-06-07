<template>
  <li
    :class="['settings-list-option', {
      'settings-list-option--has-desc': $slots.desc
    }]"
  >
    <label :for="props.for" class="settings-list-option__label">
      <div class="settings-list-option__title">
        <slot />
      </div>
      <div v-if="$slots.desc" class="settings-list-option__desc">
        <slot name="desc" />
      </div>
    </label>
    <div v-if="$slots.input" class="settings-list-option__input">
      <slot name="input" />
    </div>
  </li>
</template>

<script lang="ts" setup>
const props = defineProps({
  for: String
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.settings-list-option {
  display: flex;
  padding: 0 1.5rem;
  margin: 1rem 0;
  gap: 1rem;
  align-items: center;

  &--has-desc {
    margin: 1rem 0;
    padding: 0 1.5rem;
  }

  &__title {
    margin-bottom: .5rem;
    :deep(i) {
      margin-right: .5rem;
    }
  }

  &__label {
    flex: 1 1 auto;
    width: 0;
    line-height: 1.25;
  }

  &__desc {
    color: r.$text-secondary;
  }

  &__input {
    flex: 0 0 auto;
  }
}
</style>
