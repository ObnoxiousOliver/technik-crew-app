<template>
  {{ displayName }}
</template>

<script lang="ts" setup>
import { Gender, User } from '@/model/user'
import { computed } from 'vue'

const props = defineProps({
  user: Object,
  firstname: String,
  lastname: String,
  preferLastname: Boolean,
  gender: String,
  full: Boolean
})

const displayName = computed(() => {
  const firstname: string = props.user?.firstname ?? props.firstname
  const lastname: string = props.user?.lastname ?? props.lastname
  const preferLastname: boolean = props.user?.prefer_lastname ?? props.preferLastname
  const gender: Gender = props.user?.gender ?? props.gender

  if (props.full) {
    return `${firstname} ${lastname}`
  }

  return User.getDisplayName({
    firstname, lastname, prefer_lastname: preferLastname, gender
  })
})
</script>
