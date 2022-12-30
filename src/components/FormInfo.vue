<template>
  <div :class="['form-info', 'form-info--' + props.type]">
    <!-- <i :class="['form-info__icon', {
      'bi-x': props.type === 'error',
      'bi-check': props.type === 'success'
    }]"/> -->
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    default: 'error'
  }
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.form-info {
  font-size: .8rem;
  margin-top: -.8rem;
  padding: 0 .2rem;

  &--success {
    color: r.$success;
  }
  &--error {
    color: r.$danger;
  }

  &__icon {
    margin-right: .2rem;
  }
}
</style>
