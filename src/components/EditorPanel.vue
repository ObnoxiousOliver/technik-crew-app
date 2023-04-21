<template>
  <ul class="editor-panel">
    <li
      :class="['editor-panel__item', {
        'editor-panel__item--is-divider': btn.divider
      }]"
      v-for="btn in buttons"
      :key="btn.name"
    >
      <Btn
        v-if="!btn.divider"
        @click="$emit('itemClick', btn.name)"
        :class="{
          'btn--is-active': activeElements[btn.name]
        }"
      >
        <i :class="btn.icon" />
      </Btn>
      <div
        v-else
        class="editor-panel__divider"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>

defineProps({
  activeElements: {
    type: Object,
    default: () => ({})
  }
})

const buttons = [
  { name: 'bold', icon: 'bi-type-bold' },
  { name: 'italic', icon: 'bi-type-italic' },
  { name: 'underline', icon: 'bi-type-underline' },
  { name: 'strike', icon: 'bi-type-strikethrough' },

  { divider: true },

  { name: 'subscript', icon: 'bi-subscript' },
  { name: 'superscript', icon: 'bi-superscript' },

  { divider: true },

  { name: 'link', icon: 'bi-link' },

  { divider: true },

  { name: 'code', icon: 'bi-code' },
  { name: 'codeBlock', icon: 'bi-code-square' },

  { divider: true },

  { name: 'h1', icon: 'bi-type-h1' },
  { name: 'h2', icon: 'bi-type-h2' },
  { name: 'h3', icon: 'bi-type-h3' },

  { divider: true },

  { name: 'ul', icon: 'bi-list-ul' },
  { name: 'ol', icon: 'bi-list-ol' },
  { name: 'indentLeft', icon: 'bi-text-indent-left' },
  { name: 'indentRight', icon: 'bi-text-indent-right' }
]
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.editor-panel {
  z-index: 1;
  overflow: auto hidden;
  border-radius: r.$radius r.$radius 0 0;
  background-color: r.$bg-secondary;
  box-shadow: r.$bg-primary 0 calc(-1 * r.$radius) 0;
  display: flex;

  list-style-type: none;

  &__item {
    display: flex;
    flex: 1;

    &--is-divider {
      flex: 0;
    }
  }

  .btn {
    flex: 1;
    min-width: 2.5rem;
    height: 3rem;
    padding: 0;
    border-radius: 0;

    &--is-active {
      // background-color: lighten(r.$bg-secondary, 5);
      background: r.$text-primary;
      color: r.$bg-primary;
    }
  }

  &__divider {
    width: 1px;
    margin: .5rem;
    background: r.$bg-stroke;
  }
}
</style>
