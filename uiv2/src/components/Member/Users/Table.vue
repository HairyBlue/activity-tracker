<script lang="ts" setup>
import $ from 'jquery';
import { userStore, dataStore } from '../../../store/userStore';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = userStore();
const sdata = dataStore();
// const userPref = userPreference();

const props = defineProps(['userRoles']);

const clubs = ref<Array<any>>([]);
const schoolYears = ref<Array<any>>([]);

const userRoles = ref<string[]>(props.userRoles);

const students = ref<any[]>([]);
const admins = ref<any[]>([]);
const staffs = ref<any[]>([]);

const userToDelete = ref<any>(null);

const enableError = ref<boolean>(false);
const message = ref<string>('');

function designateMember(members: any) {
  if (members) {
    for (let member of members) {
      if (member.level == 'ADMIN') {
        admins.value.push(member);
      }
      if (member.level == 'STAFF') {
        staffs.value.push(member);
      }
    }
  }
}

function getClubInfo(clubId: number) {
  for (let club of clubs.value) {
    if (club.clubId == clubId) {
      return club;
    }
  }
}

function modal() {
  const modal: any = document.getElementById('my_modal_1');
  modal.showModal();
}

function deleteModal(user: any) {
  const modal: any = document.getElementById('delete_modal');
  modal.showModal();

  userToDelete.value = user;
}

function closeDeleteModal() {
  const modal: any = document.getElementById('delete_modal');
  modal.close();
  
  userToDelete.value = null;
}

function fetchData() {
  $.ajax({
    url: `${user.basePath}/api/user-list`,
    method: 'GET',
    contentType: 'application/json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  }).then((value) => {
    //  console.log(value);
    students.value = value.data.student;
    designateMember(value.data.member);
  });
}


function removeUser() {
  $.ajax({
    url: `${user.basePath}/api/user/${userToDelete.value.userId}/${userToDelete.value.level}`,
    method: 'DELETE',
    contentType: 'application/json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done(() => {
      router.go(0);
    })
    .fail((fail) => {
      enableError.value = true;
      message.value = fail.responseJSON.error;
      modal();
    });
}

function levelAllowed() {
  const userAccess = user.getDecryptedLevel();
  if (userAccess && typeof userAccess === "string") {
    return userAccess
  }

  return "none"
}

onMounted(() => {
  setTimeout(() => {
    clubs.value = sdata.initData.initClub;
    schoolYears.value = sdata.sortedSchoolYear(sdata.initData.initYear);

    fetchData();
  }, 300);
});
</script>

<template>
  <div class="w-3/4 p-2">
    <div v-if="userRoles.length > 0">
      <!-- MEMBER -->
      <div v-if="['WEBMASTER', 'ADMIN'].indexOf(levelAllowed()) != -1" class="card mt-10 w-full rounded-none border border-gray-300 bg-base-100 p-4 shadow-xl">
        <h2 class="text-xl font-semibold">Members</h2>
        <div class="overflow-x-auto">
          <table class="table">
            <!-- head -->
            <thead>
              <tr class="text-base">
                <th>Role</th>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <!-- row 1 -->
              <tr v-for="user in admins" class="hover:bg-slate-200">
                <th>{{ user.level }}</th>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <div v-if="user.login == 1" class="badge badge-success gap-2">Online</div>
                  <div v-if="user.login == 0" class="badge badge-error gap-2">Offline</div>
                </td>
                <td>
                  <div class="flex gap-2">
                    <button class="btn btn-warning p-2" @click="$emit('userEmit', user)">Update</button>
                    <button class="btn btn-error p-2" @click="deleteModal(user)">Delete</button>
                  </div>
                </td>
              </tr>

              <tr v-for="user in staffs" class="hover:bg-slate-200">
                <th>{{ user.level }}</th>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <div v-if="user.login == 1" class="badge badge-success gap-2">Online</div>
                  <div v-if="user.login == 0" class="badge badge-error gap-2">Offline</div>
                </td>
                <td>
                  <div class="flex gap-2">
                    <button class="btn btn-warning p-2" @click="$emit('userEmit', user)">Update</button>
                    <button class="btn btn-error p-2" @click="deleteModal(user)">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- MEMBER -->
      <!-- STUDENT -->
      <div class="card mt-10 w-full rounded-none border border-gray-300 bg-base-100 p-4 shadow-xl">
        <h2 class="text-xl font-semibold">Students</h2>
        <div class="overflow-x-auto">
          <table class="table">
            <!-- head -->
            <thead>
              <tr class="text-base">
                <th>Role</th>
                <th>Username</th>
                <th>Email</th>
                <th>Club Name</th>
                <th>School Year</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <!-- row 1 -->
              <tr v-for="user in students" class="hover:bg-slate-200">
                <th>{{ user.level }}</th>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ getClubInfo(user.club_id).clubName }}</td>
                <td>{{ user.schoolYear }}</td>
                <td>
                  <div v-if="user.login == 1" class="badge badge-success gap-2">Online</div>
                  <div v-if="user.login == 0" class="badge badge-error gap-2">Offline</div>
                </td>
                <td>
                  <div class="flex gap-2">
                    <button class="btn btn-warning p-2" @click="$emit('userEmit', user)">Update</button>
                    <button class="btn btn-error p-2" @click="deleteModal(user)">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CONFIRM DELETE -->

      <dialog id="delete_modal" class="modal">
        <div class="modal-box">
          <!-- <h3 class="text-lg font-bold">Hello!</h3> -->
          <p class="py-4 text-xl font-semibold text-red-600">Are you sure that want to delete this user?</p>
          <p v-if="userToDelete" class="text-base font-medium">
              <span class="text-base font-semibold">Username: </span> {{ userToDelete.username }}
              <br />
              <span class="text-base font-semibold">Email: </span> {{ userToDelete.email }}
              <br />
              <span class="text-base font-semibold">Role: </span> {{ userToDelete.level }}
              <br />
              <span  class="text-base font-semibold">Clubs|Organization: </span> {{  userToDelete.level === 'STUDENT' ? getClubInfo(userToDelete.club_id).clubName : "None" }}
          </p>
          <div class="modal-action">
            <form method="dialog" class="flex gap-2">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn" @click="closeDeleteModal()">No</button>
              <button class="btn btn-error" @click="removeUser()">Yes</button>
            </form>
          </div>
        </div>
      </dialog>

      <!-- CONFIRM DELETE -->

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
