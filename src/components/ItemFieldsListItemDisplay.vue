<template>
  <template v-if="fieldValue === null || fieldValue?.length <= 0">
    <i class="text-secondary">Kein Wert</i>
  </template>

  <template v-else-if="fieldValue !== undefined">
    <template v-if="fieldTemplate.type === 'string'">
      {{ fieldValue }}
    </template>

    <template v-if="fieldTemplate.type === 'number'">
      <template v-if="typeof fieldValue === 'number'">
        {{ fieldValue }} {{ fieldTemplate.options.number?.symbol }}
      </template>
      <template v-else>
        <i class="text-secondary">Ungültiger Wert ({{ fieldValue }})</i>
      </template>
    </template>

    <template v-if="fieldTemplate.type === 'boolean'">
      {{ fieldValue ? 'Ja' : 'Nein' }}
    </template>

    <template v-if="fieldTemplate.type === 'date'">
      {{ toDateString(new Date(fieldValue), {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
        daysAgoThreshold: false,
        hour: undefined,
        minute: undefined,
        second: undefined
      }) }}
    </template>

    <template v-if="fieldTemplate.type === 'time'">
      {{ toDateString(new Date('0 ' + fieldValue), {
        hour: 'numeric',
        minute: 'numeric',
        second: undefined,
        daysAgoThreshold: false,
        day: undefined,
        month: undefined,
        year: undefined
      }) }}
    </template>

    <template v-if="fieldTemplate.type === 'datetime'">
      {{ toDateString(new Date(fieldValue), {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        second: undefined,
        daysAgoThreshold: false
      }) }}
    </template>

    <template v-if="fieldTemplate.type === 'enum'">
      {{ fieldValue }}
    </template>

    <template v-if="fieldTemplate.type === 'list'">
      <ol
        v-if="!inline"
        class="bullet-list"
      >
        <li
          v-for="(item, i) in fieldValue"
          :key="i"
        >
          <ItemFieldsListItemDisplay
            :fieldValue="item"
            :fieldTemplate="fieldTemplate.options.list!"
          />
        </li>
      </ol>
      <template v-else>
        {{ fieldValue.length }} Elemente
      </template>
    </template>
  </template>
</template>

<script lang="ts" setup>
import { FieldTemplateBase, FieldTypes } from '@/model/inventory/collectionField'

import { toDateString } from '@/utilities/date'

defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldValue: any
  fieldTemplate: FieldTemplateBase<FieldTypes>
  inline?: boolean
}>()
</script>

<style scoped lang="scss">
@use '../scss' as r;

.list-chip {
  display: inline-block;
  @include r.chip;
}

.item-fields-list-item-display {
  &--inline {
    // display: inline-block;
    display: flex;
    gap: .5rem;
    padding: 0;

    li {
      display: inline-block;
    }
  }
}
</style>
