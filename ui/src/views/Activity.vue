<script setup lang="ts">
import Header from '../components/Header.vue';
import SideNav from '../components/SideNav.vue';
import ActivityComponent from '../components/ActivityComponent.vue';
</script>

<template>
  <Header />
  <main>
    <SideNav />
    <div class="text-cente mt-12 w-full pl-16">
      <ActivityComponent />
    </div>
  </main>
</template>
