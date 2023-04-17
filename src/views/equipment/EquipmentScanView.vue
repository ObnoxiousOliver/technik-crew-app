<template>
  <Page ref="page" :style="{
    '--width': rect.width + 'px',
    '--height': rect.height + 'px'
  }" :class="[{
    'equipment-scan--landscape': screenOrientation === 'landscape'
  }]">
    <QrCodeScanner
      ref="scanner"
      :class="['equipment-scan__scanner', {
        'equipment-scan__scanner--loading': scanner?.loading
      }]"
      :constrains="{
        aspectRatio,
        facingMode: 'environment'
      }"
      @result="result"
    />

    <Spinner v-if="scanner?.loading" class="equipment-scan__spinner" />

    <template v-else>
      <div class="equipment-scan__frame">
        <svg xmlns="http://www.w3.org/2000/svg" :viewBox="[
          0 - 100 / rect.width / 2,
          0 - 100 / rect.width / 2,
          16 + 100 / rect.width,
          16 + 100 / rect.width
        ]">
          <path
            d="M 0 3 L 0 2 A 2 2 0 0 1 2 0 L 3 0 M 13 0 L 14 0 A 2 2 0 0 1 16 2 L 16 3 M 3 16 L 2 16 A 2 2 0 0 1 0 14 L 0 13 M 16 13 L 16 14 A 2 2 0 0 1 14 16 L 13 16"
            fill="none"
            stroke="currentColor"
            :stroke-width="100 / rect.width"
            stroke-linecap="round"
          />
        </svg>

      </div>
      <div class="equipment-scan__overlay">
        QR-Code oder Barcode scannen
      </div>
    </template>
  </Page>
</template>

<script lang="ts" setup>
import QrCodeScanner from '@/components/QrcodeScanner.vue'
import { useEquipment } from '@/stores/equipment'
import { Result } from '@zxing/library'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const equipment = useEquipment()
const router = useRouter()

const scanner = ref<QrCodeScanner | null>(null)
const rect = ref({
  width: 1,
  height: 1
})
const page = ref<HTMLElement | null>(null)

const screenOrientation = ref(screen.orientation.type.includes('landscape') ? 'landscape' : 'portrait')
const aspectRatio = computed(() => Math.round(
  (screenOrientation.value === 'landscape'
    ? (rect.value.width / rect.value.height)
    : (rect.value.height / rect.value.width)) *
  100) / 100)

let currentAspectRatio = 0
let timeout
watch(aspectRatio, update)

function update () {
  if (Math.abs(currentAspectRatio - aspectRatio.value) < 0.1) return
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    currentAspectRatio = aspectRatio.value
    scanner.value?.startScan()
    timeout = null
  }, 100)
}

function updateScreenOrientation () {
  screenOrientation.value = screen.orientation.type.includes('landscape') ? 'landscape' : 'portrait'
}

onMounted(() => {
  screen.orientation.addEventListener('change', updateScreenOrientation)
  const observer = new ResizeObserver(() => {
    rect.value = page.value?.root?.getBoundingClientRect() ?? rect.value
  })

  observer.observe(page.value?.root)

  onBeforeUnmount(() => {
    screen.orientation.removeEventListener('change', updateScreenOrientation)
    scanner.value?.pauseScan()
    observer.disconnect()
  })
})

function result (result: Result) {
  if (!result) return

  const eq = equipment.findByCode(result.getText())
  if (!eq) return

  router.push({ name: 'equipment-details', params: { id: eq.id } })
}
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.equipment-scan {
  &__scanner {
    z-index: -1;
    aspect-ratio: unset;
    position: absolute;
    inset: 0;
  }

  &__spinner {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__frame {
    aspect-ratio: 1;
    position: absolute;
    inset: 40% 50% auto auto;
    width: calc(min(
      var(--width),
      var(--height)
    ) * 0.6);
    transform: translate(50%, -50%);
    // box-shadow: #000a 0 0 0 100vw;
    // border-radius: 11.6%;

    svg {
      display: block;
      // margin: -1.8px;
    }

    .equipment-scan--landscape & {
      inset: 50% 50% auto auto;
    }
  }

  &__overlay {
    position: absolute;
    inset: 40% 0 auto;
    transform: translateY(calc(min(
      var(--width),
      var(--height)
    ) * 0.3 + 1rem));
    font-size: .8rem;
    text-align: center;

    .equipment-scan--landscape & {
      inset: 50% 0 auto;
    }
  }
}
</style>
