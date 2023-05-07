<template>
  <Page :navigation="false">
    <div
      :class="['user-page', {
        'user-page--search-expanded': searchExpanded,
        'user-page--has-add-btn': addBtn,
        'user-page--has-search-btn': search
      }]"
      ref="page"
      :style="{
        '--search-btn-left': searchBtnLeft
      }"
    >
      <h2 class="user-page__title">
        <div class="user-page__title__content">
          <slot name="title" />
        </div>
        <!-- <div class="user-page__title__buttons">
              <slot name="btns" />
            </div> -->
        <Transition name="user-page__title__buttons">
          <div v-if="!searchExpanded" class="user-page__title__buttons">
            <slot name="btns" />
            <Btn
              class="user-page__title__buttons__search-btn"
              ref="searchBtnRef"
              v-if="search"
              @click="expandSearch(true)"
            >
              <i class="bi-search" />
            </Btn>
            <Btn v-if="addBtn" @click="$emit('addBtn', $event)" :to="addBtnTo">
              <i class="bi-plus-lg" />
            </Btn>
          </div>
        </Transition>
      </h2>
      <Transition name="user-page__search">
        <div v-if="searchExpanded" class="user-page__search">
          <div class="user-page__search__input">
            <InputField
              class="user-page__search__input__field"
              placeholder="Suchen..."
              inputmode="search"
              @keydown.enter="submit()"
              @keydown.esc="expandSearch(false)"
              @focus="submitted = false"
              @blur="blur"
              @keydown.tab="dontBlur = true"
              ref="searchInputRef"
              v-model="searchInput"
            >
              <template #before>
                <i class="bi-search" />
              </template>
              <template #after>
                <Btn
                  @click="closeClick()"
                  class="user-page__search__input__close-btn"
                  aria-label="Suche schließen"
                >
                  <i class="bi-plus-lg" />
                </Btn>
              </template>
            </InputField>
          </div>
        </div>
      </Transition>
      <SearchMenu
        class="user-page__search-menu scroller-padding"
        :show="searchExpanded && !submitted"
        :query="searchInput"
        @pointerdown="dontBlur = true"
        :items="[
          ...(searchRecents?.map(x => ({
            name: x,
            type: 'recent'
          })) ?? []),
          ...(searchSuggestions?.map(x => ({
            name: x,
            type: 'suggestion'
          })) ?? [])
        ]"
        @selectItem="submit"
        @applyItem="(q) => {
          searchInput = q
          searchInputRef.focus()
        }"
      />
      <Transition name="user-page__scroller">
        <div
          v-show="!searchExpanded || submitted"
          class="user-page__scroller scroller-padding"
        >
          <slot />
        </div>
      </Transition>
    </div>
  </Page>
</template>

