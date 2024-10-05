<script lang="ts" setup>
import Table from './Table.vue';
import Form from './Form.vue';
import $ from 'jquery';
import { userStore } from '../../../store/userStore';
import { onMounted, ref, nextTick } from 'vue';

const user = userStore();
const userRoles = ref<string[]>([]);

const userEmits = ref<any[]>([]);
const toTick = ref<boolean>(true);


function userRole() {
  $.ajax({
    url: `${user.basePath}/api/user-roles`,
    method: 'GET',
    contentType: 'application/json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  }).then((value) => {
    userRoles.value = value.data;
  });

}

async function userEmit(user: any) {
  userEmits.value = user;
  toTick.value = false;
  await nextTick();
  toTick.value = true;
}

onMounted(()=>{
  userRole()
})



</script>

<template>
  <div v-if="userRoles.length > 0" class="flex h-full w-full">
    <Form v-if="toTick" :userRoles="userRoles" :userFromEmits="userEmits"/>
    <Table :userRoles="userRoles" @user-emit="userEmit"/>
  </div>
</template>
