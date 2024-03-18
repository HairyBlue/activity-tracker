<script setup lang="ts">
// component
import deleteImg from '../assets/svg/delete.svg';
import editImg from '../assets/svg/edit.svg';
import noteImg from '../assets/svg/notes.svg';
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
const notesPopUp = ref<boolean>(false);
const deletePopUp = ref<boolean>(false);
const editActive = ref<boolean>(false);
const isError = ref<boolean>(false);
const errorMsg = ref<string>('');

const popUpData = ref<any>({});

const activityId = ref<any>(null);
const club_id = ref<any>(null);
const category_id = ref<any>(null);
const activityName = ref<string>('');
const activityNotes = ref<string>('');
const activityStartDateIso = ref<string>('');
const activityEndDateIso = ref<string>('');

const clubs = ref<Array<any>>([]);
const categories = ref<Array<any>>([]);
const rows = ref<Array<any>>([]);
const recordSize = ref<number>(0);
const yearObj = ref<Array<string>>([]);

// NOTE: THIS IS FOR HANDLING QUERY PARAMETERS
const searchFilter = ref<string>('');
const clubFilter = ref<any>('');
const categoryFilter = ref<any>('');
const year = ref(new Date().getFullYear().toString());
const orderBy = ref<any>('');

const pageSize = ref<number>(20);
const pageNumber = ref<number>(1);

const windowSize = ref();
// NOTE: DATA MANIPULATION
function notesPopUpAction(data: any, active: boolean) {
  notesPopUp.value = active;
  popUpData.value = data;
}

function deletePopUpAction(data: any, active: boolean) {
  deletePopUp.value = active;
  popUpData.value = data;
}

function editRowAction(data: any, active: boolean) {
  editActive.value = active;

  activityId.value = data.activityId;
  club_id.value = data.club_id;
  category_id.value = data.category_id;
  activityName.value = data.activityName;
  activityNotes.value = data.activityNotes;
  activityStartDateIso.value = data.activityStartDateIso;
  activityEndDateIso.value = data.activityEndDateIso;
}

