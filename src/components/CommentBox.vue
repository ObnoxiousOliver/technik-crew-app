<template>
  <div
    :class="['comment-box', {
      'comment-box--open': open
    }]"
  >
    <template v-if="breakpoint.inMobileOrTablet">
      <Btn
        class="comment-box__open-btn"
        square
        @click="open = !open"
      >
        <i class="bi-plus-lg" />
      </Btn>
      <template v-if="open">
        <Btn
          square
          @click="emit('addImage')"
        >
          <i class="bi-image" />
        </Btn>
        <Btn
          square
          @click="emit('addFile')"
        >
          <i class="bi-file-earmark-plus" />
        </Btn>
      </template>
    </template>
    <Btn
      v-else
      square
      @click="emit('addFile')"
    >
      <i class="bi-plus-lg" />
    </Btn>
    <Textbox
      class="comment-box__textbox"
      placeholder="Anmerkung hinzufügen"
      v-model="value"
      @keydown.ctrl.enter="emit('send')"
    />
    <Btn
      v-if="value.length > 0"
      square
      @click="emit('send')"
      aria-label="Senden"
    >
      <i class="bi-send"></i>
    </Btn>
  </div>
</template>

<script setup lang="ts">
import { useBreakpoint } from '@/utilities/breakpoint'
import { useVModel } from '@vueuse/core'
import { ref } from 'vue'

const breakpoint = useBreakpoint()

const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits(['update:modelValue', 'send', 'addFile', 'addImage'])
const value = useVModel(props, 'modelValue', emit)

const open = ref(false)
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.comment-box {
  display: flex;
  gap: .5rem;
  align-items: center;

  &__textbox {
    flex: 1;
  }
}
</style>
