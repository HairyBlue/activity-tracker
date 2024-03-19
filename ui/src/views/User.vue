<script setup lang="ts">
import Header from '../components/Header.vue';
import SideNav from '../components/SideNav.vue';
import UserComponent from '../components/UserComponent.vue';
</script>

<template>
  <Header />
  <main>
    <SideNav />
    <div class="mt-12 w-full pl-16"><UserComponent /></div>
  </main>
</template>
