<template>
  <div
    :class="['page', {
      'page--heading-hidden': navigation && !headingVisible,
      'page--no-navigation': !navigation,
      'page--has-add-btn': props.addBtn,
      'page--opaque-titlebar': props.opaqueTitlebar,
      'page--pad-bottom': props.padBottom
    }]"
    ref="root"
  >
    <nav v-if="props.navigation" class="page__navigation">
      <Btn
        class="page__back-btn"
        @click="back"
        aria-label="Zurück"
      >
        <i class="bi-arrow-left" />
      </Btn>
      <span
        v-if="$slots.title"
        class="page__navigation__title"
      >
        <slot name="title" />
      </span>
      <slot name="btns"/>
      <Btn
        class="page__add-btn"
        v-if="props.addBtn"
        @click="props.addBtn"
        aria-label="Hinzufügen"
      >
        <i class="bi-plus-lg" />
      </Btn>
    </nav>
    <main ref="scroller" class="page__scroller scroller-padding">
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
import { back as _back } from '@/router'

const scroller = ref(null as null | HTMLElement)

const root = ref(null as null | HTMLElement)

const props = defineProps({
  navigation: {
    type: Boolean,
    default: true
  },
  addBtn: {
    type: Function,
    default: undefined
  },
  buttons: {
    type: Array,
    default: () => []
  },
  beforeBack: {
    type: Function,
    default: undefined
  },
  opaqueTitlebar: {
    type: Boolean,
    default: false
  },
  padBottom: {
    type: Boolean,
    default: false
  }
})

function back () {
  if (props.beforeBack) {
    props.beforeBack(_back)
  } else {
    _back()
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

defineExpose({
  root
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.page {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: r.$bg-primary;
  margin: 0 auto;
  will-change: transform;

  &--heading-hidden {
    .page {
      &__navigation__title {
        opacity: 1;
        transform: none;
      }
      &__title > div {
        opacity: 0;
        transform: translate(2rem, -2.6rem)scale(.6666666667);
      }
    }
  }

  &--no-navigation {
    .page__scroller {
      padding-top: 0;
      scroll-padding-top: 0;
    }
  }

  &--has-add-btn {
    .page__scroller {
      padding-bottom: 6rem;
    }
  }

  &__scroller {
    position: absolute;
    inset: 0;
    padding-top: 4rem;
    scroll-padding-top: 4rem;
    overflow: hidden auto;

    .page--pad-bottom & {
      padding-bottom: 15rem;
    }
  }

  &__title {
    z-index: 9;
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

      & > :deep(i) {
        margin-right: .5em;
      }
    }

  }

  &__navigation {
    z-index: 9;
    position: relative;
    display: flex;
    align-items: center;
    height: 4rem;
    background: linear-gradient(
      to bottom,
      r.$bg-primary 0%,
      rgba(r.$bg-primary, 0.987) 12.3%,
      rgba(r.$bg-primary, 0.952) 23.5%,
      rgba(r.$bg-primary, 0.897) 33.4%,
      rgba(r.$bg-primary, 0.826) 42.4%,
      rgba(r.$bg-primary, 0.743) 50.4%,
      rgba(r.$bg-primary, 0.651) 57.5%,
      rgba(r.$bg-primary, 0.553) 63.9%,
      rgba(r.$bg-primary, 0.454) 69.7%,
      rgba(r.$bg-primary, 0.356) 74.9%,
      rgba(r.$bg-primary, 0.264) 79.6%,
      rgba(r.$bg-primary, 0.18) 84%,
      rgba(r.$bg-primary, 0.108) 88.2%,
      rgba(r.$bg-primary, 0.052) 92.1%,
      rgba(r.$bg-primary, 0.014) 96.1%,
      transparent 100%
    );
    padding: 0 .5rem;

    .page--opaque-titlebar & {
      background: r.$bg-primary;
    }

    :deep(:where(.btn)) {
      @include r.btnTransparent;
      @include r.btnSquare;
      flex: 0 0 auto;
    }

    &__title {
      flex: 1 1 auto;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 1.5rem;
      opacity: 0;
      transform-origin: 0 0;
      transform: translate(-2rem, 2.6rem)scale(1.5);

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

  }

  &__add-btn {

  }
}
</style>
