<script setup lang="ts">
// component
import deleteImg from '../assets/svg/delete.svg';
import editImg from '../assets/svg/edit.svg';

import ButtonSubmit from './globals/buttons/ButtonSubmit.vue';
import ButtonCancel from './globals/buttons/ButtonCancel.vue';
import ButtonWarn from './globals/buttons/ButtonWarn.vue';
// deps
import { userStore } from '../store/userStore';
import router from '../router';
import $ from 'jquery';
import { onMounted, onUnmounted, ref, watch } from 'vue';

// YAY BUNCH OF REFs, need to clean up soon
const user = userStore();
const windowSize = ref();
const deletePopUp = ref<boolean>(false);
const editActive = ref<boolean>(false);

const isError = ref<boolean>(false);
const errorMsg = ref<string>('');

const myError = ref<boolean>(false);
const popUpData = ref<any>({});

const rows = ref<Array<any>>([]);

const selectionRoleWM = ref<'STAFF' | 'ADMIN'>('ADMIN');
const selectionRoleAD = ref<'STAFF'>('STAFF');

const username = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');

const myId = ref<any>(null);
const myUsername = ref<string>('');
const myEmail = ref<string>('');

const clickAccount = ref<boolean>(false);
function deletePopUpAction(data: any, active: boolean) {
  deletePopUp.value = active;
  popUpData.value = data;
}

function editRowAction(data: any, active: boolean) {
  editActive.value = active;

  username.value = data.username;
  email.value = data.email;
}

function cleanForm() {
  username.value = '';
  email.value = '';
  password.value = '';
  selectionRoleWM.value = 'ADMIN';
  selectionRoleAD.value = 'STAFF';
}

function fetchData() {
  $.ajax({
    url: '/api/user',
    method: 'GET',
    contentType: 'application/json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  }).then((data) => {
    console.log(data);
    rows.value = data.users;
    myId.value = data.myaccount.userId;
    myUsername.value = data.myaccount.username;
    myEmail.value = data.myaccount.email;
  });
}

function submit() {
  $.ajax({
    url: '/api/user',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      username: username.value,
      email: email.value,
      password: password.value,
      role: user.getLevel() === 'WEBMASTER' ? selectionRoleWM.value : selectionRoleAD.value,
    }),
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done((data) => {
      if (data.message == 'success') {
        cleanForm();
        fetchData();
      }
    })
    .fail((jqXHR) => {
      if (jqXHR.status == 400) {
        isError.value = true;
        errorMsg.value = jqXHR.responseJSON.message;

        setTimeout(() => {
          isError.value = false;
        }, 10000);
      }
      if (jqXHR.status == 401 || jqXHR.status == 403) router.push('/');
    });
}

