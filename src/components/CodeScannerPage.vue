<template>
  <Page
    ref="page"
    :style="{
      '--width': rect.width + 'px',
      '--height': rect.height + 'px'
    }"
  >
    <QrCodeScanner
      ref="scanner"
      :class="['scan-code__scanner', {
        'scan-code__scanner--loading': scanner?.loading
      }]"
      @result="result"
    />

    <template v-if="err">
      <div class="scan-code__error">
        <i class="bi-exclamation-triangle" />

        <template v-if="notSupported">
          Dein Gerät unterstützt leider keine Kamera.
        </template>

        <template v-else-if="notALlowed">
          Du hast die Kamera nicht freigegeben.
        </template>
      </div>
    </template>

    <Spinner v-else-if="scanner?.loading" class="scan-code__spinner" />

    <template v-else>
      <div class="scan-code__frame">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          :viewBox="[
            0 - 100 / rect.width / 2,
            0 - 100 / rect.width / 2,
            16 + 100 / rect.width,
            16 + 100 / rect.width
          ].join(' ')"
        >
          <path
            d="M 0 3 L 0 2 A 2 2 0 0 1 2 0 L 3 0 M 13 0 L 14 0 A 2 2 0 0 1 16 2 L 16 3 M 3 16 L 2 16 A 2 2 0 0 1 0 14 L 0 13 M 16 13 L 16 14 A 2 2 0 0 1 14 16 L 13 16"
            fill="none"
            stroke="currentColor"
            :stroke-width="100 / rect.width"
            stroke-linecap="round"
          />
        </svg>

      </div>
      <div class="scan-code__overlay">
        QR-Code oder Barcode scannen

        <div v-if="errMsg" class="scan-code__err">
          {{ errMsg }}
        </div>
      </div>
    </template>
  </Page>
</template>

<script lang="ts" setup>
import QrCodeScanner from '@/components/QrcodeScanner.vue'
import { Result } from '@zxing/library'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits(['scan'])
defineProps<{
  errMsg?: string
}>()

const scanner = ref<{
  loading: boolean
  startScan:() => Promise<void>
  pauseScan: () => void
    } | null>(null)

const rect = ref({ width: 1, height: 1 })

const page = ref<{ root: HTMLElement } | null>(null)

const notSupported = ref(false)
const notALlowed = ref(false)
const err = computed(() => notSupported.value || notALlowed.value)

function result (result: Result) {
  if (!result) return

  emit('scan', result.getText())
}

onMounted(() => {
  scanner.value?.startScan()

  if (!page.value) return

  const observer = new ResizeObserver(() => {
    if (!page.value) return
    const { width, height } = page.value.root.getBoundingClientRect()
    rect.value = { width, height }
  })

  observer.observe(page.value.root)

  onBeforeUnmount(() => observer.disconnect())
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.scan-code {
  &__scanner {
    z-index: -1;
    aspect-ratio: unset;
    position: absolute;
    inset: 0;
  }

  &__err {
    @include r.box;
    color: r.$danger;
    padding: .5rem 1rem;
    width: fit-content;
    margin: .5rem auto;
    max-width: 70%;
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

    .scan-code--landscape & {
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

    .scan-code--landscape & {
      inset: 50% 0 auto;
    }
  }

  &__error {
    color: r.$danger;
    text-align: center;

    margin: 5rem 1rem 0;

    i {
      display: block;
      font-size: 4rem;
      margin-bottom: 1rem;
    }
  }
}
</style>
