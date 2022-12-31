<template>
  <Transition name="form-info">
    <div v-if="props.show" :class="['form-info', 'form-info--' + props.type]">
      <!-- <i :class="['form-info__icon', {
        'bi-x': props.type === 'error',
        'bi-check': props.type === 'success'
      }]"/> -->
      <slot />
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    default: 'error'
  },
  show: Object
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.form-info {
  font-size: .8rem;
  margin-top: -.8rem;
  margin-bottom: -.5rem;
  padding: 0 .2rem;
  line-height: 1.25;

  &--success {
    color: r.$success;
  }
  &--error {
    color: r.$danger;
  }

  &__icon {
    margin-right: .2rem;
  }

  &-enter-active, &-leave-active {
    transition: all .2s cubic-bezier(0.19, 1, 0.22, 1);
  }
  &-enter-from, &-leave-to {
    opacity: 0;
    margin-bottom: -1.2rem;
  }
}
</style>
