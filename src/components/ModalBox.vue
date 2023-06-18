<template>
  <Teleport to="#layer">
    <Transition name="modal">
      <div v-if="show" class="modal">
        <div class="modal__mask" @click="show = false" />
        <FocusTrap
          :escape-deactivates="true"
          @deactivate="show = false"
        >
          <div class="modal__box">
            <h2 v-if="$slots.title" class="modal__title">
              <slot name="title" />
            </h2>
            <div class="modal__content">
              <slot />
            </div>
            <div class="modal__btns" @click="show = false">
              <slot name="btns" />
            </div>
          </div>
        </FocusTrap>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { FocusTrap } from 'focus-trap-vue'

const props = defineProps<{
  show: boolean
}>()
const emit = defineEmits(['update:show'])

const show = useVModel(props, 'show', emit)
</script>

<style scoped lang="scss">
@use '../scss' as r;

.modal {
  &__mask {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .5);
    backdrop-filter: blur(.5rem);
    pointer-events: all;
    will-change: opacity;
  }

  &__box {
    @include r.box;
    position: absolute;
    pointer-events: all;
    top: 50%;
    left: 50%;
    width: fit-content;
    max-height: 90vh;
    transform: translate(-50%, -50%);
    display: grid;
    grid-template-rows: auto 1fr auto;

    &:focus-visible {
      outline: none;
      box-shadow: r.$focus;
    }
  }

  &__content {
    overflow: hidden;
    padding: 0 1.5rem;
    margin: 0 0 1rem;
  }

  &__title {
    padding: 0 1.5rem;
    margin: 2rem 0 1.5rem;

    font-size: 1.5rem;
    font-weight: 600;

    & > :deep(i) {
      margin-right: 1rem;
    }
  }

  &__btns {
    display: flex;
    justify-content: flex-end;
    padding: 1rem 1.5rem;
    border-top: r.$bg-stroke solid 1px;
    pointer-events: none;

    :deep(.btn) {
      pointer-events: all;
    }
  }

  &-enter-active,
  &-leave-active {
    transition: .5s;

    .modal__mask {
      transition: opacity .2s;
    }

    .modal__box {
      transition: grid-template-rows .5s, .5s cubic-bezier(0.19, 1, 0.22, 1);
    }
  }

  &-enter-from,
  &-leave-to {
    .modal__mask {
      opacity: 0;
    }

    .modal__box {
      transform: translate(-50%, -50%) scale(.8);
      grid-template-rows: auto 0fr auto;
      opacity: 0;
    }
  }
}
</style>
