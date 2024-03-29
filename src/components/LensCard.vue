<template>
  <div
    :class="['lens-card', {
      'lens-card--active': start && !scanner?.loading,
      'lens-card--first-start': firstStart,
    }]"
    ref="root"
    :style="{
      '--width': width + 'px',
    }"
  >
    <QrcodeScanner
      @result="result"
      class="lens-card__scanner"
      ref="scanner"
    />

    <template v-if="start && !scanner?.loading">
      <div class="lens-card__frame">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          :viewBox="[
            0 - 100 / width / 2,
            0 - 100 / width / 2,
            16 + 100 / width,
            16 + 100 / width
          ].join(' ')"
        >
          <path
            d="M 0 3 L 0 2 A 2 2 0 0 1 2 0 L 3 0 M 13 0 L 14 0 A 2 2 0 0 1 16 2 L 16 3 M 3 16 L 2 16 A 2 2 0 0 1 0 14 L 0 13 M 16 13 L 16 14 A 2 2 0 0 1 14 16 L 13 16"
            fill="none"
            stroke="currentColor"
            :stroke-width="100 / width"
            stroke-linecap="round"
          />
        </svg>
      </div>

      <div class="lens-card__overlay">
        <Btn
          class="lens-card__overlay__x"
          aria-label="Kamera schließen"
          transparent
          square
          @click="start = false"
        >
          <i class="bi-x-lg" />
        </Btn>

        <div class="lens-card__overlay__hint">
          QR-Code oder Barcode scannen
        </div>
      </div>
    </template>
    <template v-else-if="scanner?.loading">
      <Spinner class="lens-card__spinner" />
    </template>
    <template v-else-if="error">
      <div class="lens-card__error">
        <GlowDiv>
          <i class="bi-exclamation-triangle" />

          <template v-if="error.code === 'NOT_SUPPORTED'">
            Dein Gerät unterstützt leider keine Kamera.
          </template>

          <template v-else-if="error.code === 'NOT_ALLOWED'">
            Du hast die Kamera nicht freigegeben.
          </template>
        </GlowDiv>
      </div>
    </template>
    <template v-else>
      <button @click="start = true" class="lens-card__start-scan">
        <GlowDiv>
          <i class="bi-qr-code-scan" />
          Tippe hier um zu die Kamera zu starten
        </GlowDiv>
      </button>
    </template>
  </div>
</template>

<script lang="ts" setup>
import QrcodeScanner from '@/components/QrcodeScanner.vue'
import { Result } from '@zxing/library'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { AppError } from '@/model/error'
import GlowDiv from './GlowDiv.vue'
import { useInventory } from '@/stores/inventory'

const router = useRouter()
const inventory = useInventory()
const scanner = ref<{ startScan:() => Promise<void>, pauseScan: () => void, loading: boolean } | null>(null)

const root = ref<HTMLElement | null>(null)

const error = ref<AppError | null>(null)

const start = ref(false)
const firstStart = ref(true)
watch(start, (val) => {
  if (val) {
    scanner.value?.startScan()
      .then(() => {
        firstStart.value = false
      })
      .catch((err: AppError) => {
        start.value = false
        error.value = err
        console.error(err)
      })
  } else {
    scanner.value?.pauseScan()
  }
}, { immediate: true })

const width = ref(0)
onMounted(() => {
  if (!root.value) return

  const observer = new ResizeObserver(() => {
    width.value = root.value?.clientWidth ?? 0
  })

  observer.observe(root.value)

  onBeforeUnmount(() => {
    observer.disconnect()
  })
})

function result (result: Result) {
  if (!result) return

  console.log(result.getText())

  const item = inventory.getItemByCode(result.getText())
  if (!item) return

  router.push({
    name: 'inventory-item-details',
    params: {
      id: item.collectionId,
      itemId: item.id
    }
  })
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;
@use 'sass:math';

.lens-card {
  position: relative;
  @include r.box;
  overflow: hidden;
  height: 10rem;

  transition: height .5s cubic-bezier(0.19, 1, 0.22, 1);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: r.$bg-primary;
    pointer-events: none;
  }

  &--active {
    height: var(--width);

    &::before {
      opacity: 0;
    }
  }

  &--first-start {
    &::before {
      background: radial-gradient(85.03% 131.43% at 17.64% 110.98%, #2430a3aa 0%, rgba(37, 59, 255, 0) 100%), radial-gradient(84.39% 143.51% at 100% 7.07%, rgba(95, 25, 128, 0.5) 0%, rgb(4, 1, 19) 100%);
    }
  }

  &__spinner {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__frame {
    position: absolute;
    aspect-ratio: 1;
    inset: 20%;

    svg {
      display: block;
    }
  }

  &__scanner {
    will-change: filter;
    filter: blur(1rem);
    opacity: 0.5;
    transition: .5s cubic-bezier(0.19, 1, 0.22, 1);

    :deep(video) {
      transform-origin: center 75%;
      transition: transform .5s cubic-bezier(0.19, 1, 0.22, 1);
      transform: scale(2);
    }

    .lens-card--active & {
      opacity: 1;
      background: none;
      filter: none;

      :deep(video) {
        transform: none;
      }
    }
  }

  &__overlay {
    &__x {
      position: absolute;
      top: 0;
      right: 0;
    }

    &__hint {
      position: absolute;
      inset: calc(var(--width) * 0.6 + 20% + 2rem) 0 auto;
      text-align: center;
      font-size: .8rem;
    }
  }

  &__error {
    color: r.$danger
  }

  &__error, &__start-scan {
    position: absolute;
    inset: 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    i {
      display: block;
      font-size: 3rem;
      margin-bottom: 1rem;
    }
  }

  &__start-scan {
    background: none;
    border: none;
    font: inherit;
    color: inherit;
    width: stretch;
  }
}
</style>
