<template>
  <component
    :is="props.notAForm ? 'div' : 'form'"
    :class="['form', {
      'form--fill-page': props.fillPage,
      'form--disabled': props.disabled
    }]"
  >
    <fieldset
      :disabled="disabled"
      class="form__content"
    >
      <slot />
    </fieldset>
    <Transition name="form__spinner">
      <Spinner v-if="props.disabled" class="form__spinner" />
    </Transition>
  </component>
</template>

<script lang="ts" setup>
const props = defineProps<{
  disabled?: boolean,
  fillPage?: boolean,
  notAForm?: boolean
}>()
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.form {
  position: relative;
  margin-bottom: 2rem;

  &--fill-page {
    min-height: 100%;
    justify-content: center;
    margin-bottom: 0;
  }

  &--disabled {
    .form__content {
      pointer-events: none;
      opacity: .5;
    }

  }
  &__spinner {
    position: absolute;
    inset: 50% 0 auto;
    transform: translateY(-50%);
    pointer-events: none;

    &-enter-active, &-leave-active {
      transition: opacity .2s;
    }
    &-enter-from, &-leave-to {
      opacity: 0;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border: none;
    transition: opacity .2s .1s;
  }

  :deep(p) {
    margin: 0;
  }

  :deep(ul, ol) {
    padding-left: 1.2rem;
  }
}
</style>
