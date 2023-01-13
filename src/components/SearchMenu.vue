<template>
  <Transition name="search-menu">
    <TransitionGroup
      tag="ul"
      name="search-menu__item"
      class="search-menu"
      v-if="show"
    >
      <li
        v-for="(item) in shownItems"
        :key="item.name"
        :class="['search-menu__item', {
          'search-menu__item--recent': item.type === 'recent',
          'search-menu__item--suggestion': item.type === 'suggestion',
          'search-menu__item--divider': item.type === 'divider'
        }]"
      >
        <button
          v-if="item.type !== 'divider'"
          class="search-menu__button"
          v-wave
          @click="emit('selectItem', item.name)"
        >
          <i class="bi-clock-history" v-if="item.type === 'recent'"
          /><i class="bi-search" v-if="item.type === 'suggestion'"
          />{{ item.name }}
        </button>
        <Btn
          @click="emit('applyItem', item.name)"
          class="search-menu__apply-button"
        >
          <i class="bi-arrow-up-left" />
        </Btn>
      </li>

      <!-- <li
        v-if="shownItems.length > 5"
        class="search-menu__item search-menu__item--divider"
      />
      <li
        v-if="shownItems.length > 5"
        class="search-menu__item"
      >
        <button
          v-wave
          :class="['search-menu__button', {
            'search-menu__button--showing-more': showMore
          }]"
          @click="showMore = !showMore"
        >
          <i class="bi-chevron-down" />{{ showMore ? 'Weniger anzeigen' : 'Mehr anzeigen' }}
        </button>
      </li> -->
    </TransitionGroup>
  </Transition>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { search } from '@/utilities/search'

const props = defineProps<{
  show: boolean
  query?: string,
  items: { name: string, type: 'recent' | 'suggestion' }[]
}>()

// const showMore = ref(false)

const shownItems = computed(() => {
  const recents = search(
    props.query ?? '',
    props.items.filter(item => item.type === 'recent'),
    (item) => item.name
  )

  // if (recents.length > 0) {
  //   recents.push({ type: 'divider' })
  // }

  return [
    ...recents,
    ...props.items.filter(item => item.type === 'suggestion')
  ]
})

const emit = defineEmits(['selectItem', 'applyItem'])
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.search-menu {
  list-style: none;
  margin: 0 -1.5rem;
  background: r.$bg-primary;
  overflow: auto;

  &-enter-active {
    transition: .5s .1s cubic-bezier(0.19, 1, 0.22, 1);
  }
  &-leave-active {
    transition: .5s cubic-bezier(0.19, 1, 0.22, 1), opacity .5s;
  }

  &-enter-from {
    transform: translateY(-10%);
    opacity: 0;
  }
  &-leave-to {
    transform: translateY(-100%);
    opacity: 0;
  }

  &__item {
    position: relative;
    height: 3rem;

    &--divider {
      height: 1px;
      margin: .5rem 0;
      background: r.$bg-stroke;
    }

    &--empty {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 3rem;
      gap: 1rem;
      color: r.$text-secondary;
      font-size: 1.2rem;
    }

    &-enter-active,
    &-leave-active {
      transition:
        .5s cubic-bezier(0.19, 1, 0.22, 1),
        opacity .5s;
        clip-path: inset(0);

      .search-menu__button {
        transition: transform .5s cubic-bezier(0.19, 1, 0.22, 1);
      }
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
      height: 0;

      .search-menu__button {
        transform: translateY(-100%);
      }
    }
  }

  &__button {
    display: block;
    background: none;
    border: none;
    font: inherit;
    color: inherit;
    text-align: left;
    align-items: center;

    overflow: hidden;
    width: 100%;
    height: 3rem;
    padding: 0 2.5rem;

    cursor: pointer;

    &:focus-visible {
      outline: none;
      box-shadow: r.$focus;
    }

    i {
      display: inline-block;
      margin-right: 1rem;
      transition: .5s cubic-bezier(0.19, 1, 0.22, 1);
    }

    &--showing-more {
      i {
        transform: rotate(180deg);
      }
    }

  }
  &__apply-button {
    background: none !important;
    position: absolute;
    width: 3rem;
    right: 1.5rem;
    top: 0;
    bottom: 0;
    padding: 0;

    i {
      margin-right: 0;
    }
  }
}
</style>
