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

const activity_same_record_uuid = ref<any>(route.params.activity_uuid);
const activityName = ref<string>('');
const activityNotes = ref<string>('');
const selectedCategory = ref<string[]>([]);
const activityStartDateIso = ref<string>('');
const activityEndDateIso = ref<string>('');
const activitySemester = ref<string>('');
const activitySchoolYear = ref<string>('');
const activityVenue = ref<string | null>(null);
const activityModality = ref<string>('');
const activityStatusTimeStamp = ref<string>('');
const activityStatus = ref<string>("");
const activityComments = ref<string>('');

const activityPersonelAdded = ref<string>('');
const activityPersonels = ref<string[]>([]);
const activityNumberParticipants = ref<number>(0);

const showCategory = ref<boolean>(true);


const shalowData = ref<any>({})
const eachData = ref<any>({});

let setTOut: any = null;


function onAddActivityPersonels() {
  const pname = activityPersonelAdded.value.trim();
  if (pname.length == 0) return;

  activityPersonels.value.push(pname);
  activityPersonelAdded.value = "";
}

function onRemoveActivityPersonels(pname: string) {
  pname = pname.trim();
  if (pname.length == 0) return;

  activityPersonels.value = activityPersonels.value.filter(name => pname != name);
}

function onShowCategory() {
  showCategory.value = !showCategory.value;
}


function categoryValue(d1: any, d2: any) {
  if (d2) {
    for (let d of d2) {
      if (d.uuid === d1) {
        // selectedCategory.value.push(d.uuid);
        return true;
      } 
    }
  }

  return false
}


function getSelectedCategory() {
  selectedCategory.value = [];

  for (let category of categories.value) {
    const categoryCheckBox = document.getElementById(category.category_uuid) as HTMLInputElement;

    if (categoryCheckBox.checked) {
      selectedCategory.value.push(category.category_uuid);
    }
  }
}


function selectedAllCategory() {
  const selectAll = document.getElementById('select-all-category') as HTMLInputElement;

  for (let category of categories.value) {
    const categoryCheckBox = document.getElementById(category.category_uuid) as HTMLInputElement;

    if (selectAll.checked) {
      categoryCheckBox.checked = true;
      selectedCategory.value.push(category.category_uuid);
    } else {
      categoryCheckBox.checked = false;
      selectedCategory.value = [];
    }
  }
}


function status(stat: "APPROVED" | "DISAPPROVED" | "PENDING") {
  activityStatus.value = stat;
}

function checkBefore() {
  const vars = [activityName, activityNotes, activityStartDateIso, activityEndDateIso, activitySemester, activitySchoolYear];

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

  if (activityStatus.value == "DISAPPROVED" && activityComments.value.length == 0) {
    const modal: any = document.getElementById('my_modal_2');
    modal.showModal();

    errorMessage.value = 'Please leave a comment if you want disapproved this record'
    enableError.value = true;
    return false;
  }

    if (selectedCategory.value.length == 0) {
      const modal: any = document.getElementById('my_modal_2');
      modal.showModal();

      errorMessage.value = 'Please select a Developmental Category';
      enableError.value = true;

      return false;
    }

  return true;
}

