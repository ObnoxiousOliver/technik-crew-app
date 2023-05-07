<template>
  <div class="user-badge">
    <i class="user-badge__icon bi-person" />
    <div class="user-badge__name">
      <UsernameDisplay :user="user" :full="true" />
    </div>
    <div class="user-badge__info">
      {{ user?.username }} -
      <i
        :class="{
          'male': 'bi-gender-male',
          'female': 'bi-gender-female',
          'non-binary': 'bi-gender-ambiguous'
        }[user?.gender]"
      />
      {{ {
        'male': 'männlich',
        'female': 'weiblich',
        'non-binary': 'divers'
      }[user?.gender] }}
    </div>
    <div class="user-badge__email">
      <a href="#" @click.prevent="showEmail = !showEmail">
        <span v-if="showEmail">{{ email }}</span>
        <span v-else>E-Mail anzeigen</span>
      </a>
    </div>
    <Btn @click="router.push('/settings/profile/edit')" class="user-badge__edit btn--square">
      <i class="bi-pencil-square" />
    </Btn>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UsernameDisplay from './UsernameDisplay.vue'

const router = useRouter()

defineProps({
  user: Object,
  email: String
})

const showEmail = ref(false)
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.user-badge {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  background: r.$bg-secondary;
  border-radius: r.$radius;
  padding: 4rem 1rem;
  margin: 2rem 0;
  color: r.$text-secondary;

  &__icon {
    font-size: 2rem;
    color: r.$text-primary;
  }
  &__name {
    font-weight: 600;
    font-size: 2rem;
    color: r.$text-primary;
    margin-bottom: .5rem;
  }
  &__email {
    margin: 3rem 0 0;

    a {
      color: r.$text-secondary;

      &:hover {
        color: r.$text-primary;
      }
    }
  }

  &__edit {
    position: absolute;
    top: .5rem;
    right: .5rem;
    color: r.$text-primary;
  }
}
</style>
