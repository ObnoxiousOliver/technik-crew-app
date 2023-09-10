<template>
  <Page>
    <!-- <template #title>
      <span v-if="page?.icon">
        {{ page?.icon }}
      </span>
      <i v-else class="bi-file-earmark-text" />
      <span class="text-transform-normal">
        {{ page?.title }}
      </span>
    </template> -->

    <Spinner v-if="loading" />
    <template v-else-if="page">
      <CenteredCard>
        <template #icon>
          <span v-if="page?.icon">
            {{ page.icon }}
          </span>
          <i v-else class="bi-file-earmark-text" />
        </template>
        <template #title>
          {{ page.title }}
        </template>
        <!-- {{ page.content?.length }} Seiten -->
      </CenteredCard>

      <SettingsList>
        <SettingsListOption>
          <i class="bi-file-earmark-text" />Seitenanzahl

          <template #desc>
            {{ page.content?.length }}
          </template>
        </SettingsListOption>
        <SettingsListDivider />
        <SettingsListLink
          :to="{
            name: 'wiki-page-edit',
            params: { id: page.id },
            query: { back: route.fullPath }
          }"
        >
          <i class="bi-pencil-square" />Bearbeiten
        </SettingsListLink>
        <SettingsListLink
          :to="{
            name: 'wiki-page-history',
            params: { id: page.id }
          }"
        >
          <i class="bi-clock-history" />Verlauf
        </SettingsListLink>
        <SettingsListDivider />
        <SettingsListLink
          v-if="!page.hidden"
          isButton
          danger
          :arrow="false"
          @click="showArchiveSheet = true"
        >
          <i class="bi-archive" />Archivieren
        </SettingsListLink>
        <template v-else>
          <SettingsListLink
            isButton
            :arrow="false"
            @click="recover"
          >
            <i class="bi-arrow-clockwise" />Wiederherstellen
          </SettingsListLink>
          <SettingsListLink
            isButton
            danger
            :arrow="false"
            @click="showDeleteSheet = true"
          >
            <i class="bi-trash" />Löschen
          </SettingsListLink>
        </template>
      </SettingsList>
    </template>

    <ActionSheet v-model:show="showArchiveSheet">
      <template #title>
        <i class="bi-archive" />Termin Archivieren
      </template>

      Möchtest du diesen Termin wirklich archivieren?<br>
      Du kannst ihn jederzeit wiederherstellen.

      <template #buttons>
        <ActionSheetButton danger @click="archive">
          <i class="bi-archive" />Archivieren
        </ActionSheetButton>
        <ActionSheetDivider />
        <ActionSheetButton>
          <i class="bi-x-lg" />Abbrechen
        </ActionSheetButton>
      </template>
    </ActionSheet>

    <ActionSheet v-model:show="showDeleteSheet">
      <template #title>
        <i class="bi-trash" />Termin Löschen
      </template>

      Möchtest du diesen Termin wirklich löschen?<br>
      Dieser Vorgang kann nicht rückgängig gemacht werden.

      <template #buttons>
        <ActionSheetButton danger @click="deletePage">
          <i class="bi-trash" />Löschen
        </ActionSheetButton>
        <ActionSheetDivider />
        <ActionSheetButton>
          <i class="bi-x-lg" />Abbrechen
        </ActionSheetButton>
      </template>
    </ActionSheet>
  </Page>
</template>

<script lang="ts" setup>
import ActionSheet from '@/components/ActionSheet.vue'
import ActionSheetButton from '@/components/ActionSheetButton.vue'
import CenteredCard from '@/components/CenteredCard.vue'
import SettingsList from '@/components/SettingsList.vue'
import SettingsListDivider from '@/components/SettingsListDivider.vue'
import SettingsListLink from '@/components/SettingsListLink.vue'
import SettingsListOption from '@/components/SettingsListOption.vue'
import { useWiki } from '@/stores/wiki'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const wiki = useWiki()
const page = computed(() => wiki.getPageFromId(route.params.id as string))
const loading = computed(() => wiki.loading)

const showArchiveSheet = ref(false)
const showDeleteSheet = ref(false)

function archive () {
  page.value?.setHidden(true)
  showArchiveSheet.value = false

  router.replace({
    name: 'wiki'
  })
}

function recover () {
  page.value?.setHidden(false)
}

function deletePage () {
  if (!page.value?.id) return
  wiki.deletePage(page.value.id)
  showDeleteSheet.value = false

  router.replace({
    name: 'wiki-archive'
  })
}
</script>
