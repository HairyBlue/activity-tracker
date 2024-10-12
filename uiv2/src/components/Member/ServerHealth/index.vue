<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import $ from 'jquery';

import { userStore } from '../../../store/userStore';

const router = useRouter();

const accessby2 = 'WEBMASTER|ADMIN';
const user = userStore();

const level = user.getDecryptedLevel();
const hasAccess = ref<boolean>(false);

const data = ref<any>({});

const levelSelected = ref<string>('all');

let inter: any = null;

function fetchData() {
  setTimeout(() => {
    $.ajax({
      url: `${user.basePath}/api/server-health`,
      method: 'GET',
      contentType: 'application/json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
      },
    }).then((value) => {
      data.value = value;
    });
  }, 500);
}

onMounted(() => {
  if (typeof level == "string" && level) {
    if (level.match(accessby2)) {
      hasAccess.value = true;
      user.level = level;
    } else {
      hasAccess.value = false;
      router.push('/');
    }
  }

  fetchData();
  
  if (inter) {
    clearInterval(inter);
  }

  inter = setInterval(() => {
    fetchData();
  }, 30000);
});
</script>

<template>
  <div v-if="hasAccess" class="p-4">
    <h1 class="text-2xl font-bold">Server Health</h1>
    <div v-if="data.memory" class="debug-css card mt-4 w-full rounded-none bg-base-100 p-4">
      <h2 class="text-xl font-semibold">Memory</h2>
      <p v-for="mem in data.memory" class="text-base">
        {{ mem }}
      </p>
    </div>
    <!-- v-if="data.logs.legnth > 0 "  -->
    <div v-if="data.logs" class="debug-css card mt-4 w-full overflow-x-auto rounded-none bg-base-100 p-4">
      <div class="flex gap-4 items-center">
        <h2 class="text-xl font-semibold">Logs</h2>
        <select class="select select-bordered w-full max-w-xs rounded-none" v-model="levelSelected">
          <option value="all">All level</option>
          <option value="info">info</option>
          <option value="warn">warn</option>
          <option value="error">error</option>
        </select>
      </div>

      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>Type</th>
            <th>Level</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr v-for="logs in data.logs" v-if="levelSelected == 'all'">
            <td v-if="logs !== ''" class="text-nowrap">{{ JSON.parse(logs).filename }}</td>
            <td v-if="logs !== ''" :class="JSON.parse(logs).level == 'info' ? 'text-green-600' : JSON.parse(logs).level == 'warn' ? 'text-yellow-600' : 'text-red-600'">
              {{ JSON.parse(logs).level }}
            </td>
            <td v-if="logs !== ''">{{ JSON.parse(logs).message }}</td>
          </tr>

          <tr v-for="logs in data.logs">
            <td v-if="logs !== '' && levelSelected != 'all' && levelSelected == JSON.parse(logs).level" class="text-nowrap">{{ JSON.parse(logs).filename }}</td>
            <td v-if="logs !== '' && levelSelected != 'all' && levelSelected == JSON.parse(logs).level" :class="JSON.parse(logs).level == 'info' ? 'text-green-600' : JSON.parse(logs).level == 'warn' ? 'text-yellow-600' : 'text-red-600'">
              {{ JSON.parse(logs).level }}
            </td>
            <td v-if="logs !== '' && levelSelected != 'all' && levelSelected == JSON.parse(logs).level">{{ JSON.parse(logs).message }}</td>
          </tr> 
        </tbody>
      </table>
    </div>
  </div>
</template>
