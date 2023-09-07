<template>
  <div
    :class="['info-card', {
      'info-card--danger': danger
    }]"
  >
    <div
      v-if="$slots.title || title || $slots.desc || desc"
      class="info-card__header"
    >
      <div v-if="$slots.title || title" class="info-card__title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <div v-if="$slots.desc || desc" class="info-card__desc">
        <slot name="desc">
          {{ desc }}
        </slot>
      </div>
    </div>
    <div v-if="$slots.default" class="info-card__content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title?: string
  desc?: string
  danger?: boolean
}>()
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.info-card {
  @include r.box;
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  padding: 1.5rem;
  gap: 1rem;

  &__header {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 500;

    & > :deep(i:first-child), & > :deep(span > i:first-child) {
      margin-right: .5rem;
    }
  }

  &__desc {
    color: r.$text-secondary;
  }

  &__content {
    flex: 1 1 auto;
  }

  &--danger {
    color: r.$danger;
  }
}
</style>
