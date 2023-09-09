<template>
  <Page>
    <template #title>
      <template v-if="item && !splitFirstEmojiFromString(item.name ?? '')">
        <i class="bi-box" />
      </template>

      {{ item?.name }}
    </template>

    <template v-if="unassignedFields">
      <ItemFieldsList
        :fieldTemplate="unassignedFields.map(f => new FieldTemplate(f.template))"
        :fields="unassignedFields"
        readonly
      />
    </template>
    <template v-else>
      <i>Keine unzugeordneten Felder</i>
    </template>
  </Page>
</template>

<script lang="ts" setup>
import ItemFieldsList from '@/components/ItemFieldsList.vue'
import { FieldTemplate } from '@/model/inventory/collectionField'
import { CollectionItem } from '@/model/inventory/collectionItem'
import { useInventory } from '@/stores/inventory'
import { splitFirstEmojiFromString } from '@/utilities/getFirstEmojiOfString'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const inventory = useInventory()
const route = useRoute()

const item = computed(() => inventory.getItemById(route.params.itemId as string))
const collection = computed(() => {
  if (item.value?.collectionId) {
    return inventory.getCollectionById(item.value.collectionId)
  }
  return null
})

const unassignedFields = computed(() => {
  if (!item.value || !collection.value) return []
  return CollectionItem.getUnassignedFields(item.value, collection.value)
})
</script>
