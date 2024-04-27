<script setup lang="ts">
// import { onMounted, ref, onUnmounted } from 'vue';

// const isMobileOrTablet = ref<boolean>(false);
// function checkDevice() {
//     isMobileOrTablet.value = window.innerWidth <= 768;
// }
// onMounted(() => {
//     window.addEventListener('resize', checkDevice);
// });
// onUnmounted(() => {
//     window.removeEventListener('resize', checkDevice);
// });
</script>
<template>
  <!-- <div v-if="isMobileOrTablet" class="text-center">
        <h1>Please use laptop or desktop to access the Activity Tracker</h1>
    </div>
    <div v-else> -->
  <!-- </div> -->

  <router-view></router-view>
</template>