<script setup lang="ts">
import $ from 'jquery';
import { ref, onBeforeMount } from 'vue';
import { dataStore, userStore } from '../../../../store/userStore';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const sdata = dataStore();
const user = userStore();

const categories = ref<Array<any>>([]);
const schoolYears = ref<Array<any>>([]);

const errorMessage = ref<string>('');
const enableError = ref<boolean>(false);
const okStatus = ref<boolean>(false);

const activity_uuid = ref<string>('');
const activityName = ref<string>('');
const activityNotes = ref<string>('');
const category_uuid = ref<string>('');
const activityStartDateIso = ref<string>('');
const activityEndDateIso = ref<string>('');
const activitySemester = ref<string>('');
const activitySchoolYear = ref<string>('');
const activityVenue = ref<string | null>(null);
const activityModality = ref<string>('');
const activityStatusTimeStamp = ref<string>('');
const activityStatus = ref<number>(0);
const activityComments = ref<string>('');

const eachData = ref<any>({});

let setTOut: any = null;

function status(stat: number) {
  activityStatus.value = stat;
}

function checkBefore() {
  const vars = [activityName, activityNotes, category_uuid, activityStartDateIso, activityEndDateIso, activitySemester, activitySchoolYear];

  if (setTOut) {
    clearTimeout(setTOut);
  }
  setTOut = setTimeout(() => {
    enableError.value = false;
    okStatus.value = false;
  }, 10000);

  for (let variables of vars) {
    const val = variables.value;
   
    if (val.length == 0) {
      const modal: any = document.getElementById('my_modal_2');
      modal.showModal();

      errorMessage.value = 'Please complete the form';
      enableError.value = true;
      return false;
    }
  }

  activityComments.value.trim();

  if (activityStatus.value == 0 && activityComments.value.length == 0) {
    const modal: any = document.getElementById('my_modal_2');
    modal.showModal();

    errorMessage.value = 'Please leave a comment if you dont want to approve directly';
    enableError.value = true;
    return false;
  }

  return true;
}

function formSubmit() {
  if (checkBefore()) {
    const data = JSON.stringify({
      activity_uuid: activity_uuid.value,
      activityName: activityName.value,
      activityNotes: activityNotes.value,
      category_uuid: category_uuid.value,
      activityStartDateIso: activityStartDateIso.value,
      activityEndDateIso: activityEndDateIso.value,
      activitySemester: activitySemester.value,
      activitySchoolYear: activitySchoolYear.value,
      activityVenue: activityVenue.value,
      activityModality: activityModality.value,
      activityStatus: activityStatus.value,
      activityComments: activityComments.value,
    });

    $.ajax({
      url:  `${user.basePath}/api/activity`,
      method: 'PUT',
      contentType: 'application/json',
      data: data,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
      },
    })
      .done((data) => {
        if (data.message) {
          okStatus.value = true;
          router.go(0);
        }
      })
      .fail((fail) => {
        if (fail.status == 400) {
          const modal: any = document.getElementById('my_modal_1');
          modal.showModal();
          errorMessage.value = fail.responseJSON.error;
          enableError.value = true;
        }
      });
  }
}

function fetchData() {
  const uuid = route.params.activity_uuid;
  setTimeout(() => {
    $.ajax({
      url: `${user.basePath}/api/activity-each/${uuid}`,
      method: 'GET',
      contentType: 'application/json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
      },
    }).then((value) => {
      const dval = value.data;

      eachData.value = dval;
      activity_uuid.value = dval.activity_uuid;
      activityName.value = dval.activityName;
      activityNotes.value = dval.activityNotes;
      activityStartDateIso.value = dval.activityStartDateIso;
      activityEndDateIso.value = dval.activityEndDateIso;
      activitySchoolYear.value = dval.activitySchoolYear;
      activitySemester.value = dval.activitySemester;
      category_uuid.value = dval.category_uuid;
      activityStatus.value = dval.activityStatus;
      activityComments.value = dval.activityComments == null ? '' : dval.activityComments;
      activityVenue.value = dval.activityVenue == null ? '' : dval.activityVenue;
      activityModality.value = dval.activityModality;
      activityStatusTimeStamp.value = dval.activityStatusTimeStamp;
    });
  }, 500);
}

