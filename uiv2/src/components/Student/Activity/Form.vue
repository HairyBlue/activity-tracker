<script setup lang="ts">
import $ from 'jquery';
import { ref, onBeforeMount, nextTick } from 'vue';
import { userStore, dataStore } from '../../../store/userStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const sdata = dataStore();
const user = userStore();

const categories = ref<Array<any>>([]);
const clubs = ref<Array<any>>([]);
const schoolYears = ref<Array<any>>([]);

const errorMessage = ref<string>('');
const enableError = ref<boolean>(false);
const okStatus = ref<boolean>(false);

const activityName = ref<string>('');
const activityNotes = ref<string>('');
const category_uuid = ref<string>('');
const selectedClub = ref<string[]>([]);
const activityStartDateIso = ref<string>('');
const activityEndDateIso = ref<string>('');
const activitySemester = ref<string>('');
const activitySchoolYear = ref<string>(sdata.currentYearStr);
const activityVenue = ref<string | null>(null);
const activityModality = ref<string>('');
const activityStatus = ref<number>(0);
const activityComments = ref<string>('');

const renderComponent = ref<boolean>(true);
let setTOut: any = null;

// function status(stat: number) {
//   activityStatus.value = stat;
// }

function handleSelectedClub(club_uuid: string) {
  if (selectedClub.value.indexOf(club_uuid) !== -1) {
    selectedClub.value = selectedClub.value.filter(function (item) {
      return item !== club_uuid;
    });
  } else {
    selectedClub.value.push(club_uuid);
  }
}

// function selectedAllClub() {
//   const selectAll = document.getElementById('select-all-club') as HTMLInputElement;

//   for (let club of clubs.value) {
//     const clubCheckBox = document.getElementById(club.club_uuid) as HTMLInputElement;

//     if (selectAll.checked) {
//       clubCheckBox.checked = true;
//       selectedClub.value.push(club.club_uuid);
//     } else {
//       clubCheckBox.checked = false;
//       selectedClub.value = [];
//     }
//   }
// }

async function cleanAfter() {
  const vars = [
    activityName,
    activityNotes,
    category_uuid,
    activityStartDateIso,
    activityEndDateIso,
    activitySemester,
    activitySchoolYear,
    activityStatus,
    activityComments,
    activityModality,
  ];
  for (let variables of vars) {
    variables.value = '';
  }
  selectedClub.value = [];

  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
}

function checkBefore() {
  enableError.value = false;
  okStatus.value = false;

  const vars = [activityName, activityNotes, category_uuid, activityStartDateIso, activityEndDateIso, activitySemester, activityModality];

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
      const modal: any = document.getElementById('my_modal_1');
      modal.showModal();

      errorMessage.value = 'Please complete the form';
      enableError.value = true;

      return false;
    }
  }

  if (selectedClub.value.length == 0) {
    const modal: any = document.getElementById('my_modal_1');
    modal.showModal();

    errorMessage.value = 'Please select a club';
    enableError.value = true;

    return false;
  }

  // activityComments.value.trim();

  // if (activityStatus.value == 0 && activityComments.value.length == 0) {
  //   const modal: any = document.getElementById('my_modal_1');
  //   modal.showModal();

  //   errorMessage.value = 'Please leave a comment if you dont want to approve directly';
  //   enableError.value = true;
  //   return false;
  // }

  return true;
}

function formSubmit() {
  if (checkBefore()) {
    const data = JSON.stringify({
      activityName: activityName.value,
      activityNotes: activityNotes.value,
      category_uuid: category_uuid.value,
      club_uuids: selectedClub.value,
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
      url: `${user.basePath}/api/activity`,
      method: 'POST',
      contentType: 'application/json',
      data: data,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
      },
    })
      .done((data) => {
        if (data.message) {
          okStatus.value = true;
          cleanAfter();
          router.go(0);
        }
      })
      .fail((fail) => {
        console.log(fail);
        if (fail.status == 400) {
          const modal: any = document.getElementById('my_modal_1');
          modal.showModal();
          errorMessage.value = fail.responseJSON.error;
          enableError.value = true;
        }
      });
  }
}

onBeforeMount(() => {
  setTimeout(() => {
    categories.value = sdata.initData.initCategory;
    clubs.value = sdata.initData.initClub;
    schoolYears.value = sdata.sortedSchoolYear(sdata.initData.initYear);
  }, 300);

  // if(!radioNo.checked) {
  //   radioNo.checked = true;
  // }
});
</script>

<template>
  <div v-if="renderComponent">
    <div>
      <div class="h-screen overflow-auto border border-r-gray-300 p-2">
        <div>
          <h2 class="text-base font-semibold leading-7 text-gray-900">Form Submission Activity</h2>
          <p class="mt-1 text-sm leading-6 text-gray-600">Add activity details below</p>
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

            <div>
              <span class="text-sm font-medium leading-6 text-gray-900"> Club and Origanization </span>
              <div class="w-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-6">
                <!-- <div class="form-control bg-gray-100 font-semibold" @change="selectedAllClub()">
                  <label class="label w-full cursor-pointer">
                    <span class="label-text"> Select All </span>
                    <input type="checkbox" class="checkbox" id="select-all-club" />
                  </label>
                </div> -->
                <div class="form-control" v-for="club in clubs" @change="handleSelectedClub(club.club_uuid)">
                  <label class="label w-full cursor-pointer">
                    <span class="label-text"> {{ club.clubName }} </span>
                    <input type="checkbox" class="checkbox" :id="club.club_uuid" />
                  </label>
                </div>
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

            <!-- APPROVE OR NOT -->
            <!-- <div>
              <div class="flex justify-between">
                <div>
                  <span class="text-sm font-semibold leading-6 text-gray-900"> Approved this activity?(default No) </span>
                </div>

                <div class="flex gap-4">
                  <div class="flex items-center">
                    <label for="">Yes</label>
                    <input id="radio-yes" type="radio" name="radio-1" class="radio ml-2" :value="1" @change="status(1)" />
                  </div>

                  <div class="flex items-center">
                    <label for="">No</label>
                    <input id="radio-no" type="radio" name="radio-1" class="radio ml-2" :value="0" @change="status(0)" checked />
                  </div>
                </div>
              </div>

              <div v-if="activityStatus == 0">
                <div class="mt-2">
                  <textarea class="textarea textarea-bordered w-full" placeholder="Leave a comment here" v-model="activityComments"></textarea>
                </div>
              </div>
            </div> -->
            <!-- APPROVE OR NOT -->
          </div>
          <!-- SAVE -->
          <div class="mt-2 flex items-center justify-end gap-x-6">
            <button type="button" class="text-sm font-semibold leading-6 text-gray-900" @click="cleanAfter()">Cancel</button>
            <button
              @click="formSubmit()"
              class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Save
            </button>
          </div>
          <!--  -->
        </div>
      </div>
      <!-- DIALOG -->
      <dialog id="my_modal_1" class="modal">
        <div class="modal-box">
          <!-- <h3 class="text-lg font-bold">Hello!</h3> -->
          <p v-if="enableError" class="py-4 text-xl font-semibold text-red-400">{{ errorMessage }}</p>
          <p v-if="okStatus" class="py-4 text-xl font-semibold text-green-400">Succesfully added activity</p>
          <div class="modal-action">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <!--  -->
    </div>
  </div>
</template>
