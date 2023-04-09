<template>
  <div :class="['form-group', {
    'form-group--inline': props.inline
  }]">
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  inline?: boolean
}>()
</script>

<style lang="scss" scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: .5rem;

  &--inline {
    flex-direction: row;
    align-items: center;
    gap: 1rem;

    & > :deep(.input),
    & > :deep(.dropdown),
    & > :deep(label),
    & > :deep(.btn),
    & > :deep(.fill-width) {
      &:not(.no-grow) {
        flex: 1 1 auto;
        width: 0;
      }
    }
  }

  &.space-top {
    margin-top: 1rem;
  }

  &.space-bottom {
    margin-bottom: 1rem;
  }
}
</style>
