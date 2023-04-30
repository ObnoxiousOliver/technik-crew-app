<template>
  <i :class="'bi-' + icon" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { fileIcon } from '@/utilities/fileType'

const props = defineProps<{
  file: {
    type?: string
    name: string
  }
}>()

const icon = computed(() => fileIcon(props.file.name, props.file.type))
</script>
