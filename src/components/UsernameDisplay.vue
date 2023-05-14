<template>
  {{ displayName }}
</template>

<script lang="ts" setup>
import { Gender, User, UserDB } from '@/model/user'
import { computed } from 'vue'

const props = defineProps<{
  user?: UserDB | User | null | undefined,
  firstname?: string,
  lastname?: string,
  preferLastname?: boolean,
  gender?: Gender,
  full?: boolean
}>()

const displayName = computed(() => {
  const firstname: string = props.user?.firstname ?? props.firstname ?? ''
  const lastname: string = props.user?.lastname ?? props.lastname ?? ''
  const preferLastname: boolean = props.user?.prefer_lastname ?? props.preferLastname ?? false
  const gender: Gender = props.user?.gender ?? props.gender ?? Gender.NonBinary

  if (props.full) {
    return `${firstname} ${lastname}`
  }

  return User.getDisplayName({
    firstname, lastname, prefer_lastname: preferLastname, gender
  })
})
</script>
