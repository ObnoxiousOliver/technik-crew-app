<template>
  <Page>
    <template #title>
      Neuer Termin
    </template>

    <FormContainer>
      <FormGroup inline>
        <SelectColor v-model="color" />

        <input
          type="text"
          class="new-event__name fill-width"
          placeholder="Unbenannter Termin..."
        >
      </FormGroup>
    </FormContainer>
  </Page>
</template>

<script lang="ts" setup>
import SelectColor from '@/components/SelectColor.vue'
import { ref } from 'vue'

const color = ref('gray')

</script>

<style lang="scss" scoped>
@use '../scss' as r;

.new-event {
  &__name {
    border: none;
    outline: none;
    padding: .5rem;
    background: none;
    color: inherit;
    font: inherit;
    font-size: 1.5rem;

    transition: .2s;

    &:focus-visible {
      box-shadow: 0 .1rem 0 r.$accent;
    }

    &::placeholder {
      color: r.$text-secondary;
    }
  }
}
</style>
