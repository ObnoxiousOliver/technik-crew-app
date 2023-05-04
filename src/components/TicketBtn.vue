<template>
  <Btn class="ticket-btn">
    <div class="ticket-btn__code">
      {{ props.code }}
    </div>
    <div class="ticket-btn__username">
      {{ props.ticket.username }}
    </div>
    <i class="bi-three-dots-vertical"></i>
  </Btn>
</template>

<script lang="ts" setup>
import { TicketDB } from '@/model/ticket'

const props = defineProps<{
  ticket: TicketDB,
  code: string
}>()
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.ticket-btn {
  display: flex;
  width: 100%;
  font-weight: normal;
  text-align: left;
  gap: 1rem;
  overflow: hidden;
  align-items: center;

  margin: 1rem 0;

  padding: 1rem;
  padding-left: 1.5rem;

  &__code {
    flex: 0 1 auto;
    font-size: 1.5rem;
    font-weight: 400;
    letter-spacing: .4em;
  }

  &__username {
    flex: 1 1 auto;
    width: fit-content;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
  }
}
</style>
