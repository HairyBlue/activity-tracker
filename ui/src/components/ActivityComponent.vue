<script setup lang="ts">
// component
import deleteImg from '../assets/svg/delete.svg';
import editImg from '../assets/svg/edit.svg';
import noteImg from '../assets/svg/notes.svg';
import ButtonSubmit from './globals/buttons/ButtonSubmit.vue';
import ButtonCancel from './globals/buttons/ButtonCancel.vue';

// deps
import { userStore } from '../store/userStore';
import router from '../router';
import $ from 'jquery';
import { onMounted, onUnmounted, ref } from 'vue';

const user = userStore();
const notesPopUp = ref<boolean>(false);
const editActive = ref<boolean>(false);
const isError = ref<boolean>(false);
const errorMsg = ref<string>('');

const notesData = ref<any>({});
// const activityId = ref<any>(null)
const club_id = ref<any>(null);
const category_id = ref<any>(null);
const activityName = ref<string>('');
const activityNotes = ref<string>('');
const activityStartDateIso = ref<string>('');
const activityEndDateIso = ref<string>('');

const clubs = ref<Array<any>>([]);
const categories = ref<Array<any>>([]);

const rows = ref<Array<any>>([]);
const windowSize = ref();

// NOTE: DATA MANIPULATION
function notesPopUpAction(data: any, active: boolean) {
  notesPopUp.value = active;
  notesData.value = data;
}
function editRowAction(data: any, active: boolean) {
  editActive.value = active;

  club_id.value = data.club_id;
  category_id.value = data.category_id;
  activityName.value = data.activityName;
  activityNotes.value = data.activityNotes;
  activityStartDateIso.value = data.activityStartDateIso;
  activityEndDateIso.value = data.activityEndDateIso;
}

function cleanForm() {
  club_id.value = null;
  category_id.value = null;
  activityName.value = '';
  activityNotes.value = '';
  activityStartDateIso.value = '';
  activityEndDateIso.value = '';
}

function fetchData() {
  $.ajax({
    url: '/api/activity',
    method: 'GET',
    contentType: 'application/json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  }).then((data) => {
    console.log(data);
    clubs.value = data.formdata.club;
    categories.value = data.formdata.category;
    rows.value = data.result;
  });
}

function submit() {
  $.ajax({
    url: '/api/activity',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      club_id: club_id.value,
      category_id: category_id.value,
      activityName: activityName.value,
      activityNotes: activityNotes.value,
      activityStartDateIso: activityStartDateIso.value,
      activityEndDateIso: activityEndDateIso.value,
    }),
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done((data) => {
      if (data.message == 'success') {
        isError.value = false;
        cleanForm();
        console.log('success');
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

function edit(active: boolean) {
  editActive.value = active;
  $.ajax({
    url: '/api/activity',
    method: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({
      club_id: club_id.value,
      category_id: category_id.value,
      activityName: activityName.value,
      activityNotes: activityNotes.value,
      activityStartDateIso: activityStartDateIso.value,
      activityEndDateIso: activityEndDateIso.value,
    }),
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done((data) => {
      if (data.message == 'success') {
        isError.value = false;
        cleanForm();
        console.log('success');
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

function cancel(active: boolean) {
  editActive.value = active;
  cleanForm();
}

// NOTE: WINDOW SIZE LISTENER
function checkWindowSize() {
  windowSize.value = window.innerWidth;
}
onMounted(() => {
  fetchData();
  window.addEventListener('resize', checkWindowSize);
});
onUnmounted(() => {
  window.removeEventListener('resize', checkWindowSize);
});
</script>
<template>
  <div id="activity-container" class="sm:p-6">
    <h1>Activity</h1>
    <!--  -->
    <!--  -->
    <div id="activity-form" class="card w-full p-4">
      <div class="flex gap-8 max-md:block">
        <div class="md:w-1/2">
          <section class="flex flex-col text-start">
            <label>Activity name <span class="text-red-500">*</span></label>
            <input type="text" class="h-8" v-model="activityName" required />
          </section>
          <section class="mt-4 flex h-full flex-col text-start">
            <label>Notes <span class="text-red-500">*</span></label>
            <textarea cols="30" rows="10" v-model="activityNotes" required></textarea>
          </section>
        </div>
        <div class="flex flex-col md:w-1/2">
          <section class="flex flex-col text-start">
            <label>Clubs <span class="text-red-500">*</span></label>
            <select class="h-8" v-model="club_id" required>
              <option value="" selected disabled>Select clubs</option>
              <option v-for="club in clubs" :value="club.clubId">{{ club.clubName }} ({{ club.clubAcronym }})</option>
            </select>
          </section>
          <section class="mt-4 flex flex-col text-start">
            <label>Category <span class="text-red-500">*</span></label>
            <select class="h-8" v-model="category_id" required>
              <option value="" selected disabled>Select category</option>
              <option v-for="category in categories" :value="category.categoryId">{{ category.categoryName }}</option>
            </select>
          </section>

          <section class="mt-4 flex flex-col text-start">
            <label>Start date <span class="text-red-500">*</span></label>
            <input type="date" class="h-8" v-model="activityStartDateIso" required />
          </section>
          <section class="mt-4 flex flex-col text-start">
            <label>End date <span class="text-red-500">*</span></label>
            <input type="date" class="h-8" v-model="activityEndDateIso" required />
          </section>
        </div>
      </div>

      <div>
        <ButtonSubmit @click="submit" v-if="!editActive" class="mt-8 w-1/4 p-2">Add activity</ButtonSubmit>
        <ButtonSubmit @click="edit(false)" v-if="editActive" class="mt-8 p-2 sm:w-1/4">Edit activity</ButtonSubmit>
        <ButtonCancel @click="cancel(false)" v-if="editActive" class="ml-2 mt-2 p-2 sm:w-1/4">Cancel</ButtonCancel>
      </div>
      <div v-if="isError" class="text-center text-lg text-red-400">
        <span>{{ errorMsg }}</span>
      </div>
    </div>
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <div class="card mt-4 max-h-[400px] overflow-y-auto">
      <div>
        <section class="flex">
          <label>Search: </label>
          <input type="text" class="h-8" />
          <ButtonSubmit class="w-1/4 p-2">Add activity</ButtonSubmit>
        </section>
      </div>
      <table class="w-full table-auto">
        <thead>
          <tr>
            <th>Clubs</th>
            <th>Activity</th>
            <th>Category</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody class="text-[10px]">
          <tr v-for="(row, idx) in rows" :key="idx" class="text-center" :class="idx % 2 == 1 ? 'grayed-out' : ''">
            <td>{{ row.clubName }}</td>
            <td>{{ row.activityName }}</td>
            <td>{{ row.categoryName }}</td>
            <td>{{ row.activityDateDisplay }}</td>
            <td :class="windowSize <= 768 ? '' : 'flex'">
              <div @click="notesPopUpAction(rows, true)"><img :src="noteImg" alt="" /></div>
              <div @click="editRowAction(rows, true)"><img :src="editImg" alt="" /></div>
              <div><img :src="deleteImg" alt="" /></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <div v-if="notesPopUp" class="note">
      <div class="card card-note flex flex-col items-center justify-between p-4">
        <div>
          <span class="font-black">
            {{ notesData.clubName }} |
            {{ notesData.activityName }}
          </span>
          <p class="mt-6">{{ notesData.activityNote }}</p>
        </div>
        <ButtonSubmit @click="notesPopUpAction({}, false)" class="w-1/2">Close</ButtonSubmit>
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
