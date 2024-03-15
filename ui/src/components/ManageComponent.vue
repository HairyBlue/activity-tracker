<script setup lang="ts">
// component
import deleteImg from '../assets/svg/delete.svg';
import editImg from '../assets/svg/edit.svg';

import ButtonSubmit from './globals/buttons/ButtonSubmit.vue';
import ButtonCancel from './globals/buttons/ButtonCancel.vue';
// deps
import { userStore } from '../store/userStore';
import { ref, onMounted, onUnmounted } from 'vue';
import router from '../router';
import $ from 'jquery';
const user = userStore();

const isError = ref<boolean>(false);
const errorMsg = ref<string>('');

const categoryId = ref<any>(null);
const categoryName = ref<string>('');

const clubId = ref<any>(null);
const clubName = ref<string>('');
const clubAcronym = ref<string>('');

const targetActivityId = ref<any>(null);
const targetActivityClubId = ref<any>(null);
const targetActivityYear = ref<string>('');
const targetActivityNumber = ref<number>(0);

const loading = ref<boolean>(false);
const editActive = ref<boolean>(false);
const windowSize = ref();

const targetCard = ref<string>('category');
const columns = ref<Array<string>>([]);
const rows = ref<Array<any>>([]);

const activityFormData = ref<any>({});
// CHECKs FORM*************************************
function cleanForms() {
  categoryId.value = null;
  categoryName.value = '';

  clubId.value = null;
  clubName.value = '';
  clubAcronym.value = '';

  targetActivityId.value = null;
  targetActivityClubId.value = null;
  targetActivityYear.value = '';
  targetActivityNumber.value = 0;
}

// FETCH EVENT ************************************************
function fetchData() {
  loading.value = true;
  $.ajax({
    url: `/api/${targetCard.value}`,
    method: 'GET',
    contentType: 'application/json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done((data) => {
      let key = data.key;
      if (key == 'category') {
        columns.value = ['category name'];
        rows.value = data.result;
      } else if (key == 'club') {
        columns.value = ['club name', 'club acronym'];
        rows.value = data.result;
      } else if (key == 'target-activity') {
        activityFormData.value = data.formData;
        columns.value = ['club name', 'number of activities', 'year'];
        rows.value = data.result;
      }

      loading.value = false;
    })
    .fail((jqXHR) => {
      console.log('ERR1: ' + JSON.stringify(jqXHR));
    });
}

