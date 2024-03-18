<script setup lang="ts">
import Header from '../components/Header.vue';
import SideNav from '../components/SideNav.vue';
import ClubsComponent from '../components/ClubsComponent.vue';
</script>

<template>
  <Header />
  <main>
    <SideNav />
    <div class="mt-12 w-full pl-16"><ClubsComponent/></div>
  </main>
</template>
