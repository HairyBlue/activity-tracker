<script lang="ts" setup>
import $ from 'jquery';
import { userStore, dataStore } from '../../../store/userStore';
// import { userPreference } from '../../../store/userPref';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

const router = useRouter();
const user = userStore();
const sdata = dataStore();
// const userPref = userPreference();

const props = defineProps(['userRoles', 'userFromEmits']);

const clubs = ref<Array<any>>([]);
const schoolYears = ref<Array<any>>([]);
const userRoles = ref<string[]>(props.userRoles);
const userFromEmits = ref<any>(props.userFromEmits);

const _userId = ref<any>(null);
const _username = ref<string>('');
const _email = ref<string>('');
const _password = ref<string>('');
const _role = ref<string>('');
const _club_id = ref<any>(null);
const _schoolYear = ref<string>(sdata.currentYearStr);

const enableError = ref<boolean>(false);
const message = ref<string>('');

function generatePassword() {
  // Generate random password using crypto
  _password.value = 'CJC-xyxxxxyx'.replace(/[xy]/g, function(c) {
       var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
       return v.toString(16);
   });

  }
function onCancel() {
  _userId.value = null;
  _username.value = '';
  _email.value = '';
  _password.value = '';
  _role.value = '';
  _club_id.value = null;
  _schoolYear.value = '';
}

function populateEmit() {
  _userId.value = userFromEmits.value.userId;
  _username.value = userFromEmits.value.username;
  _email.value = userFromEmits.value.email;
  _role.value = userFromEmits.value.level;

  if (_role.value == 'STUDENT') {
    _club_id.value = userFromEmits.value.club_id;
    _schoolYear.value = userFromEmits.value.schoolYear;
  }
}

function modal() {
  const modal: any = document.getElementById('my_modal_1');
  modal.showModal();
}

function addUser() {
  const data = JSON.stringify({
    username: _username.value,
    email: _email.value,
    password: _password.value,
    role: _role.value,
    club_id: _club_id.value,
    schoolYear: _schoolYear.value,
  });

  $.ajax({
    url: `${user.basePath}/api/user/${_role.value}`,
    method: 'POST',
    contentType: 'application/json',
    data: data,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done(() => {
      onCancel();
      router.go(0);
    })
    .fail((fail) => {
      enableError.value = true;
      message.value = fail.responseJSON.error;
      modal();
    });
}

function upadateUser() {
  const data = JSON.stringify({
    username: _username.value,
    email: _email.value,
    password: _password.value,
    role: _role.value,
    club_id: _club_id.value,
    schoolYear: _schoolYear.value,
  });

  $.ajax({
    url: `${user.basePath}/api/user/${_userId.value}/${_role.value}`,
    method: 'PUT',
    contentType: 'application/json',
    data: data,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done(() => {
      onCancel();
      router.go(0);
    })
    .fail((fail) => {
      enableError.value = true;
      message.value = fail.responseJSON.error;
      modal();
    });
}

function upadateUserPassword() {
  $.ajax({
    url: `${user.basePath}/api/user-password/${_userId.value}/${_password.value}`,
    method: 'PATCH',
    contentType: 'application/json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done(() => {
      onCancel();
      router.go(0);
    })
    .fail((fail) => {
      enableError.value = true;
      message.value = fail.responseJSON.error;
      modal();
    });
}

onMounted(() => {
  setTimeout(() => {
    clubs.value = sdata.initData.initClub;
    schoolYears.value = sdata.sortedSchoolYear(sdata.initData.initYear);
  }, 300);

  populateEmit();
});
</script>

<template>
  <div class="w-1/4 border border-r-gray-300 p-2">
    <div>
      <h2 class="text-base font-semibold leading-7 text-gray-900">Form Submission User</h2>
      <p class="mt-1 text-sm leading-6 text-gray-600">Add user details below</p>
      <!--  -->
      <div class="mt-4">
        <div class="mt-2">
          <label for="activity-name" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
          <div class="mt-2">
            <input type="text" placeholder="Enter username" class="input input-bordered w-full" v-model="_username" />
          </div>
        </div>
        <div class="mt-2">
          <label for="activity-name" class="block text-sm font-medium leading-6 text-gray-900">Email</label>
          <div class="mt-2">
            <input type="email" placeholder="Enter email" class="input input-bordered w-full" v-model="_email" />
          </div>
        </div>
        <!--  -->
        <div v-if="_userId == null" class="mt-2">
          <label for="activity-name" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
          <div class="mt-2 flex">
            <input type="text" placeholder="Enter password" class="input input-bordered w-full" v-model="_password" />
          </div>
        </div>
        <div v-if="_userId == null" class="mt-2">
          <label for="activity-end" class="block text-sm font-medium leading-6 text-gray-900">User Role</label>
          <select name="activity-end" class="select w-full" v-model="_role">
            <option disabled selected value="">Pick a role for user</option>
            <option v-for="role in userRoles" :value="role">{{ role }}</option>
          </select>
        </div>
        <div v-if="_role == 'STUDENT'">
          <div class="mt-2">
            <label for="activity-end" class="block text-sm font-medium leading-6 text-gray-900">Club and Organization</label>
            <select name="activity-end" class="select w-full" v-model="_club_id">
              <option disabled selected value="default">Pick a club or organization for the student</option>
              <option v-for="club in clubs" :value="club.clubId">{{ club.clubName }}</option>
            </select>
          </div>
          <div class="mt-2">
            <label for="activity-end" class="block text-sm font-medium leading-6 text-gray-900">School Year</label>
            <select name="activity-end" class="select w-full" v-model="_schoolYear">
              <option disabled selected value="">Pick a school year</option>
              <option v-for="schoolYear in schoolYears" :value="schoolYear.schoolYear">{{ schoolYear.schoolYear }}</option>
            </select>
          </div>
        </div>
        <!-- BUTTON -->
        <div class="mt-4 flex justify-end gap-2 max-lg:flex-col-reverse">
          <button v-if="_userId == null" class="btn bg-gray-300" @click="generatePassword()">Generate password</button>
          <button v-if="_userId == null" class="btn bg-gray-300" @click="onCancel()">Cancel</button>
          <button v-if="_userId == null" class="btn btn-primary" @click="addUser()">Add User</button>
          <button v-if="_userId != null" class="btn btn-warning" @click="upadateUser()">Update Info</button>
        </div>
      </div>

      <div v-if="_userId != null" class="mt-2">
        <label for="activity-name" class="block text-sm font-medium leading-6 text-gray-900">Change password</label>
        <div class="mt-2">
          <input type="text" placeholder="Enter password" class="input input-bordered w-full" v-model="_password" />
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button class="btn bg-gray-300" @click="generatePassword()">Generate password</button>
          <button class="btn btn-warning" @click="upadateUserPassword()">Change password</button>
        </div>
      </div>

      <div v-if="_userId != null" class="flex justify-center">
        <button class="btn mt-8 w-3/4 bg-gray-300" @click="onCancel()">Cancel</button>
      </div>

      <!--  -->

      <!-- DIALOG -->
      <dialog id="my_modal_1" class="modal">
        <div class="modal-box">
          <!-- <h3 class="text-lg font-bold">Hello!</h3> -->
          <p v-if="enableError" class="py-4 text-xl font-semibold text-red-400">{{ message }}</p>
          <!-- <p v-if="okStatus" class="py-4 text-xl font-semibold text-green-400">Succesfully added activity</p> -->
          <div class="modal-action">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
      <!-- DIALOG -->
    </div>
  </div>
</template>
