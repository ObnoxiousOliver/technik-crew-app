<template>
  <div
    :class="['page', {
      'page--heading-hidden': navigation && !headingVisible,
      'page--no-navigation': !navigation
    }]"
  >
    <nav v-if="props.navigation" class="page__navigation">
      <button
        @click="back"
        aria-label="Zurück"
        class="page__back-btn"
        v-wave
      >
        <i class="bi-arrow-left" />
      </button>
      <span
        v-if="$slots.title"
        class="page__navigation__title"
      >
        <slot name="title" />
      </span>
    </nav>
    <main ref="scroller" class="page__scroller">
      <h2
        v-if="$slots.title"
        class="page__title"
        ref="heading"
      >
        <div>
          <slot name="title" />
        </div>
      </h2>
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const scroller = ref(null as null | HTMLElement)

const props = defineProps({
  navigation: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()
const route = useRoute()
function back () {
  if (history.state.back) {
    router.back()
  } else if (route.meta.defaultBackPath) {
    router.replace(route.meta.defaultBackPath)
  } else {
    router.replace('/')
  }
}

onMounted(() => {
  scroller.value?.addEventListener('scroll', onScroll)
  onScroll()
})
onBeforeUnmount(() => {
  scroller.value?.removeEventListener('scroll', onScroll)
})

const headingVisible = ref(true)
function onScroll () {
  headingVisible.value = scroller.value?.scrollTop <= 1 * parseFloat(getComputedStyle(document.documentElement).fontSize)
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.page {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: r.$bg-primary;
  max-width: 30rem;
  margin: 0 auto;

  &--heading-hidden {
    .page {
      &__navigation__title {
        opacity: 1;
        transform: none;
      }
      &__title > div {
        opacity: 0;
        transform: translate(1.5rem, -2.6rem)scale((2/3));
      }
    }
  }

  &--no-navigation {
    .page__scroller {
      padding-top: 0;
    }
  }

  &__scroller {
    position: absolute;
    inset: 0;
    padding: 4rem 1.5rem 0;
    overflow: hidden auto;
  }

  &__title {
    z-index: 1;
    position: relative;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 1.5rem;
    margin: 1rem 0 2rem;
    user-select: none;
    pointer-events: none;

    & > div {
      transform-origin: 0 0;
      transition: transform .5s;
      transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
    }

    :deep(i) {
      margin-right: .5em;
    }
  }

  &__navigation {
    z-index: 1;
    position: relative;
    display: flex;
    align-items: center;
    height: 4rem;
    background: r.$bg-primary;

    &__title {
      font-weight: 600;
      text-transform: uppercase;
      font-size: 1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 1.5rem;
      opacity: 0;
      transform-origin: 0 0;
      transform: translate(-1.5rem, 2.6rem)scale(1.5);

      transition: transform .5s;
      transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
      user-select: none;
      pointer-events: none;

      :deep(i) {
        margin-right: .5em;
      }
    }
  }

  &__back-btn {
    flex: 0 0 auto;
    background: none;
    border: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
    text-align: left;
    padding-left: 1.5rem;
    height: 100%;
    width: 3rem;
  }
}
</style>
