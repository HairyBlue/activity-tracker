<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import  { useRouter } from "vue-router"
import $ from 'jquery';

import Aside from '../components/Student/Aside.vue';
import { userStore, dataStore } from '../store/userStore';

const router = useRouter();

const studentAccess = 'STUDENT';
const user = userStore();
const sdata = dataStore();

const level = user.getDecryptedLevel();
const hasAccess = ref<boolean>(false);

function initializeData() {
  $.ajax({
    url: `${user.basePath}/api/init`,
    method: 'GET',
    contentType: 'application/json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
  .then((value) => {
    sdata.initData = value.init
  })
  .catch((e: any) => {
     if (e.status == 403) {
      user.removeLocalStorage();
      router.push('/');
     }
  })
}

onMounted(() => {
  initializeData()
  if (level && typeof level == "string") {
    if (level.match(studentAccess)) {
      hasAccess.value = true;
      user.level = level;
    } else {
      hasAccess.value = false;
      router.push('/');
    }
  } else {
    user.removeLocalStorage();
    router.push('/');
  }

});

</script>
<template>
  <div v-if="hasAccess" class="flex max-h-screen">
    <Aside />
    <div class="overflow-auto w-full">
      <RouterView />
    </div>
  </div>
</template>
