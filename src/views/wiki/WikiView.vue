<template>
  <UserPage
    :addBtn="true"
    @addBtn="() => {
      router.push({
        name: 'wiki-page-new'
      })
    }"
  >
    <template #title>
      <i class="bi-compass" />Wiki
    </template>
    <template #btns>
      <Btn
        :to="{
          name: 'wiki-archive'
        }"
      >
        <i class="bi-archive" />
      </Btn>
    </template>

    <!-- <SettingsList>
      <SettinsListLink
        class="page-list__item"
        v-for="page in pages"
        :key="page.id"
        :to="{
          name: 'wiki-page',
          params: { id: page.id }
        }"
      >
        <i :class="page.icon || 'bi-file-earmark-text'" />
        {{ page.title }}
      </SettinsListLink>
    </SettingsList> -->

    <Spinner v-if="loading" />

    <div v-else class="page-grid">
      <RouterLink
        v-wave
        class="page-grid__item"
        v-for="(page, i) in pages"
        :key="page.id ?? i"
        :to="{
          name: 'wiki-page',
          params: { id: page.id }
        }"
      >
        <div class="page-grid__item__icon">
          <span class="page-grid__item__icon__emoji" v-if="page.icon && isEmoji(page.icon)">
            <span class="page-grid__item__icon__emoji__glow">
              {{ page.icon }}
            </span>
            <span class="page-grid__item__icon__emoji__symbol">
              {{ page.icon }}
            </span>
          </span>
          <i v-else class="bi-file-earmark-text" />
        </div>
        <div class="page-grid__item__title">
          {{ page.title }}
        </div>
      </RouterLink>
      <RouterLink
        v-if="pages.length === 0"
        v-wave
        class="page-grid__item page-grid__item--new-item"
        :to="{ name: 'wiki-page-new' }"
      >
        <div class="page-grid__item__icon">
          <i class="bi-plus-lg" />
        </div>
        <div class="page-grid__item__title">
          Neue Seite
        </div>
      </RouterLink>
    </div>
  </UserPage>
</template>

<script lang="ts" setup>
import UserPage from '@/layout/UserPage.vue'
import { useRouter } from 'vue-router'
import { useWiki } from '@/stores/wiki'
import { storeToRefs } from 'pinia'

const router = useRouter()
const wiki = useWiki()
const { pages, loading } = storeToRefs(wiki)

function isEmoji (s: string) {
  return /\p{Extended_Pictographic}/ug.test(s)
}
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.page-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 1rem;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 1rem;
    border-radius: r.$radius;
    background-color: r.$bg-secondary;
    color: r.$text-primary;
    text-decoration: none;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: lighten(r.$bg-secondary, 5);
      color: r.$text-primary;
    }

    &__icon {
      font-size: 2rem;

      &__emoji {
        position: relative;

        &__glow {
          position: absolute;
          top: .5rem;
          opacity: 0.3;
          filter: blur(1rem);
        }

        &__symbol {
          position: relative;
          z-index: 1;
        }
      }
    }

    &__title {
      margin-top: 0.5rem;
      font-size: 1.2rem;
    }

    &--new-item {
      background-color: r.$bg-primary;
      color: r.$text-secondary;
      box-shadow: r.$bg-stroke 0 0 0 0.1rem inset;

      &:hover {
        background-color: lighten(r.$bg-primary, 5);
        color: r.$text-primary;
      }
    }
  }
}
</style>
