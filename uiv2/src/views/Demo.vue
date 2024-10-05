<script setup lang="ts">
import { useRouter } from 'vue-router';
import { userStore } from '../store/userStore';
import AdminDemo from '../components/Demo/Admin/index.vue';
// import StaffDemo from '../components/Demo/Staff/index.vue';

const user = userStore();
const router = useRouter();

function isWebmaster() {
  return user.getDecryptedLevel() == 'WEBMASTER';
}

function isAdmin() {
  return isWebmaster() || user.getDecryptedLevel() == 'ADMIN';
}

function isStaff() {
  return isWebmaster() || user.getDecryptedLevel() == 'STAFF';
}

function isStudent() {
  return isWebmaster() || user.getDecryptedLevel() == 'STUDENT';
}


function onReturn() {
  if (isAdmin() || isStaff()) {
    router.push('/dashboard');
  } else if (isStudent()) {
   router.push('/student/dashboard');
  }

}
</script>

<template>
  <div class="h-screen w-screen">
    <AdminDemo v-if="isAdmin()" />
    <!-- <StaffDemo v-if="isStaff()" /> -->
    <div v-else>
      <div class="flex h-screen items-center justify-center">
        <div class="text-center text-6xl font-black">Demo page is currently empty.</div>
      </div>
    </div>
  </div>
  <div class="goback" @click="onReturn()">Return</div>
</template>

<style scoped>
.goback {
  position: fixed;
  bottom: 20px;
  right: 50px;
  font-weight: 600;
  font-size: 18px;
  background-color: #f8f8f8;
  z-index: 100;
  border: 1px solid black;
  border-radius: 4px;
  padding: 8px;
}
</style>
