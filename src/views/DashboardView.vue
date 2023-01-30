<template>
  <UserPage>
    <template #title>
      <i class="bi-house-door"/>Dashboard
    </template>

    <DashboardCard>
      <template #title>
        <i class="bi-compass"/> asdasd
      </template>
    </DashboardCard>
  </UserPage>
</template>

<script lang="ts" setup>
import DashboardCard from '../components/DashboardCard.vue'
import UserPage from '../layout/UserPage.vue'
</script>
