<template>
  <div
    :class="['checkbox', {
      'checkbox--checked': value
    }]"
  >
    <input
      class="checkbox__input"
      type="checkbox"
      v-model="value"
      :id="id"
    >
    <i class="bi-check2 checkbox__check" />
  </div>

</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue?: boolean
  id?: string
}>()

const emit = defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue', emit)
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.checkbox {
  display: inline-block;
  vertical-align: -.25rem;
  position: relative;
  @include r.box;
  width: 1.2rem;
  height: 1.2rem;
  box-shadow: r.$bg-stroke 0 0 0 1px;
  transition: .2s;

  &:hover:not(&--checked) {
    background: lighten(r.$bg-secondary, 5%);
  }

  &--checked {
    background: r.$text-primary;
    box-shadow: none;

    .checkbox__check {
      transform: scale(1);
      opacity: 1;
    }
  }

  &__input {
    appearance: none;
    position: absolute;
    border-radius: r.$radius;
    inset: 0;
    transition: .2s;

    &:focus-visible {
      outline: none;
      box-shadow: r.$focus;
    }
  }

  &__check {
    color: r.$bg-primary;
    pointer-events: none;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    inset: 0;
    font-size: .8rem;
    opacity: 0;
    transform: scale(.5);
    transition: .2s;
  }
}
</style>
