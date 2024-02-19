<script setup lang="ts">
// dummy
import activity_data from '../data/activity-sample';
import clubsSample from '../data/clubs-sample';
import categoriesSample from '../data/categories-sample';
// dummy
import deleteImg from '../assets/svg/delete.svg';
import editImg from '../assets/svg/edit.svg';
import noteImg from '../assets/svg/notes.svg';
import ButtonSubmit from './globals/buttons/ButtonSubmit.vue';
import ButtonCancel from './globals/buttons/ButtonCancel.vue';

import $ from 'jquery';
import { onMounted, onUnmounted, ref } from 'vue';

const notesPopUp = ref<boolean>(false);
const editActive = ref<boolean>(false);

// const activityId = ref<any>(null)
const clubId = ref<any>(null);
const categoryId = ref<any>(null);
const notesData = ref<any>({});
const activityName = ref<string>('');
const activityNote = ref<string>('');
const activityStartDateIso = ref<string>('');
const activityEndDateIso = ref<string>('');

const windowSize = ref();

// NOTE: DATA MANIPULATION
function notesPopUpAction(data: any, active: boolean) {
   notesPopUp.value = active;
   notesData.value = data;
}

function editRowAction(data: any, active: boolean) {
   editActive.value = active;

   clubId.value = data.clubId;
   categoryId.value = data.categoryId;
   activityName.value = data.activityName;
   activityNote.value = data.activityNote;
   activityStartDateIso.value = data.activityStartDateIso;
   activityEndDateIso.value = data.activityEndDateIso;
}

function cleanForm() {
   clubId.value = null;
   categoryId.value = null;
   activityName.value = '';
   activityNote.value = '';
   activityStartDateIso.value = '';
   activityEndDateIso.value = '';
}

function checkNotEmpty() {
   return (
      clubId.value !== null &&
      categoryId.value !== null &&
      activityName.value !== '' &&
      activityNote.value !== '' &&
      activityStartDateIso.value !== '' &&
      activityEndDateIso.value !== ''
   );
}

// NOTE: REST API HERE
function toSubmitData() {
   return {
      clubId: clubId.value,
      categoryId: categoryId.value,
      activityName: activityName.value,
      activityNote: activityNote.value,
      activityStartDateIso: activityStartDateIso.value,
      activityEndDateIso: activityEndDateIso.value,
   };
}
function submit() {
   if (checkNotEmpty()) {
      $.ajax({
         url: '/api/activity',
         method: 'POST',
         contentType: 'application/json',
         data: JSON.stringify(toSubmitData()),
      })
         .done((data) => {
            if (data.message == 'success') {
               console.log('success');
            }
         })
         .fail((jqXHR) => {
            if (jqXHR.status == 400) {
               console.log('error');
            }
         });

      cleanForm();
   }
}

function edit(active: boolean) {
   if (checkNotEmpty()) {
      editActive.value = active;
      $.ajax({
         url: '/api/activity',
         method: 'PUT',
         contentType: 'application/json',
         data: JSON.stringify(toSubmitData()),
      })
         .done((data) => {
            if (data.message == 'success') {
               console.log('success');
            }
         })
         .fail((jqXHR) => {
            if (jqXHR.status == 400) {
               console.log('error');
            }
         });
      cleanForm();
   }
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
                  <textarea cols="30" rows="10" v-model="activityNote" required></textarea>
               </section>
            </div>
            <div class="flex flex-col md:w-1/2">
               <section class="flex flex-col text-start">
                  <label>Clubs <span class="text-red-500">*</span></label>
                  <select class="h-8" v-model="clubId" required>
                     <option value="" selected disabled>Select clubs</option>
                     <option v-for="(club, idx) in clubsSample" :value="idx">{{ club }}</option>
                  </select>
               </section>
               <section class="mt-4 flex flex-col text-start">
                  <label>Category <span class="text-red-500">*</span></label>
                  <select class="h-8" v-model="categoryId" required>
                     <option value="" selected disabled>Select category</option>
                     <option v-for="(category, idx) in categoriesSample" :value="idx">{{ category }}</option>
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
      </div>
      <!--  -->
      <!--  -->
      <!--  -->
      <!--  -->
      <div class="card mt-4 max-h-[400px] overflow-y-auto">
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
               <tr
                  v-for="(data, idx) in activity_data"
                  :key="idx"
                  class="text-center"
                  :class="idx % 2 == 1 ? 'grayed-out' : ''">
                  <td>{{ data.clubName }}</td>
                  <td>{{ data.activityName }}</td>
                  <td>{{ data.categoryName }}</td>
                  <td>{{ data.activityDateDisplay }}</td>
                  <td :class="windowSize <= 768 ? '' : 'flex'">
                     <div @click="notesPopUpAction(data, true)"><img :src="noteImg" alt="" /></div>
                     <div @click="editRowAction(data, true)"><img :src="editImg" alt="" /></div>
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
