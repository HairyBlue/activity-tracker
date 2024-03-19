<script setup lang="ts">
// component
import deleteImg from '../assets/svg/delete.svg';
import editImg from '../assets/svg/edit.svg';

import ButtonSubmit from './globals/buttons/ButtonSubmit.vue';
import ButtonCancel from './globals/buttons/ButtonCancel.vue';
import ButtonWarn from './globals/buttons/ButtonWarn.vue';
// deps
import { userStore } from '../store/userStore';
import { ref, onMounted, onUnmounted, watch } from 'vue';
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

const targetCard = ref<'category' | 'club' | 'target-activity'>('category');
const columns = ref<Array<string>>([]);
const rows = ref<Array<any>>([]);

const activityFormData = ref<any>({});

const year = ref<any>(new Date().getFullYear());

const deletePopUpCategory = ref<boolean>(false);
const deletePopUpClub = ref<boolean>(false);
const deletePopUpTarget = ref<boolean>(false);

const popUpDataCategory = ref<any>({});
const popUpDataClub = ref<any>({});
const popUpDataTarget = ref<any>({});

const semester = ref<'1' | '2'>('1');
const targetActivitySemester = ref<'1' | '2'>('1');

function deletePopUpAction(data: any, active: boolean) {
  if (targetCard.value == 'category') {
    deletePopUpCategory.value = active;
    popUpDataCategory.value = data;
  }
  if (targetCard.value == 'club') {
    deletePopUpClub.value = active;
    popUpDataClub.value = data;
  }
  if (targetCard.value == 'target-activity') {
    deletePopUpTarget.value = active;
    popUpDataTarget.value = data;
  }
}

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
  targetActivitySemester.value = '1';
}

// FETCH EVENT ************************************************
function fetchData() {
  loading.value = true;
  $.ajax({
    url: `/api/${targetCard.value}`,
    method: 'GET',
    contentType: 'application/json',
    data: {
      year: year.value,
      semester: semester.value,
    },
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
        columns.value = ['name', 'acronym'];
        rows.value = data.result;
      } else if (key == 'target-activity') {
        activityFormData.value = data.formData;
        columns.value = ['name', 'target', 'year'];
        rows.value = data.result;
      }
      isError.value = false;
      errorMsg.value = '';
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
            targetActivitySemester: targetActivitySemester.value,
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
      if (jqXHR.status == 400) {
        isError.value = true;
        errorMsg.value = jqXHR.responseJSON.message;

        setTimeout(() => {
          isError.value = false;
          errorMsg.value = '';
        }, 10000);
      }
      if (jqXHR.status == 401 || jqXHR.status == 403) router.push('/');
    });
}

// UPDATE EVENT ************************************************
function edit(active: boolean) {
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
            targetActivitySemester: targetActivitySemester.value,
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
        editActive.value = active;
        fetchData();
        cleanForms();
      }
    })
    .fail((jqXHR) => {
      if (jqXHR.status == 400) {
        isError.value = true;
        errorMsg.value = jqXHR.responseJSON.message;

        setTimeout(() => {
          cleanForms();
          editActive.value = false;
          isError.value = false;
          errorMsg.value = '';
        }, 10000);
      }
    });
}

