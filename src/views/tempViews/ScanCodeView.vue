<template>
  <CodeScannerPage @scan="scan" />
</template>

<script lang="ts" setup>
import CodeScannerPage from '@/components/CodeScannerPage.vue'
import { useTemp } from '@/stores/temp'

const temp = useTemp()

function scan (result: string) {
  temp.setDataFromTempRoute(result, true)
}
</script>