function edit() {
  $.ajax({
    url: '/api/user',
    method: 'PATCH',
    contentType: 'application/json',
    data: JSON.stringify({
      username: username.value,
      email: email.value,
    }),
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done((data) => {
      if (data.message == 'success') {
        editActive.value = false;
        cleanForm();
        fetchData();
      }
    })
    .fail((jqXHR) => {
      if (jqXHR.status == 400) {
        isError.value = true;
        errorMsg.value = jqXHR.responseJSON.message;

        setTimeout(() => {
          isError.value = false;
        }, 10000);
      }
      if (jqXHR.status == 401 || jqXHR.status == 403) router.push('/');
    });
}

function editAccount() {
  $.ajax({
    url: '/api/user',
    method: 'PATCH',
    contentType: 'application/json',
    data: JSON.stringify({
      username: username.value,
      email: email.value,
    }),
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done((data) => {
      if (data.message == 'success') {
        editActive.value = false;
        cleanForm();
        fetchData();
      }
    })
    .fail((jqXHR) => {
      if (jqXHR.status == 400) {
        myError.value = true;
        errorMsg.value = jqXHR.responseJSON.message;

        setTimeout(() => {
          myError.value = false;
        }, 10000);
      }

      if (jqXHR.status == 401 || jqXHR.status == 403) router.push('/');
    });
}

function destroy(userId: any) {
  $.ajax({
    url: `/api/user/${userId}`,
    method: 'DELETE',
    contentType: 'application/json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done((data) => {
      if (data.message == 'success') {
        deletePopUp.value = false;
        cleanForm();
        fetchData();
      }
    })
    .fail((jqXHR) => {
      if (jqXHR.status == 400) {
        isError.value = true;
        errorMsg.value = jqXHR.responseJSON.message;
      }
      if (jqXHR.status == 401 || jqXHR.status == 403) router.push('/');
    });
}

function cancel() {
  editActive.value = false;
  cleanForm();
}
function accountCancel() {
  clickAccount.value = false;
}
function acountClick() {
  clickAccount.value = true;
}
// NOTE: WINDOW SIZE LISTENER
function checkWindowSize() {
  windowSize.value = window.innerWidth;
}

watch([selectionRoleWM, selectionRoleAD], ([selectionRoleWMNew, selectionRoleADNew], [selectionRoleWMNOld, selectionRoleADOld]) => {
  if (selectionRoleADNew == selectionRoleADOld) {
    selectionRoleAD.value = selectionRoleADNew;
  }
  if (selectionRoleWMNew !== selectionRoleWMNOld) {
    selectionRoleWM.value = selectionRoleWMNew;
  }
});
onMounted(() => {
  fetchData();
  window.addEventListener('resize', checkWindowSize);
  console.log(user.getLevel());
});

onUnmounted(() => {
  window.removeEventListener('resize', checkWindowSize);
});
</script>
<template>
  <div id="activity-container" class="md:p-6">
    <h1>User Management</h1>
    <!--  -->
    <!--  -->
    <div id="user-form" class="card p-4 lg:w-1/2">
      <div class="flex gap-8 max-md:block">
        <div class="md:w-1/2">
          <section class="flex flex-col text-start">
            <label>Username: <span class="text-red-500">*</span></label>
            <input type="text" class="h-8" v-model="username" required />
          </section>
          <section class="flex flex-col text-start">
            <label>Email: <span class="text-red-500">*</span></label>
            <input type="email" class="h-8" v-model="email" required />
          </section>
        </div>
        <div v-if="!editActive" class="md:w-1/2">
          <section class="flex flex-col text-start">
            <label>Password: <span class="text-red-500">*</span></label>
            <input type="text" class="h-8" v-model="password" required />
          </section>
          <section class="flex flex-col text-start">
            <label>Role <span class="text-red-500">*</span></label>
            <select v-if="user.getLevel() == 'WEBMASTER'" class="h-8" v-model="selectionRoleWM" required>
              <option value="ADMIN">ADMIN</option>
              <option value="STAFF">STAFF</option>
            </select>
            <select v-if="user.getLevel() == 'ADMIN'" class="h-8" v-model="selectionRoleAD" required>
              <option value="STAFF">STAFF</option>
            </select>
          </section>
        </div>
      </div>

      <div>
        <ButtonSubmit @click="submit" v-if="!editActive" class="mt-8 p-2 max-lg:w-1/2 lg:w-1/4">Add activity</ButtonSubmit>
        <ButtonSubmit @click="edit" v-if="editActive" class="mr-1 mt-8 p-2 max-lg:w-1/2 lg:w-1/4">Edit activity</ButtonSubmit>
        <ButtonCancel @click="cancel" v-if="editActive" class="mt-2 p-2 max-lg:w-1/2 lg:w-1/4">Cancel</ButtonCancel>
      </div>
      <div v-if="isError" class="text-center text-lg text-red-400">
        <span>{{ errorMsg }}</span>
      </div>
    </div>
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <div class="card mt-4 max-h-screen overflow-y-auto lg:w-1/2">
      <table class="w-full table-auto">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="max-sm:text-[10px] md:text-[12px]">
          <tr v-for="(row, idx) in rows" :key="idx" class="text-center" :class="idx % 2 == 1 ? 'grayed-out' : ''">
            <td>{{ row.username }}</td>
            <td>{{ row.email }}</td>
            <td>{{ row.level }}</td>
            <td :class="windowSize <= 768 ? '' : 'flex'">
              <div @click="editRowAction(row, true)"><img :src="editImg" alt="" /></div>
              <div @click="deletePopUpAction(row, true)"><img :src="deleteImg" alt="" /></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!--  -->
    <div @click.self="acountClick" id="my-form" class="card mt-8 p-4 lg:w-1/2">
      <span class="text-lg">My Account</span>
      <div class="mt-2 gap-8 max-md:block">
        <section class="flex flex-col text-start">
          <label>Username: <span class="text-red-500">*</span></label>
          <input type="text" class="h-8" v-model="myUsername" required />
        </section>
        <section class="mt-2 flex flex-col text-start">
          <label>Email: <span class="text-red-500">*</span></label>
          <input type="email" class="h-8" v-model="myEmail" required />
        </section>
      </div>

      <div v-if="clickAccount">
        <ButtonSubmit @click="editAccount" class="mr-1 mt-8 p-2 max-lg:w-1/2 lg:w-1/4">Edit activity</ButtonSubmit>
        <ButtonCancel @click="accountCancel" class="mt-2 p-2 max-lg:w-1/2 lg:w-1/4">Cancel</ButtonCancel>
      </div>
      <div v-if="myError && clickAccount" class="text-center text-lg text-red-400">
        <span>{{ errorMsg }}</span>
      </div>
    </div>
    <!--  -->
    <div v-if="deletePopUp" class="note">
      <div class="card m-auto flex h-[500px] w-[500px] flex-col items-center justify-between border-2 border-red-400 p-4">
        <div class="text-center">
          <p class="text-xs font-black">
            {{ popUpData.username }}
          </p>
          <p class="mb-2 text-xs font-black">
            {{ popUpData.email }}
          </p>
          <p class="mb-2 text-xs font-medium">{{ popUpData.level }}</p>
        </div>
        <div class="flex w-full gap-8">
          <ButtonWarn @click="destroy(popUpData.userId)" class="w-1/2 p-2">Delete </ButtonWarn>
          <ButtonCancel @click="deletePopUpAction({}, false)" class="w-1/2 p-2">Cancel</ButtonCancel>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: var(--font-s-xl);
  font-weight: var(--font-w-xl);
  text-align: start;
}

#activity-container {
  position: relative;
  min-height: 100%;
}

table {
  background-color: var(--white-color);
}

thead {
  box-shadow: var(--box-shadow);
}

td,
th {
  padding: 4px;
}

img {
  min-width: 12px;
}

img:hover {
  cursor: pointer;
}

.grayed-out {
  background-color: rgba(156, 163, 175, 25%);
}

.note {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.card-note {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}
</style>