function deleteRowAction(data: any, active: boolean) {
  editActive.value = active;

  activityId.value = data.activityId;
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
    data: {
      pageSize: pageSize.value,
      pageNumber: pageNumber.value,
      searchFilter: searchFilter.value,
      clubFilter: clubFilter.value,
      categoryFilter: categoryFilter.value,
      year: year.value,
      orderBy: orderBy.value,
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  }).then((data) => {
    console.log(data);
    recordSize.value = data.count[0].count;
    clubs.value = data.formdata.club;
    categories.value = data.formdata.category;
    rows.value = data.result;
    yearObj.value = data.year;
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

function edit() {
  $.ajax({
    url: '/api/activity',
    method: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({
      activityId: activityId.value,
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
        editActive.value = false;
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

function destroy(activityId: any) {
  $.ajax({
    url: `/api/activity/${activityId}`,
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

// NOTE: WINDOW SIZE LISTENER
function checkWindowSize() {
  windowSize.value = window.innerWidth;
}

function clickPageNum(prevNext: 'prev' | 'next') {
  const maxPage = Math.ceil(recordSize.value / pageSize.value);

  if (prevNext == 'prev') {
    if (pageNumber.value == 1) return;
    pageNumber.value -= 1;
    fetchData();
  }
  if (prevNext == 'next') {
    if (pageNumber.value == maxPage) return;
    pageNumber.value += 1;
    fetchData();
  }
}

function resetFilter() {
  searchFilter.value = '';
  clubFilter.value = '';
  categoryFilter.value = '';
  orderBy.value = '';
  year.value = new Date().getFullYear().toString();
  fetchData();
}

// TODO: CLEAN UP WATCH
watch(
  [pageSize, searchFilter, clubFilter, categoryFilter, year, orderBy],
  (
    [newPageSize, newSearchFilter, newClubFilter, newCategoryFilter, newYear, newOrderBy],
    [oldPageSize, oldSearchFilter, oldClubFilter, oldCategoryFilter, oldYear, oldOrderBy]
  ) => {
    if (newPageSize !== oldPageSize) {
      pageNumber.value = 1;
      fetchData();
    }
    if (newSearchFilter !== oldSearchFilter) fetchData();
    if (newClubFilter !== oldClubFilter) fetchData();
    if (newCategoryFilter !== oldCategoryFilter) fetchData();
    if (newYear !== oldYear) fetchData();
    if (newOrderBy !== oldOrderBy) fetchData();
  }
);

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
            <label>Notes <span class="text-gray-400">( optional )</span></label>
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
    <div class="card mt-4 max-h-screen overflow-y-auto">
      <div class="flex w-full items-center justify-between p-2 max-lg:flex-col max-lg:gap-2">
        <section class="flex w-full gap-1 lg:w-1/3">
          <input type="text" class="w-full" v-model="searchFilter" />
          <!-- <ButtonSubmit class="px-4 py-1 text-xs sm:min-w-[150px]">Search Activity</ButtonSubmit> -->
        </section>
        <section class="ml-1 flex gap-2 max-md:flex-col">
          <div>
            <select class="w-full py-1 md:w-[150px]" v-model="clubFilter">
              <option value="" selected disabled>Club and Oraginzation</option>
              <option v-for="club in clubs" :value="club.clubId">{{ club.clubName }} - {{ club.clubAcronym }}</option>
            </select>
          </div>
          <div>
            <select class="w-full py-1 md:w-[150px]" v-model="categoryFilter">
              <option value="" selected disabled>Category</option>
              <option v-for="category in categories" :value="category.categoryId">{{ category.categoryName }}</option>
            </select>
          </div>
          <div>
            <select class="w-full py-1 md:w-[150px]" v-model="year">
              <option v-for="years in yearObj" :value="years">{{ years }}</option>
            </select>
          </div>
          <div>
            <select class="w-full py-1 md:w-[150px]" v-model="orderBy">
              <option disabled selected value="">Order by year</option>
              <option value="DESC">DESCENDING</option>
              <option value="ASC">ASCENDING</option>
            </select>
          </div>
          <ButtonSubmit class="px-8 py-1" @click="resetFilter">Reset</ButtonSubmit>
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
        <tbody class="max-sm:text-[10px] md:text-[12px]">
          <tr v-for="(row, idx) in rows" :key="idx" class="text-center" :class="idx % 2 == 1 ? 'grayed-out' : ''">
            <td>{{ row.clubName }}</td>
            <td>{{ row.activityName }}</td>
            <td>{{ row.categoryName }}</td>
            <td>{{ row.activityDisplayDate }}</td>
            <td :class="windowSize <= 768 ? '' : 'flex'">
              <div @click="notesPopUpAction(row, true)"><img :src="noteImg" alt="" /></div>
              <div @click="editRowAction(row, true)"><img :src="editImg" alt="" /></div>
              <div @click="deletePopUpAction(row, true)"><img :src="deleteImg" alt="" /></div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="mb-2 mt-8 flex items-center justify-center gap-2">
        <span class="select-none" @click="clickPageNum('prev')">Prev</span>
        <div class="card border px-8 py-1">{{ pageNumber }}</div>
        <span class="select-none" @click="clickPageNum('next')">Next</span>
        <select v-model="pageSize">
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
    </div>
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <div v-if="notesPopUp" class="note">
      <div class="card card-note flex flex-col items-center justify-between p-4">
        <div class="text-center">
          <p class="text-xs font-black">
            {{ popUpData.clubName }}
          </p>
          <p class="mb-2 text-xs font-black">
            {{ popUpData.activityName }}
          </p>
          <p class="mb-2 text-xs font-medium">{{ popUpData.activityDisplayDate }}</p>
          <hr />
          <p class="mt-6">{{ popUpData.activityNotes }}</p>
        </div>
        <ButtonSubmit @click="notesPopUpAction({}, false)" class="w-1/2 p-2">Close</ButtonSubmit>
      </div>
    </div>
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <div v-if="deletePopUp" class="note">
      <div class="card m-auto flex h-[500px] w-[500px] flex-col items-center justify-between border-2 border-red-400 p-4">
        <div class="text-center">
          <p class="text-xs font-black">
            {{ popUpData.clubName }}
          </p>
          <p class="mb-2 text-xs font-black">
            {{ popUpData.activityName }}
          </p>
          <p class="mb-2 text-xs font-medium">{{ popUpData.activityDisplayDate }}</p>
          <hr />
          <p class="mt-6">{{ popUpData.activityNotes }}</p>
        </div>
        <div class="flex w-full gap-8">
          <ButtonWarn @click="destroy(popUpData.activityId)" class="w-1/2 p-2">Delete </ButtonWarn>
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
