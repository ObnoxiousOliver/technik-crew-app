<template>
  <ul class="history-list">
    <li class="history-list__item" v-for="entry in history" :key="entry.date">
      <div class="history-list__meta">
        <span class="history-list__author">
          <Username :user="users.getUserByUsername(entry.author)" />
        </span>
        <span class="history-list__date">
          {{ toDateString(new Date(entry.date)) }}
        </span>
      </div>
      <div class="history-list__description">
        {{ entry.description }}
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { HistoryState } from '@/model/history'
import { useUsers } from '@/stores/users'
import { toDateString } from '@/utilities/date'

const users = useUsers()

defineProps<{
  history?: HistoryState<unknown>[]
}>()
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.history-list {
  position: relative;
  list-style: none;
  padding-top: 2rem;

  &::before {
    position: absolute;
    content: '';
    top: 0;
    left: .45rem;
    bottom: 0;
    width: .1rem;
    background: linear-gradient(transparent, r.$text-secondary 2rem);
  }

  &__item {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 2rem;

    &::before {
      z-index: 1;
      position: sticky;
      top: 0;
      display: block;
      content: '';
      width: 1rem;
      height: 1rem;
      margin-bottom: -1rem;
      margin-left: -1.5rem;
      border-radius: 50%;
      border: r.$text-secondary solid .1rem;
      background: r.$bg-primary;
    }

    &:last-child {
      &::after {
        position: absolute;
        content: '';
        top: .6rem;
        left: 0rem;
        bottom: 0;
        width: 1rem;
        background: r.$bg-primary;
      }
    }
  }

  &__meta {
    position: sticky;
    top: 0;
    font-size: .8rem;
    height: 2rem;
    margin-bottom: -2rem;
    background: linear-gradient(r.$bg-primary .8rem, transparent);
  }

  &__author {
    margin-right: .5rem;
    font-weight: 600;
  }

  &__date {
    color: r.$text-secondary;
  }

  &__description {
    margin-top: 1.5rem;
  }
}
</style>
