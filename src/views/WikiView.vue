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

    <SettingsList>
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
    </SettingsList>
  </UserPage>
</template>

<script lang="ts" setup>
import UserPage from '@/layout/UserPage.vue'
import SettingsList from '@/components/SettingsList.vue'
import SettinsListLink from '@/components/SettingsListLink.vue'
import { onMounted, ref } from 'vue'
import { WikiPage, WikiPageDB } from '../model/wiki'
import { useRouter } from 'vue-router'

const router = useRouter()
const pages = ref<WikiPageDB>([])

onMounted(async () => {
  pages.value = await WikiPage.get()
})
</script>
