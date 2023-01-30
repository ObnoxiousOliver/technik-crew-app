<template>
  <Btn
    type="button"
    class="emoji-picker no-grow"
    @click="show = true"
  >

  </Btn>

  <ActionSheet v-model:show="show" class="expand-max">
    <template #title>
      Emoji auswählen
    </template>

    <EmojiPicker theme="dark" :native="false" />

    <template #buttons>
      <ActionSheetButton class="danger">
        <i class="bi-x-lg"/>Abbrechen
      </ActionSheetButton>
    </template>
  </ActionSheet>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'

const show = ref(false)
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.emoji-picker {
  padding: 0;
  width: 3rem;
  height: 3rem;
}

.v3-emoji-picker {
  display: block;
  height: auto;
  width: auto;
  margin: 0 -1.5rem -1.5rem;
  background: none;
  --v3-picker-border: #{r.$bg-stroke};

  :deep() {
    .v3-header {
      z-index: 1;
      position: sticky;
      top: 0;
      background: r.$bg-secondary;
    }

    .v3-footer {
      position: sticky;
      bottom: -1.5rem;
      background: r.$bg-secondary;
    }

    .v3-body {
      .v3-body-inner {
        overflow: visible;

        .v3-group .v3-emojis button {
          border-radius: r.$radius;
          transition: .2s;

          &:hover {
            background: lighten(r.$bg-secondary, 5);
          }

          &:focus-visible {
            outline: none;
            box-shadow: r.$focus;
          }

          img {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 3rem;
            max-height: 3rem;
          }
        }
      }

      .v3-group h5.v3-sticky {
        position: static;
        background: none;
      }
    }

  }
}
</style>
