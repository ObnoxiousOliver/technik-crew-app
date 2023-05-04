<template>
  <Btn class="user-badge-btn">
    <div class="user-badge-btn__content">
      <div class="user-badge-btn__name">
        <Username :user="props.user" full />
      </div>
      <div class="user-badge-btn__username">
        {{ props.user.username }}
      </div>
    </div>
    <div v-if="props.user.is_admin" class="user-badge-btn__admin">
      <i class="bi-person-gear" /> Admin
    </div>
    <i class="user-badge-btn__icon bi-three-dots-vertical"></i>
  </Btn>
</template>

<script lang="ts" setup>
import { User } from '@/model/user'

const props = defineProps<{
  user: User
}>()
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.user-badge-btn {
  display: flex;
  width: 100%;
  font-weight: normal;
  padding: 1rem;
  padding-left: 1.5rem;
  margin: 1rem 0;
  text-align: left;
  gap: 1rem;
  align-items: center;
  overflow: hidden;

  &__content {
    flex: 1 1 auto;
  }

  &__name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 1.5rem;
    text-transform: uppercase;
    font-weight: 600;
  }

  &__username {
    color: r.$text-secondary;
  }

  &__admin {
    min-width: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: fit-content;
    white-space: nowrap;
    color: r.$text-secondary;
  }
}
</style>
