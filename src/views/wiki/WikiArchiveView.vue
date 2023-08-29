<template>
  <Page>
    <template #title>
      <i class="bi-archive" />Wikiarchiv
    </template>

    <Spinner v-if="loading" />

    <ul v-else>
      <li v-for="(page, i) in (archivedPages as WikiPage[])" :key="page.id ?? i">
        <Btn
          class="page-list__item"
          :to="{
            name: 'wiki-page-details',
            params: { id: page.id },
            query: { back: $route.fullPath }
          }"
        >
          <i v-if="!page.icon" class="bi-file-earmark-text" />
          <template v-else>{{ page.icon }}</template>
          {{ page.title }}
        </Btn>
      </li>
    </ul>
  </Page>
</template>

<script setup lang="ts">
import { WikiPage } from '@/model/wiki'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const archivedPages = ref<WikiPage[]>([])

const loading = ref(true)
onMounted(async () => {
  archivedPages.value = await WikiPage.getArchived()
  loading.value = false

  const unsubscribe = WikiPage.subscribeArchived((change) => {
    const index = archivedPages.value.findIndex((e) => e.id === change.doc.id)

    if (index === -1) {
      archivedPages.value.push(new WikiPage(change.doc.id, change.doc.data()))
      return
    }

    switch (change.type) {
      case 'added':
      case 'modified':
        archivedPages.value[index] = new WikiPage(change.doc.id, change.doc.data())
        break
      case 'removed':
        archivedPages.value.splice(index, 1)
        break
    }
  })

  onBeforeUnmount(unsubscribe)
})
</script>

<style scoped lang="scss">
ul {
  list-style: none;
}

.page-list__item {
  padding: 1rem;
  font-size: 1.5rem;
  width: stretch;
  text-align: left;
  margin: 0 0 .5rem 0;
}
</style>