function removeRecord() {
  const uuid = route.params.activity_uuid;

    $.ajax({
      url: `${user.basePath}/api/activity/${uuid}`,
      method: 'DELETE',
      contentType: 'application/json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
      },
    })
      .done(() => {
        router.push("/dashboard/activity");
      })
      .fail((fail) => {
        if (fail.status == 400) {
          const modal: any = document.getElementById('my_modal_1');
          modal.showModal();
          errorMessage.value = fail.responseJSON.error;
          enableError.value = true;
        }
      });
  
}

onBeforeMount(() => {
  setTimeout(() => {
    categories.value = sdata.initData.initCategory;
    schoolYears.value = sdata.sortedSchoolYear(sdata.initData.initYear);
  }, 300);

  fetchData();
});
</script>

<template>
  <div class="h-screen overflow-y-scroll">
    <div>
      <div class=" p-2">
        <div>
          <div class="flex w-full items-center justify-between text-base font-semibold">
            <div v-if="activityStatus == 1">
              Status: <span class="rounded text-green-600">Approved</span>
              <br />
              
              <span class="italic"> {{ activityStatusTimeStamp }}</span>
            </div>
            <div v-if="activityStatus == 0">
              Status: <span class="rounded text-yellow-400">Pending </span>
              <br />
              <span class="italic">{{ activityStatusTimeStamp }}</span>
            </div>
          </div>

          <div class="mt-4">
            <h2 class="text-2xl font-bold leading-7 text-gray-900">{{ eachData.clubAcronym }}</h2>
            <p class="mt-1 text-lg leading-6 text-gray-600">{{ eachData.clubName }}</p>
          </div>
          <!--  -->
          <div class="mt-4 flex flex-col gap-x-6 gap-y-4">
            <div>
              <label for="activity-name" class="block text-sm font-medium leading-6 text-gray-900">Activity Name</label>
              <div class="mt-2">
                <input type="text" placeholder="Activity Name" class="input input-bordered w-full" v-model="activityName" />
              </div>
            </div>

            <div>
              <label for="notes" class="block text-sm font-medium leading-6 text-gray-900">Activity Notes</label>
              <div class="mt-2">
                <textarea class="textarea textarea-bordered h-64 w-full" placeholder="Notes" v-model="activityNotes"></textarea>
              </div>
            </div>

            <div>
              <div class="flex w-full justify-evenly gap-2">
                <div class="w-full">
                  <label for="activity-start" class="block text-sm font-medium leading-6 text-gray-900">Activity Start At:</label>
                  <input id="activity-start" type="date" placeholder="Activity Name" class="input input-bordered w-full" v-model="activityStartDateIso" />
                </div>
                <div class="w-full">
                  <label for="activity-end" class="block text-sm font-medium leading-6 text-gray-900">Activity End At:</label>
                  <input id="activity-end" type="date" placeholder="Activity Name" class="input input-bordered w-full" v-model="activityEndDateIso" />
                </div>
              </div>
            </div>

            <div>
              <div class="flex w-full justify-evenly gap-2">
                <div class="w-full">
                  <label for="activity-start" class="block text-sm font-medium leading-6 text-gray-900">School Year</label>
                  <select id="activity-start" class="select w-full" v-model="activitySchoolYear">
                    <option disabled selected value="">Pick a school year</option>
                    <option v-for="schoolYear in schoolYears" :value="schoolYear.schoolYear" :id="schoolYear.school_year_uuid">
                      {{ schoolYear.schoolYear }}
                    </option>
                  </select>
                </div>
                <div class="w-full">
                  <label for="activity-end" class="block text-sm font-medium leading-6 text-gray-900">Semester</label>
                  <select name="activity-end" class="select w-full" v-model="activitySemester">
                    <option disabled selected value="">Pick a semester</option>
                    <option :value="1">First Semester</option>
                    <option :value="2">Second Semester</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div class="w-full">
                <label for="activity-category" class="block text-sm font-medium leading-6 text-gray-900">Category</label>
                <select name="activity-category" class="select w-full" v-model="category_uuid">
                  <option disabled selected value="">Pick a category</option>
                  <option v-for="category in categories" :value="category.category_uuid" :id="category.category_uuid">{{ category.categoryName }}</option>
                </select>
              </div>
            </div>

            <!-- VENUE -->
            <div>
              <label for="activity-name" class="block text-sm font-medium leading-6 text-gray-900">Venue (optional)</label>
              <div class="mt-2">
                <input type="text" placeholder="Venue Name" class="input input-bordered w-full" v-model="activityVenue" />
              </div>
            </div>
            <!-- MODE OF ACTIVITY -->
            <div>
              <div class="w-full">
                <label for="activity-category" class="block text-sm font-medium leading-6 text-gray-900">Mode of Activity</label>
                <select name="activity-category" class="select w-full" v-model="activityModality">
                  <option disabled selected value="">Pick a mode of activity</option>
                  <option v-for="mode in ['FACE TO FACE', 'ONLINE', 'HYBRID']" :value="mode">{{ mode }}</option>
                </select>
              </div>
            </div>

            <div>
              <div class="flex justify-between">
                <div>
                  <span class="text-sm font-medium leading-6 text-gray-900"> Approved this activity? </span>
                </div>

                <div class="flex gap-4">
                  <div class="flex items-center">
                    <label for="">Yes</label>
                    <input type="radio" id="radio-yes" name="radio-1" class="radio ml-2" @change="status(1)" />
                  </div>

                  <div class="flex items-center">
                    <label for="">No</label>
                    <input type="radio" id="radio-no" name="radio-1" class="radio ml-2" @change="status(0)" />
                  </div>
                </div>
              </div>

              <div v-if="activityStatus == 0">
                <div class="mt-2">
                  <textarea class="textarea textarea-bordered w-full" placeholder="Leave a comment here" v-model="activityComments"></textarea>
                </div>
              </div>
            </div>
            <!-- APPROVE OR NOT -->
          </div>
          <!--  -->
        </div>
      </div>

      <!--  -->
      <div class="mt-2 flex items-center justify-end gap-x-6">
        <button type="button" class="text-sm font-semibold leading-6 text-gray-900" @click="fetchData()">Cancel</button>
        <button
          @click="formSubmit()"
          class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Update
        </button>
      </div>
      <!-- DELETE BUTTON -->

      <div class="my-8 flex w-full items-center justify-center gap-4">
        <button class="btn btn-error" onclick="my_modal_1.showModal()">Remove this record</button>
        <dialog id="my_modal_1" class="modal">
          <div class="modal-box">
            <h3 class="text-lg font-bold">This will permanently deleted</h3>
            <p class="py-4">Are you sure you want to remove this record?</p>
            <div class="modal-action">
              <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                <button class="btn">Cancel</button>
              </form>

              <button class="btn btn-error" @click="removeRecord()">Yes</button>
            </div>
          </div>
        </dialog>
      </div>
      <!--  -->
      <!-- DIALOG -->
      <dialog id="my_modal_2" class="modal">
        <div class="modal-box">

          <p v-if="enableError" class="py-4 text-xl font-semibold text-red-600">{{ errorMessage }}</p>
          <p v-if="okStatus" class="py-4 text-xl font-semibold text-green-400">Succesfully added activity</p>
          <div class="modal-action">
            <form method="dialog">
            
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <!--  -->
    </div>
  </div>
</template>
