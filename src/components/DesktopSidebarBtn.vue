<template>
  <RouterLink
    v-wave
    :to="to"
    :class="['sidebar-button', {
      'sidebar-button--active': active
    }]"
  >
    <slot />
  </RouterLink>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  to: {
    type: [String, Object],
    required: true
  }
})

const active = computed(() => route.meta.root === router.resolve(props.to).meta.root)
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.sidebar-button {
  display: flex;
  align-items: center;
  color: r.$text-primary;
  text-decoration: none;
  padding: 0 1rem;
  line-height: 3rem;
  border-radius: r.$radius;
  transition: background-color .2s, box-shadow .2s;

  &:hover {
    background-color: lighten(r.$bg-secondary, 5);
  }

  &--active {
    background-color: lighten(r.$bg-secondary, 5);
  }

  &:focus-visible {
    box-shadow: r.$focus;

    &::before {
      content: none;
    }
  }

  :deep(i) {
    margin-right: 0.5rem;
  }
}
</style>
