<template>
  <RouterLink class="nav-btn" v-wave>
    <i :class="`nav-btn__icon bi-${props.icon}`" />
    <i :class="`nav-btn__icon-fill bi-${props.icon}-fill`" />
  </RouterLink>
</template>

<script lang="ts" setup>
const props = defineProps({
  icon: String
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.nav-btn {
  width: 0;
  flex: 1 1 auto;
  position: relative;
  display: grid;
  place-items: center;
  color: inherit;

  &__icon {
    display: block;
  }
  &__icon-fill {
    display: none;
  }

  &.router-link-active {
    .nav-btn {
      &__icon {
        display: none;
      }
      &__icon-fill {
        display: block;
      }
    }

    &::after {
      content: '';
      position: absolute;
      bottom: .5rem;
      width: 1.3rem;
      height: .1rem;
      background: r.$accent;
      border-radius: .05rem;
    }
  }
}
</style>
