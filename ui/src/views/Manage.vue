<script setup lang="ts">
import Header from '../components/Header.vue';
import SideNav from '../components/SideNav.vue';
import ManageComponent from '../components/ManageComponent.vue';
import { userStore } from '../store/userStore';

const user = userStore();
</script>

<template>
  <Header />
  <main>
    <SideNav />
    <div class="mt-12 w-full pl-16" v-if="user.getLevel() != 'STAFF'"><ManageComponent /></div>
    <div class="mt-12 text-4xl w-full pl-16 font-bold" v-else><span class="mt-64">Authorize user only</span></div>
  </main>
</template>