// SUBMIT EVENT ************************************************
function submit() {
  $.ajax({
    url: `/api/${targetCard.value}`,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(
      (function toSubmitData() {
        if (targetCard.value == 'category') {
          return { categoryName: categoryName.value };
        } else if (targetCard.value == 'club') {
          return {
            clubName: clubName.value,
            clubAcronym: clubAcronym.value,
          };
        } else if (targetCard.value == 'target-activity') {
          return {
            targetActivityClubId: targetActivityClubId.value,
            targetActivityNumber: targetActivityNumber.value,
            targetActivityYear: targetActivityYear.value,
          };
        }
      })()
    ),
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done((data) => {
      if (data.message == 'success') {
        isError.value = false;
        errorMsg.value = '';
        fetchData();
        cleanForms();
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

// UPDATE EVENT ************************************************
function edit(active: boolean) {
  editActive.value = active;
  $.ajax({
    url: `/api/${targetCard.value}`,
    method: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(
      (function toEditData() {
        if (targetCard.value == 'category') {
          return { categoryId: categoryId.value, categoryName: categoryName.value };
        } else if (targetCard.value == 'club') {
          return {
            clubId: clubId.value,
            clubName: clubName.value,
            clubAcronym: clubAcronym.value,
          };
        } else if (targetCard.value == 'target-activity') {
          return {
            targetActivityClubId: targetActivityClubId.value,
            targetActivityNumber: targetActivityNumber.value,
            targetActivityYear: targetActivityYear.value,
            targetActivityId: targetActivityId.value,
          };
        }
      })()
    ),
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done((data) => {
      if (data.message == 'success') {
        fetchData();
        cleanForms();
      }
    })
    .fail((jqXHR) => {
      console.log('ERR1: ' + JSON.stringify(jqXHR));
    });
}

function selectedCard(card: 'category' | 'club' | 'target-activity') {
  if (editActive.value) return;
  targetCard.value = card;
  columns.value = [];
  rows.value = [];
  editActive.value = false;
  isError.value = false
  cleanForms();
  fetchData();
}

function editRowAction(data: any, active: boolean) {
  editActive.value = active;
  console.log(data);
  if (targetCard.value == 'category') {
    categoryId.value = data.categoryId;
    categoryName.value = data.categoryName;
  } else if (targetCard.value == 'club') {
    clubId.value = data.clubId;
    clubName.value = data.clubName;
    clubAcronym.value = data.clubAcronym;
  } else if (targetCard.value == 'target-activity') {
    targetActivityId.value = data.targetActivityId;
    targetActivityClubId.value = data.club_id;
    targetActivityYear.value = data.targetActivityYear;
    targetActivityNumber.value = data.targetActivityNumber;
  }
}

function cancel(active: boolean) {
  if (targetCard.value == 'category') {
    categoryName.value = '';
  } else if (targetCard.value == 'club') {
    clubName.value = '';
    clubAcronym.value = '';
  } else if (targetCard.value == 'target-activity') {
  }
  editActive.value = active;
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
  <div id="manage-container" class="sm:p-6">
    <h1>Manage</h1>
    <div class="flex gap-2">
      <div id="activity-form" class="w-1/2">
        <!--  -->
        <!--  -->
        <section @click.self="selectedCard('category')" class="card w-ful p-4" :class="targetCard == 'category' ? 'border-2 border-red-400' : ''">
          <span class="text-lg">Category</span>
          <div class="mt-2">
            <div class="flex flex-col text-start">
              <label>Name</label>
              <input type="text" class="h-8" required v-model="categoryName" />
            </div>
          </div>
          <div v-if="targetCard == 'category'">
            <div>
              <ButtonSubmit @click="submit" v-if="!editActive" class="mt-2 w-1/4 p-2">Add activity</ButtonSubmit>
              <ButtonSubmit @click="edit(false)" v-if="editActive" class="mt-2 p-2 sm:w-1/4">Edit activity</ButtonSubmit>
              <ButtonCancel @click="cancel(false)" v-if="editActive" class="ml-2 mt-2 p-2 sm:w-1/4">Cancel</ButtonCancel>
            </div>
            <div v-if="isError" class="mt-4 text-center text-red-400">
              <span>{{ errorMsg }}</span>
            </div>
          </div>
        </section>
        <!--  -->
        <!--  -->
        <section @click.self="selectedCard('club')" class="card mt-2 w-full p-4" :class="targetCard == 'club' ? 'border-2 border-red-400' : ''">
          <span class="text-lg">Clubs / Organization</span>
          <div class="mt-2 flex flex-col text-start">
            <label>Name</label>
            <input type="text" class="h-8" required v-model="clubName" />
          </div>
          <div class="mt-2 flex flex-col text-start">
            <label>Acronym</label>
            <input type="text" class="h-8" required v-model="clubAcronym" />
          </div>

          <div v-if="targetCard == 'club'">
            <div>
              <ButtonSubmit @click="submit" v-if="!editActive" class="mt-2 w-1/4 p-2">Add activity</ButtonSubmit>
              <ButtonSubmit @click="edit(false)" v-if="editActive" class="mt-2 p-2 sm:w-1/4">Edit activity</ButtonSubmit>
              <ButtonCancel @click="cancel(false)" v-if="editActive" class="ml-2 mt-2 p-2 sm:w-1/4">Cancel</ButtonCancel>
            </div>
            <div v-if="isError" class="mt-4 text-center text-red-400">
              <span>{{ errorMsg }}</span>
            </div>
          </div>
        </section>
        <!--  -->
        <!--  -->
        <section @click.self="selectedCard('target-activity')" class="card mt-2 w-full p-4" :class="targetCard == 'target-activity' ? 'border-2 border-red-400' : ''">
          <span class="text-lg">Target Activity</span>
          <div class="mt-2 flex flex-col text-start">
            <label>Select a clubs/organization</label>
            <select class="h-8" required v-model="targetActivityClubId">
              <option :value="null" selected disabled>clubs</option>
              <option v-for="club in activityFormData.clubs" :value="club.clubId">{{ club.clubName }} ({{ club.clubAcronym }})</option>
            </select>
          </div>
          <div class="flex gap-2">
            <div class="mt-2 flex w-1/2 flex-col text-start">
              <label>Select a year</label>
              <select class="h-8" required v-model="targetActivityYear">
                <option value="" selected disabled>year</option>
                <option v-for="year in activityFormData.years" :value="year">{{ year }}</option>
              </select>
            </div>
            <div class="mt-2 flex w-1/2 flex-col text-start">
              <label>Enter number of activities</label>
              <input type="number" min="0" class="h-8" required placeholder="default is 0" v-model="targetActivityNumber" />
            </div>
          </div>

          <div v-if="targetCard == 'target-activity'">
            <div>
              <ButtonSubmit @click="submit" v-if="!editActive" class="mt-2 w-1/4 p-2">Add activity</ButtonSubmit>
              <ButtonSubmit @click="edit(false)" v-if="editActive" class="mt-2 p-2 sm:w-1/4">Edit activity</ButtonSubmit>
              <ButtonCancel @click="cancel(false)" v-if="editActive" class="ml-2 mt-2 p-2 sm:w-1/4">Cancel</ButtonCancel>
            </div>
            <div v-if="isError" class="mt-4 text-center text-red-400">
              <span>{{ errorMsg }}</span>
            </div>
          </div>
        </section>
        <!--  -->
        <!--  -->
      </div>
      <div class="card w-1/2">
        <div v-if="loading" class="flex h-full items-center justify-center text-2xl"><span>loading...</span></div>
        <div v-else class="max-h-[520px] overflow-y-auto p-4">
          <span>{{ targetCard.toUpperCase() }}</span>
          <table class="w-full table-auto">
            <thead class="border-b">
              <tr>
                <th class="text-start" v-for="column in columns">{{ column }}</th>
                <th class="text-start">action</th>
              </tr>
            </thead>
            <tbody class="text-[10px]">
              <!--  -->
              <!--  -->
              <tr v-if="targetCard == 'category'" v-for="(row, idx) in rows" :class="idx % 2 == 1 ? 'grayed-out' : ''">
                <td>{{ row.categoryName }}</td>
                <td :class="windowSize <= 768 ? '' : 'flex'">
                  <div @click="editRowAction(row, true)"><img :src="editImg" alt="" /></div>
                  <div><img :src="deleteImg" alt="" /></div>
                </td>
              </tr>
              <!--  -->
              <!--  -->
              <tr v-if="targetCard == 'club'" v-for="(row, idx) in rows" :class="idx % 2 == 1 ? 'grayed-out' : ''">
                <td>{{ row.clubName }}</td>
                <td>{{ row.clubAcronym }}</td>

                <td :class="windowSize <= 768 ? '' : 'flex'">
                  <div @click="editRowAction(row, true)"><img :src="editImg" alt="" /></div>
                  <div><img :src="deleteImg" alt="" /></div>
                </td>
              </tr>
              <!--  -->
              <!--  -->
              <tr v-if="targetCard == 'target-activity'" v-for="(row, idx) in rows" :class="idx % 2 == 1 ? 'grayed-out' : ''">
                <td>{{ row.clubAcronym }}</td>
                <td>{{ row.targetActivityNumber }}</td>
                <td>{{ row.targetActivityYear }}</td>

                <td :class="windowSize <= 768 ? '' : 'flex'">
                  <div @click="editRowAction(row, true)"><img :src="editImg" alt="" /></div>
                  <div><img :src="deleteImg" alt="" /></div>
                </td>
              </tr>
              <!--  -->
              <!--  -->
            </tbody>
          </table>
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
</style>
