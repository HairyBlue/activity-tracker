<script setup lang="ts">
import $ from 'jquery';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { userStore } from '../../../store/userStore';

const user = userStore();

const router = useRouter();

const data = ref<any[]>([]);
const school_year_uuid = ref<any>(null);
const yearStart = ref<string>('');
const yearEnd = ref<string>('');

const modalMessage = ref<string>('');

const enableUpdateButton = ref<boolean>(false);

function onCancel() {
  school_year_uuid.value = null;
  yearStart.value = '';
  yearEnd.value = '';

  enableUpdateButton.value = false;
}

function enableModal() {
  const modal1 = document.getElementById('my_modal_1') as any;
  modal1.showModal();
}

function fetchData() {
  setTimeout(() => {
    $.ajax({
      url: `${user.basePath}/api/manage/scool-year`,
      method: 'GET',
      contentType: 'application/json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
      },
    }).then((value) => {
      data.value = value.result;
    });
  }, 500);
}

function postData() {
  $.ajax({
    url: `${user.basePath}/api/manage/scool-year`,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      yearStart: yearStart.value,
      yearEnd: yearEnd.value,
    }),
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done(() => {
      router.go(0);
    })
    .fail((jqXHR: any) => {
      modalMessage.value = jqXHR.responseJSON.error;
      enableModal();
    });
}

function edit(_school_year_uuid: number) {
  for (let d of data.value) {
    if (d.school_year_uuid == _school_year_uuid) {
      school_year_uuid.value = d.school_year_uuid;
      yearStart.value = d.yearStart;
      yearEnd.value = d.yearEnd;

      enableUpdateButton.value = true;
    }
  }
}

function updateData() {
  $.ajax({
    url: `${user.basePath}/api/manage/scool-year`,
    method: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({
      school_year_uuid: school_year_uuid.value,
      yearStart: yearStart.value,
      yearEnd: yearEnd.value,
    }),
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done(() => {
      router.go(0);
    })
    .fail((jqXHR: any) => {
      modalMessage.value = jqXHR.responseJSON.error;
      enableModal();
    });
}

function archiveModal(_school_year_uuid: number | null, cancel: boolean = false) {
  if (cancel) {
    school_year_uuid.value = _school_year_uuid;
    return;
  }

  const modal1 = document.getElementById('archive_modal') as any;
  modal1.showModal();

  school_year_uuid.value = _school_year_uuid;
}

function archiveData() {
  $.ajax({
    url: `${user.basePath}/api/manage/scool-year/${school_year_uuid.value}`,
    method: 'DELETE',
    contentType: 'application/json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  })
    .done(() => {
      router.go(0);
    })
    .fail((jqXHR: any) => {
      modalMessage.value = jqXHR.responseJSON.error;
      enableModal();
    });
}

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="flex">
    <div class="h-screen w-1/2 overflow-auto border border-r-gray-300 p-2">
      <div>
        <h2 class="text-base font-semibold leading-7 text-gray-900">School Year Form</h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">Add details below</p>
        <div class="mt-4 flex flex-col gap-x-6 gap-y-4">
          <div>
            <label for="activity-name" class="block text-base font-medium leading-6 text-gray-900">Year Start</label>
            <div class="mt-2">
              <input type="text" placeholder="year start" class="input input-bordered w-full" v-model="yearStart" />
            </div>
          </div>

          <div>
            <label for="activity-name" class="block text-base font-medium leading-6 text-gray-900">Year End</label>
            <div class="mt-2">
              <input type="text" placeholder="year end" class="input input-bordered w-full" v-model="yearEnd" />
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <button class="btn bg-gray-300" @click="onCancel()">Cancel</button>
            <button v-if="!enableUpdateButton" class="btn btn-primary" @click="postData()">Add Data</button>
            <button v-if="enableUpdateButton" class="btn btn-warning" @click="updateData()">Update</button>
          </div>
        </div>

        <!-- NOTE -->
        <div class="flex flex-col gap-2">
          <div class="mt-8 border-t border-gray-300">
            <div role="alert" class="alert shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-info">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="text-xl font-bold">Note!</h3>
                <div class="text-base">Updating or deleting will not affect other data</div>
              </div>
            </div>
          </div>
        </div>

        <!-- NOTE -->
      </div>
    </div>
    <!-- TABLE -->
    <!-- TABLE -->
    <div class="w-full">
      <div class="h-screen overflow-auto">
        <table class="table">
          <!-- head -->
          <thead>
            <tr class="border-b border-gray-400 text-base font-semibold">
              <th>Range</th>
              <th>Year Start</th>
              <th>Year End</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="d in data" class="border-b border-gray-300 text-base font-semibold">
              <th>{{ d.yearStart + '-' + d.yearEnd }}</th>
              <td>{{ d.yearStart }}</td>
              <td>{{ d.yearEnd }}</td>
              <td>
                <div class="flex gap-4">
                  <button class="btn btn-warning" @click="edit(d.school_year_uuid)">Edit</button>
                  <button class="btn btn-error" @click="archiveModal(d.school_year_uuid)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- <button class="btn" onclick="my_modal_1.showModal()">open modal</button> -->
    <dialog id="my_modal_1" class="modal">
      <div class="modal-box">
        <!-- <h3 class="text-lg font-bold">Hello!</h3> -->
        <p class="py-4 text-xl font-semibold text-red-600">{{ modalMessage }}</p>
        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>

    <dialog id="archive_modal" class="modal">
      <div class="modal-box">
        <!-- <h3 class="text-lg font-bold">Hello!</h3> -->
        <p class="py-4 text-xl font-semibold text-red-600">Are you sure that want to delete this data?</p>
        <div class="modal-action">
          <form method="dialog" class="flex gap-2">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn" @click="archiveModal(null, true)">No</button>
            <button class="btn btn-error" @click="archiveData()">Yes</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>
