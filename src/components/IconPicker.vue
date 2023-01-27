<template>

  <Btn class="no-grow icon-picker" type="button" @click="show = true">
    <i v-if="value" :class="'bi-' + value" />
    <slot v-else name="placeholder">
      <span class="placeholder">
        kein Icon
      </span>
    </slot>
  </Btn>

  <ActionSheet v-model:show="show">
    <template #title>
      Icon auswählen
    </template>

    <div class="icon-list-controls">
      <FloatingLabelInput class="dark icon-list-search" label="Suche" v-model="query" />
      <Btn @click="query = ''">
        <i class="bi-x"/>
      </Btn>
    </div>

    <ul class="icon-list">
      <li>
        <Btn
          class="btn--no-icon"
          type="button"
          @click="() => {
            value = null
            show = false
          }"
        >
          kein Icon
        </Btn>
      </li>
      <li v-for="icon in icons" :key="icon">
        <Btn
          @click="() => {
            value = icon.name
            show = false
          }"
          :title="icon.name"
        >
          <i :class="'bi-' + icon.name"/>
        </Btn>
      </li>
    </ul>

    <template #buttons>
      <ActionSheetButton @click="show = true">
        <i class="emoji">🙂</i>Ein Emoji verwenden
      </ActionSheetButton>
      <ActionSheetButton class="danger">
        <i class="bi-x-lg" />Abbrechen
      </ActionSheetButton>
    </template>
  </ActionSheet>
</template>

<script lang="ts" setup>
import FloatingLabelInput from '@/components/FloatingLabelInput.vue'
import iconJson from '@/assets/bootstrap-icons-meta.json'
import { computed, ref, watch } from 'vue'
import { search } from '@/utilities/search'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': string
}>()

const value = ref(props.modelValue)
watch(value, (val) => {
  emit('update:modelValue', val)
})
watch(() => props.modelValue, (props) => {
  value.value = props.modelValue
})

const show = ref(false)
const query = ref('')

const icons = computed(() => {
  return search(query.value, iconJson, (icon) => `${icon.name} ${icon.tags.join(' ')} ${icon.category}`)
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.icon-picker {
  flex: 0 0 auto;
  padding: 0;
  width: 3rem;
  height: 3rem;

  .placeholder {
    font-size: .8rem;
  }
}

.icon-list-controls {
  position: sticky;
  top: 0;
  display: flex;
  margin-bottom: 1rem;

  .btn {
    flex: 0 0 auto;
    background: r.$bg-primary;

    padding: 0;
    width: 3rem;
    height: 3rem;

    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.icon-list-search {
  flex: 1 1 auto;

  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.icon-list {
  display: grid;
  flex-flow: wrap;
  grid-template-columns: repeat(auto-fill, minmax(3rem, 1fr));
  list-style-type: none;

  li {
    .btn {
      padding: 0;
      width: 100%;
      height: 3rem;

      &--no-icon {
        font-size: .8rem;
      }
    }
  }
}
</style>