<script lang="ts" setup>
import InputField from '@/components/InputField.vue'
import SearchMenu from '@/components/SearchMenu.vue'
import { back } from '@/router'
import { onActivated, onDeactivated, ref, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'

defineProps({
  addBtn: Boolean,
  addBtnTo: [Object, String],
  search: Boolean,
  searchRecents: Array,
  searchSuggestions: Array
})

const emit = defineEmits(['search', 'searchOpen', 'addBtn'])

const router = useRouter()
const route = useRoute()

const searchBtnRef = ref(null)
const searchInputRef = ref(null)
const page = ref(null as HTMLElement| null)
const searchBtnLeft = ref(0)
const searchExpanded = ref(false)

const searchInput = ref()
const submitted = ref(false)
function submit (val?: string) {
  if (val) {
    searchInput.value = val
  }

  if (!searchInput.value) {
    expandSearch(false)
    return
  }

  setTimeout(() => {
    submitted.value = true
    searchInputRef.value?.blur()

    emit('search', searchInput.value)
  }, 0)
}

const dontBlur = ref(false)
function blur () {
  if (dontBlur.value) {
    dontBlur.value = false
    return
  }
  if (!searchInput.value) {
    expandSearch(false)
  }
}

function closeClick () {
  if (searchInput.value) {
    searchInput.value = ''
    if (searchInputRef.value) {
      searchInputRef.value.focus()
    }
  } else {
    expandSearch(false)
  }
}

watch(searchExpanded, (value) => {
  emit('searchOpen', value)
})

onBeforeRouteUpdate((to) => {
  // console.log(to)
  if (!to.query.search) {
    expandSearch(false, false)
  }
})

onActivated(() => {
  if (route.query.search) {
    expandSearch(true, false)
  }
})

onDeactivated(() => {
  expandSearch(false, false)
})

function expandSearch (value?: boolean, push = true) {
  if (value !== undefined && searchExpanded.value === value) {
    return
  }

  const _searchBtnLeft = (searchBtnRef.value?.$el.getBoundingClientRect().left - page.value?.getBoundingClientRect().left) ?? 0
  searchExpanded.value = value !== undefined ? value : !searchExpanded.value

  if (!searchExpanded.value) {
    searchInput.value = ''
  }

  if (_searchBtnLeft) {
    searchBtnLeft.value = _searchBtnLeft
  }

  if (push) {
    if (searchExpanded.value) {
      router.push({
        query: {
          search: true
        }
      })
    } else {
      back(route.path)
    }
  }

  setTimeout(() => {
    if (searchExpanded.value) {
      searchInputRef.value?.focus()
    }
  })
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.user-page {
  height: 100%;
  position: relative;
  margin: 0 -1.5rem;
  padding: 0 1.5rem;

  &__search {
    z-index: 99;
    position: absolute;
    inset: 0 0 auto;
    overflow: hidden;
    padding: 0 1.5rem;

    &__input {
      height: 4rem;
      display: flex;
      align-items: center;

      background: r.$bg-primary;

      &__field {
        flex: 1 1 auto;
        will-change: margin, clip-path, box-shadow, background;
      }

      &__close-btn {
        i {
          display: inline-block;
          transform: rotate(-45deg);
        }
      }
    }

    &-enter-active,
    &-leave-active {
      transition: .5s;

      .user-page__search {
        &__input {
          transition: background .2s;

          &__field {
            width: 0;
            clip-path: inset(0);
            transition: .5s, margin .5s cubic-bezier(0.19, 1, 0.22, 1), clip-path .5s cubic-bezier(0.19, 1, 0.22, 1), box-shadow .5s cubic-bezier(0.19, 1, 0.22, 1);
            box-shadow: none;

            :deep(.input__before) {
              transition: color .5s;
            }
          }
        }
      }
    }
    &-enter-active,
    &-leave-active {
      .user-page__search__input__close-btn i {
        transition: color .5s, transform .5s cubic-bezier(0.19, 1, 0.22, 1);
      }
    }

    &-enter-from,
    &-leave-to {
      .user-page__search {
        &__input {
          background: transparent;

          &__field {
            background: none;
            margin-left: calc(
              var(--search-btn-left) * 1px - 1.5rem
            );
            margin-right: -3rem;
            clip-path: inset(0 3rem 0 0);

            .user-page--has-add-btn & {
              clip-path: inset(0);
              margin-right: -1rem;
            }

            :deep(.input__before) {
              color: r.$text-primary;
            }
          }

          &__close-btn i:is(.user-page--has-add-btn *) {
            transform: none;
            color: r.$text-primary;
          }
        }
      }
    }
  }

  &__search-menu {
    position: absolute;
    inset: 0 0 auto 0;
    max-height: 100vh;
    padding: 4rem 1.5rem 1rem;
  }

  &__title {
    z-index: 99;
    position: relative;
    display: flex;
    align-items: center;
    height: 4rem;
    margin: 0 -1.5rem;
    padding: 0 .5rem 0 1.5rem;
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
    font-size: 1rem;
    font-weight: normal;

    &__content {
      flex: 1 1 auto;
      font-weight: 600;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      :deep(i) {
        margin-right: 1rem;
      }
    }

    &__buttons {
      flex: 0 0 auto;
      display: flex;
      align-items: center;

      :deep(.btn) {
        background: none !important;
        padding: 0;
        width: 3rem;
        height: 3rem;
      }

      &-enter-active {
        transition: 0s .5s;
      }
      &-leave-active {
        transition: 0s;
      }

      &-enter-from,
      &-leave-to {
        opacity: 0;
      }
    }
  }

  &__scroller {
    position: absolute;
    inset: 0;
    padding-top: 4rem;
    overflow: auto;
    margin-bottom: -1rem;

    .router--has-navbar & {
      margin-bottom: -5rem;
    }

    &-enter-active {
      transition: .3s .1s;
    }
    &-leave-active {
      transition: .3s;
    }

    &-enter-from,
    &-leave-to {
      opacity: 0;
    }
  }
}
</style>