function destroy(id: any) {
  $.ajax({
    url: `/api/${targetCard.value}/${id}`,
    method: 'DELETE',
    contentType: 'application/json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done((data) => {
      if (data.message == 'success') {
        deletePopUpCategory.value = false;
        deletePopUpClub.value = false;
        deletePopUpTarget.value = false;
        cleanForms();
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

function selectedCard(card: 'category' | 'club' | 'target-activity') {
  if (editActive.value) return;
  targetCard.value = card;
  columns.value = [];
  rows.value = [];
  editActive.value = false;
  isError.value = false;
  cleanForms();
  fetchData();
}

function editRowAction(data: any, active: boolean) {
  editActive.value = active;
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
    targetActivitySemester.value = data.targetActivitySemester;
  }
}

function cancel(active: boolean) {
  if (targetCard.value == 'category') {
    categoryName.value = '';
  } else if (targetCard.value == 'club') {
    clubName.value = '';
    clubAcronym.value = '';
  } else if (targetCard.value == 'target-activity') {
    targetActivityClubId.value = null;
    targetActivityYear.value = '';
    targetActivityNumber.value = 0;
    targetActivitySemester.value = '1';
  }
  editActive.value = active;
  errorMsg.value = '';
  isError.value = false;
}

// NOTE: WINDOW SIZE LISTENER
function checkWindowSize() {
  windowSize.value = window.innerWidth;
}

watch([year, semester], ([yearNew, semesterNew], [yearOld, semesterOld]) => {
  if (yearNew !== yearOld) {
    fetchData();
  }
  if (semesterNew !== semesterOld) {
    fetchData();
  }
});

onMounted(() => {
  fetchData();
  window.addEventListener('resize', checkWindowSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkWindowSize);
});
</script>

<template>
  <div id="manage-container" class="md:p-6">
    <h1>Manage</h1>
    <div class="flex h-full gap-2 max-md:flex-col">
      <div id="activity-form" class="md:w-1/2">
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
            <label>Select clubs/organization</label>
            <select class="h-8" required v-model="targetActivityClubId">
              <option :value="null" selected disabled>clubs</option>
              <option v-for="club in activityFormData.clubs" :value="club.clubId">{{ club.clubName }} ({{ club.clubAcronym }})</option>
            </select>
          </div>
          <div class="flex gap-2">
            <div class="mt-2 flex w-1/2 flex-col text-start">
              <label>Year</label>
              <select class="h-8" required v-model="targetActivityYear">
                <option value="" selected disabled>year</option>
                <option v-for="year in activityFormData.years" :value="year">{{ year }}</option>
              </select>
            </div>
            <div class="mt-2 flex flex-col text-start">
              <label>Number of activities</label>
              <input type="number" min="0" class="h-8" required placeholder="default is 0" v-model="targetActivityNumber" />
            </div>
            <div class="mt-2 flex flex-col text-start">
              <label>Semester</label>
              <select class="h-8" v-model="targetActivitySemester">
                <option :value="1">First Semester</option>
                <option :value="2">Second Semester</option>
              </select>
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

        <section v-if="targetCard == 'target-activity'" class="card mt-2 p-4">
          <span>NOTE: Clubs and Organizations dont have target activity</span>
          <div class="overflow-y-auto">
            <table class="w-full table-auto">
              <thead class="border-b">
                <tr>
                  <th class="text-start">name</th>
                  <th class="text-start">acronym</th>
                </tr>
              </thead>
              <tbody class="text-[10px]">
                <tr v-if="targetCard == 'target-activity'" v-for="(row, idx) in activityFormData.clubNoAct" :class="idx % 2 == 1 ? 'grayed-out' : ''">
                  <td>{{ row.clubName }}</td>
                  <td>{{ row.clubAcronym }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <!--  -->
        <!--  -->
      </div>
      <div class="card md:w-1/2">
        <div v-if="loading" class="flex h-full items-center justify-center text-2xl"><span>loading...</span></div>
        <div v-else class="overflow-y-auto p-4">
          <div class="flex items-center justify-between">
            <span>{{ targetCard.toUpperCase() }}</span>
            <div class="flex gap-2">
              <div class="flex text-start">
                <select class="h-8" v-model="semester">
                  <option :value="1">First Semester</option>
                  <option :value="2">Second Semester</option>
                </select>
              </div>
              <div v-if="targetCard == 'target-activity'">
                <select class="h-8" v-model="year">
                  <option v-for="year of activityFormData.years" :value="year">{{ year }}</option>
                </select>
              </div>
            </div>
          </div>

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
                  <div @click="deletePopUpAction(row, true)"><img :src="deleteImg" alt="" /></div>
                </td>
              </tr>
              <!--  -->
              <!--  -->
              <tr v-if="targetCard == 'club'" v-for="(row, idx) in rows" :class="idx % 2 == 1 ? 'grayed-out' : ''">
                <td>{{ row.clubName }}</td>
                <td>{{ row.clubAcronym }}</td>

                <td :class="windowSize <= 768 ? '' : 'flex'">
                  <div @click="editRowAction(row, true)"><img :src="editImg" alt="" /></div>
                  <div @click="deletePopUpAction(row, true)"><img :src="deleteImg" alt="" /></div>
                </td>
              </tr>
              <!--  -->
              <!--  -->
              <tr v-if="targetCard == 'target-activity'" v-for="(row, idx) in rows" :class="idx % 2 == 1 ? 'grayed-out' : ''">
                <td>{{ row.clubName }} ({{ row.clubAcronym }})</td>
                <td>{{ row.targetActivityNumber }}</td>
                <td>{{ row.targetActivityYear }}</td>

                <td :class="windowSize <= 768 ? '' : 'flex'">
                  <div @click="editRowAction(row, true)"><img :src="editImg" alt="" /></div>
                  <div @click="deletePopUpAction(row, true)"><img :src="deleteImg" alt="" /></div>
                </td>
              </tr>
              <!--  -->
              <!--  -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <div v-if="deletePopUpCategory" class="note">
      <div class="card m-auto flex h-[500px] flex-col items-center justify-between border-2 border-red-400 p-4">
        <div class="text-center">
          <h2 class="mb-2 text-2xl font-black">{{ targetCard.toLocaleUpperCase() }}</h2>
          <hr />
          <p class="text-base font-medium">
            {{ popUpDataCategory.categoryName }}
          </p>
        </div>
        <div class="text-red-400">
          <span class="text-base font-black">Warning: </span>
          Deleting this will also <span class="font-black">delete all data related</span> to this category.
        </div>
        <div class="flex w-full gap-8">
          <ButtonWarn @click="destroy(popUpDataCategory.categoryId)" class="w-1/2 p-2">Are you sure you want to delete</ButtonWarn>
          <ButtonCancel @click="deletePopUpAction({}, false)" class="w-1/2 p-2">Cancel</ButtonCancel>
        </div>
      </div>
    </div>
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <div v-if="deletePopUpClub" class="note">
      <div class="card m-auto flex h-[500px] flex-col items-center justify-between border-2 border-red-400 p-4">
        <div class="text-center">
          <h2 class="mb-2 text-2xl font-black">{{ targetCard.toLocaleUpperCase() }}</h2>
          <hr />
          <p class="text-base font-medium">
            {{ popUpDataClub.clubAcronym }}
          </p>
          <p class="text-base font-medium">
            {{ popUpDataClub.clubName }}
          </p>
        </div>
        <div class="text-red-400">
          <span class="text-base font-black">Warning: </span>
          Deleting this will also <span class="font-black">delete all data related</span> to this category.
        </div>
        <div class="flex w-full gap-8">
          <ButtonWarn @click="destroy(popUpDataClub.clubId)" class="w-1/2 p-2">Are you sure you want to delete</ButtonWarn>
          <ButtonCancel @click="deletePopUpAction({}, false)" class="w-1/2 p-2">Cancel</ButtonCancel>
        </div>
      </div>
    </div>
    <!--  -->
    <!--  -->
    <!--  -->
    <!--  -->
    <div v-if="deletePopUpTarget" class="note">
      <div class="card m-auto flex h-[500px] flex-col items-center justify-between border-2 border-red-400 p-4">
        <div class="text-center">
          <h2 class="mb-2 text-2xl font-black">{{ targetCard.toLocaleUpperCase() }}</h2>
          <hr />
          <p class="text-base font-medium">{{ popUpDataTarget.clubName }} ({{ popUpDataTarget.clubAcronym }})</p>
          <p class="text-base font-medium">Target Activity: {{ popUpDataTarget.targetActivityNumber }} in {{ popUpDataTarget.targetActivityYear }}</p>
        </div>
        <div class="text-red-400">
          <span class="text-base font-black">Warning: </span>
          Deleting this will <span class="font-black">affect the percentage computation</span> for the overview.
        </div>
        <div class="flex w-full gap-8">
          <ButtonWarn @click="destroy(popUpDataTarget.targetActivityId)" class="w-1/2 p-2">Are you sure you want to delete</ButtonWarn>
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

#manage-container {
  position: relative;
  min-height: 100%;
}

table {
  background-color: var(--white-color);
}

td,
th {
  padding: 2px;
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
</style>
