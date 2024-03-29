<template>
  <div class="scanner">
    <video
      ref="video"
      muted
      playsinline
    />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { BarcodeFormat, BrowserMultiFormatReader, DecodeHintType, Result } from '@zxing/library'
import { AppError } from '@/model/error'

const emit = defineEmits(['result'])

const video = ref<HTMLVideoElement | null>(null)

const formats = [
  // 1D formats
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODE_128,
  BarcodeFormat.ITF,
  BarcodeFormat.RSS_14,

  // 2D formats
  BarcodeFormat.QR_CODE,
  BarcodeFormat.DATA_MATRIX,
  BarcodeFormat.AZTEC,
  BarcodeFormat.PDF_417
]

const hints = new Map()
hints.set(DecodeHintType.POSSIBLE_FORMATS, formats)
// hints.set(DecodeHintType.TRY_HARDER, true)

const reader = new BrowserMultiFormatReader(hints)
const loading = ref(false)

function handleResult (result: Result) {
  emit('result', result)
}

let stream: MediaStream | null = null

async function startScan () {
  if (!video.value) return

  if (loading.value) {
    await new Promise<void>((resolve) => {
      const unhook = watch(loading, (val) => {
        if (!val) {
          unhook()
          resolve()
        }
      }, { flush: 'post' })
    })
  }

  pauseScan()

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new AppError('NOT_SUPPORTED', 'MediaDevices.getUserMedia is not supported')
  }

  loading.value = true
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment'
      }
    })
  } catch (err) {
    loading.value = false

    console.error(err)

    if ((err as DOMException).name === 'NotAllowedError') {
      throw new AppError('NOT_ALLOWED', 'Camera access is not allowed')
    } else {
      throw new AppError('UNKNOWN_ERR', (err as DOMException).message)
    }
  }

  reader.decodeFromStream(stream, video.value, handleResult)
  loading.value = false
}

function pauseScan () {
  if (!video.value) return

  reader.stopContinuousDecode()
  video.value.pause()
  stream?.getTracks().forEach((track) => {
    track.stop()
  })
  stream = null
}

onBeforeUnmount(() => {
  pauseScan()
})

defineExpose({
  startScan,
  pauseScan,
  loading
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.scanner {
  aspect-ratio: 1;

  video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