function formSubmit() {
  getSelectedCategory();

  if (checkBefore()) {
    const data = JSON.stringify({
      activity_same_record_uuid: activity_same_record_uuid.value,
      activityName: activityName.value,
      activityNotes: activityNotes.value,
      category_uuids:  selectedCategory.value,
      club_uuid: eachData.value.club_uuid,
      activityStartDateIso: activityStartDateIso.value,
      activityEndDateIso: activityEndDateIso.value,
      activitySemester: activitySemester.value,
      activitySchoolYear: activitySchoolYear.value,
      activityVenue: activityVenue.value,
      activityPersonels: activityPersonels.value,
      activityNumberParticipants: activityNumberParticipants.value,
      activityModality: activityModality.value,
      activityStatus: "PENDING",
      activityComments: activityComments.value,
    });

    $.ajax({
      url:  `${user.basePath}/api/activity-repost`,
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



function groupActivity(data: any) {

const shalowCopy = Object.assign({}, data);
 for (let key in shalowCopy) {
   shalowCopy[key]["categories"] = [];
   for (let activity of shalowCopy[key]["activities"] ) {
       shalowCopy[key]["categories"].push({
         'uuid': activity.category_uuid,
         'name': activity["categoryName"]
       })
   }
 }

 return shalowCopy;
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
      const data: any = Object.values(groupActivity(value.data));
      shalowData.value = data[0];
      eachData.value = data[0]["activities"][0];

      activity_same_record_uuid.value = data[0]["activities"][0].activity_same_record_uuid;
      activityName.value = data[0]["activities"][0].activityName;
      activityNotes.value = data[0]["activities"][0].activityNotes;
      activityStartDateIso.value = data[0]["activities"][0].activityStartDateIso;
      activityEndDateIso.value = data[0]["activities"][0].activityEndDateIso;
      activitySchoolYear.value = data[0]["activities"][0].activitySchoolYear;
      activitySemester.value = data[0]["activities"][0].activitySemester;
      activityStatus.value = data[0]["activities"][0].activityStatus;
      activityComments.value = data[0]["activities"][0].activityComments == null ? '' : data[0]["activities"][0].activityComments;
      activityVenue.value = data[0]["activities"][0].activityVenue == null ? '' : data[0]["activities"][0].activityVenue;
      activityModality.value = data[0]["activities"][0].activityModality;
      activityStatusTimeStamp.value = data[0]["activities"][0].activityStatusTimeStamp;
      
      activityPersonels.value =  JSON.parse(data[0]["activities"][0].activityPersonel),
      activityNumberParticipants.value = data[0]["activities"][0].activityNumberParticipants
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


function levelAllowed(level: string): boolean {
  const userAccess = user.getDecryptedLevel();
  if (userAccess && typeof userAccess === "string") {
    const match = userAccess.match(level);
    if (match) {
      return true
    }
  }

  return false
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
  <div class="h-full">
    <div>
      <div class="p-2">
        <div>
          <div class="flex w-full items-center justify-between text-4xl font-semibold">
            <div v-if="activityStatus == 'APPROVED'">
              Status: <span class="rounded text-green-600">Approved</span>
              <br />
              
              <span class="italic text-xl"> {{ activityStatusTimeStamp }}</span>
            </div>
            <div v-else-if="activityStatus == 'DISAPPROVED'">
              Status: <span class="rounded text-red-600">Disapproved</span>
              <br />
              <span class="italic text-xl">{{ activityStatusTimeStamp }}</span>
            </div>
            <div v-else-if="activityStatus == 'PENDING'">
              Status: <span class="rounded text-yellow-400">Pending</span>
              <br />
              <span class="italic text-xl">{{ activityStatusTimeStamp }}</span>
            </div>
          </div>

          <hr class="border-2">

          <div class="my-4">
            <h2 class="text-2xl font-bold leading-7 text-gray-900">{{ eachData.clubAcronym }}</h2>
            <p class="mt-1 text-lg leading-6 text-gray-600">{{ eachData.clubName }}</p>
          </div>

          <hr class="border-2">
          <!--  -->
          <div class="mt-4 flex flex-col gap-x-6 gap-y-4">
            <div>
              <label for="activity-name" class="block text-lg font-semibold leading-6 text-gray-900">Activity Name</label>
              <div class="mt-2">
                <input type="text" placeholder="Activity Name" class="input input-bordered w-full" v-model="activityName" />
              </div>
            </div>

            <div>
              <label for="notes" class="block text-lg font-semibold leading-6 text-gray-900">Activity Notes</label>
              <span class="text-gray-600 italic">(If you have link to provide, please attached also)</span>
              <div class="mt-2">
                <textarea class="textarea textarea-bordered h-64 w-full" placeholder="Notes" v-model="activityNotes"></textarea>
              </div>
            </div>

            <hr class="border-2">
            <div>
              <div class="flex w-full justify-evenly gap-2">
                <div class="w-full">
                  <label for="activity-start" class="block text-lg font-semibold leading-6 text-gray-900">Activity Start At:</label>
                  <input id="activity-start" type="datetime-local" placeholder="Activity Name" class="input input-bordered w-full" v-model="activityStartDateIso" />
                </div>
                <div class="w-full">
                  <label for="activity-end" class="block text-lg font-semibold leading-6 text-gray-900">Activity End At:</label>
                  <input id="activity-end" type="datetime-local" placeholder="Activity Name" class="input input-bordered w-full" v-model="activityEndDateIso" />
                </div>
              </div>
            </div>


            <div>
              <div class="flex w-full justify-evenly gap-2">
                <div class="w-full">
                  <label for="activity-start" class="block text-lg font-semibold leading-6 text-gray-900">School Year</label>
                  <select id="activity-start" class="select w-full" v-model="activitySchoolYear">
                    <option disabled selected value="">Pick a school year</option>
                    <option v-for="schoolYear in schoolYears" :value="schoolYear.schoolYear" :id="schoolYear.school_year_uuid">
                      {{ schoolYear.schoolYear }}
                    </option>
                  </select>
                </div>
                <div class="w-full">
                  <label for="activity-end" class="block text-lg font-semibold leading-6 text-gray-900">Semester</label>
                  <select name="activity-end" class="select w-full" v-model="activitySemester">
                    <option disabled selected value="">Pick a semester</option>
                    <option :value="1">First Semester</option>
                    <option :value="2">Second Semester</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- <div>
              <div class="w-full">
                <label for="activity-category" class="block text-sm font-medium leading-6 text-gray-900">Category</label>
                <select name="activity-category" class="select w-full" v-model="category_uuid">
                  <option disabled selected value="">Pick a category</option>
                  <option v-for="category in categories" :value="category.category_uuid" :id="category.category_uuid">{{ category.categoryName }}</option>
                </select>
              </div>
            </div> -->
            <hr class="border-2">

          <div>
            <span class="text-lg font-semibold leading-6 text-gray-900"> Developmental Category </span>
            <button type="button"  class="btn btn-active my-4" @click="onShowCategory">  
            {{ showCategory ? "Hide" : "Show "  }}
            </button>
            <div class="h-80 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-6" v-if="showCategory">
              <div class="form-control bg-gray-100 font-semibold" @change="selectedAllCategory()">
                <label class="label w-full cursor-pointer">
                  <span class="label-text"> Select All </span>
                  <input type="checkbox" class="checkbox" id="select-all-category" />
                </label>
              </div>
              <!-- {{ shalowData["categories"] }} -->



              <div class="form-control" v-for="category in categories">
                <label class="label w-full cursor-pointer">
                  <span class="label-text"> {{ category.categoryName }} </span>
                  <!-- {{ Object.values(shalowData['categories'].uuid)}} -->
                  <input type="checkbox" class="checkbox" :id="category.category_uuid" :value="categoryValue(category.category_uuid, shalowData['categories']) ? category.category_uuid : ''"  :checked="categoryValue(category.category_uuid, shalowData['categories'])" />
                </label>
              </div>
              
              

            </div>
          </div>

          

          <hr class="border-2">

          <!-- MODE OF ACTIVITY -->
          <div>
            <div class="w-full">
              <label for="activity-category" class="block text-lg font-semibold leading-6 text-gray-900">Mode of Activity</label>
              <select name="activity-category" class="select w-full" v-model="activityModality">
                <option disabled selected value="">Select a Mode of Activity</option>
                <option v-for="mode in ['On-Campus', 'Off-Campus', 'Online']" :value="mode">{{ mode }}</option>
              </select>
            </div>
          </div>

           
            <!-- VENUE -->
          <div>
            <label for="activity-name" class="block text-lg font-semibold leading-6 text-gray-900">Location / Venue (optional)</label>
            <div class="mt-2">
              <input type="text" placeholder="Enter Location Name" class="input input-bordered w-full" v-model="activityVenue" />
            </div>
          </div>


            <!-- Personel -->
          <div>
            <label for="activity-name" class="block text-lg font-semibold leading-6 text-gray-900">Attending Professors / Moderators / Coaches</label>
            <!-- <span class="block text-lg font-medium leading-6 text-gray-900 italic">Separate it with commas [ , ] if multiple be added. (Example: Name One, Name Two)</span> -->
            <div class="mt-2">
              <div id="personel-list" class="flex gap-1 items-center">
                <span v-if="activityPersonels.length <= 0" class="text-lg font-medium">
                  -- There is no Attending Professors / Moderators / Coaches --
                </span> 
                <div v-else-if="activityPersonels.length > 0" v-for="activityPersonel of activityPersonels" class="flex gap-3 items-center text-lg font-medium px-2 py-1 border border-solid border-gray-400 rounded-md"> 
                    {{ activityPersonel }}
                  <button @click="onRemoveActivityPersonels(activityPersonel)">
                    <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 12V17" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                  </button>
                </div>
              </div>
              <input type="text" placeholder="Enter Personel/s Name" class="input input-bordered w-full mt-2" v-model="activityPersonelAdded"/>
              <div class="flex justify-start mt-2">
                <button class="px-2 py-1 border-2 border-solid border-gray-400 rounded-md text-lg font-semibold text-green-600" @click="onAddActivityPersonels">
                  <!-- <svg width="24px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 1H6V6L1 6V10H6V15H10V10H15V6L10 6V1Z" fill="#9c9c9c"></path> </g></svg> -->
                  Add
                </button>
                <!-- <button class="ml-4 px-2 py-1 border-2 border-solid border-gray-400 rounded-md">
                  <svg width="24px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1 10L1 6L15 6V10L1 10Z" fill="#9c9c9c"></path> </g></svg>
                </button> -->
              </div>
            
            </div>
          </div>

            <!-- No. of Participans -->
          <div>
            <label for="activity-name" class="block text-lg font-semibold leading-6 text-gray-900">No. of Participants</label>
            <div class="mt-2">
              <input type="number" placeholder="Enter No. of Participants" class="input input-bordered w-full" v-model="activityNumberParticipants" />
            </div>
          </div>

            
          <div class="mt-10" v-if="levelAllowed('WEBMASTER|ADMIN|STAFF')">
            <hr class="border-2">
            <br>
            <div>
              <div>
                <span class="text-2xl font-semibold leading-6 text-gray-900">Status</span>
                <span class="text-lg font-medium leading-6 text-gray-900 italic"> (By default: Pending)</span>
              </div>

              <div class="flex gap-4 items-center mt-2">
                <div class="flex items-center">
                  <input id="radio-yes" type="radio" name="radio-1" class="radio" :value="1" @change="status('APPROVED')" :checked="activityStatus == 'APPROVED'"/>
                  <label for="" class="text-green-800 font-semibold ml-2">Approved</label>
                </div>
                |
                <div class="flex items-center">
                  <input id="radio-no" type="radio" name="radio-1" class="radio " :value="0" @change="status('DISAPPROVED')" :checked="activityStatus == 'DISAPPROVED'"/>
                  <label for="" class="text-red-600 font-semibold ml-2">Disapproved</label>
                </div>
                |
                <div class="flex items-center">
                  <input id="radio-no" type="radio" name="radio-1" class="radio" :value="0" @change="status('PENDING')" :checked="activityStatus == 'PENDING'" />
                  <label for="" class="text-yellow-500 font-semibold ml-2">Pending</label>
                </div>
              </div>
            </div>

            <div v-if="activityStatus == 'DISAPPROVED'">
              <div class="mt-2">
                <textarea class="textarea textarea-bordered w-full h-52" placeholder="Leave a comment here" v-model="activityComments"></textarea>
              </div>
            </div>
          </div>

          </div>
        </div>
      </div>

      <!--  -->
      <div class="mt-10 flex items-center justify-start gap-2">
        <span class="text-2xl font-semibold leading-6 text-gray-900">Actions: </span>
            <button type="button" class="text-lg font-semibold leading-6 text-gray-900 btn drop-shadow-lg" @click="fetchData()">Cancel</button>
            <button
              @click="formSubmit()"
              class=" text-lg font-semibold text-white btn btn-primary drop-shadow-lg">
              Update
            </button>

            
          <div class="flex w-full items-center gap-4" v-if="levelAllowed('WEBMASTER|ADMIN|STAFF')">
            <button class="btn btn-error text-lg font-semibold leading-6" onclick="my_modal_1.showModal()">Delete</button>
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

          </div>

          <br>
          <br>
          <hr>
          <br>
          <hr>
      <!-- DELETE BUTTON -->


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
