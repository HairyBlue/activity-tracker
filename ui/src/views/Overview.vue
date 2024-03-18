<script setup lang="ts">
import Header from '../components/Header.vue';
import SideNav from '../components/SideNav.vue';
import OverviewComponent from '../components/OverviewComponent.vue';
</script>

<template>
  <Header />
  <main>
    <SideNav />
    <div class="mt-12 w-full pl-16">
      <OverviewComponent />
    </div>
  </main>
</template>
