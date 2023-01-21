<template>
  <Page>
    <template #title>
      <i :class="page?.icon || 'bi-file-earmark-text'" />
      {{ page?.title }}
    </template>
  </Page>
</template>

<script lang="ts" setup>
import { WikiPage, WikiPageDB } from '@/model/wiki'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const page = ref<WikiPageDB>()

WikiPage.get(route.params.id)
  .then(p => {
    page.value = p
  })
</script>
