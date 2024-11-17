<script setup lang="ts">
import $ from 'jquery';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { userStore } from '../../../store/userStore';

const user = userStore();

const router = useRouter();

const data = ref<any[]>([]);
const dataArchive = ref<any[]>([]);
const categoryId = ref<any>(null);
const categoryName = ref<string>('');

const modalMessage = ref<string>('');
const enableUpdateButton = ref<boolean>(false);

function onCancel() {
  categoryId.value = null;
  categoryName.value = '';

  enableUpdateButton.value = false;
}

function enableModal() {
  const modal1 = document.getElementById('my_modal_1') as any;
  modal1.showModal();
}

function fetchData() {
  setTimeout(() => {
    $.ajax({
      url: `${user.basePath}/api/manage/category`,
      method: 'GET',
      contentType: 'application/json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
      },
    }).then((value) => {
      data.value = value.result;
    });
  }, 500);

  setTimeout(() => {
    $.ajax({
      url: `${user.basePath}/api/manage/category-archive`,
      method: 'GET',
      contentType: 'application/json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
      },
    }).then((value) => {
      dataArchive.value = value.result;
    });
  }, 500);

}

function postData() {
  $.ajax({
    url: `${user.basePath}/api/manage/category`,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      categoryName: categoryName.value,
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

function edit(category_id: number) {
  for (let d of data.value) {
    if (d.categoryId == category_id) {
      categoryId.value = d.categoryId;
      categoryName.value = d.categoryName;
      enableUpdateButton.value = true;
    }
  }
}

function updateData() {
  $.ajax({
    url: `${user.basePath}/api/manage/category`,
    method: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify({
      categoryId: categoryId.value,
      categoryName: categoryName.value,
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

function archiveModal(category_id: number | null, cancel: boolean = false) {
  if (cancel) {
    categoryId.value = category_id;
    return;
  }

  const modal1 = document.getElementById('archive_modal') as any;
  modal1.showModal();

  categoryId.value = category_id;
}

function restoreModal(category_id: number | null, cancel: boolean = false) {
  if (cancel) {
    categoryId.value = category_id;
    return;
  }

  const modal1 = document.getElementById('restore_modal') as any;
  modal1.showModal();

  categoryId.value = category_id;
}

function archiveData() {
  $.ajax({
    url: `${user.basePath}/api/manage/category/${categoryId.value}`,
    method: 'PATCH',
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

function restoreData() {
  $.ajax({
    url: `${user.basePath}/api/manage/category-restore/${categoryId.value}`,
    method: 'PATCH',
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
        <h2 class="text-base font-semibold leading-7 text-gray-900">Category Form</h2>
        <p class="mt-1 text-sm leading-6 text-gray-600">Add details below</p>
        <div class="mt-4 flex flex-col gap-x-6 gap-y-4">
          <div>
            <label for="activity-name" class="block text-base font-medium leading-6 text-gray-900">Category Name</label>
            <div class="mt-2">
              <input type="text" placeholder="Name" class="input input-bordered w-full" v-model="categoryName" />
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
                <div class="text-base">Before you make an update or archive a data. Please Read below.</div>
              </div>
            </div>
          </div>
          <div class="card w-full bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title underline">Updating data</h2>
              <p>When updating, all associates to this data will be affected or updated.</p>
            </div>
          </div>
          <div class="card w-full bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title underline">Archiving data</h2>
              <p>When Archiving all associates to this data will be archive also. This can be recover on archive section.</p>
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
              <th>No.</th>
              <th>Category Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="(d, idx) in data" class="border-b border-gray-300 text-base font-semibold">
              <th>{{ idx + 1 }}.</th>
              <td>{{ d.categoryName }}</td>

              <td>
                <div class="flex gap-4">
                  <button class="btn btn-warning" @click="edit(d.categoryId)">Edit</button>
                  <button class="btn btn-error" @click="archiveModal(d.categoryId)">Archive</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <br>
        <br>
        <hr class="border-2">
          <h2 class="text-4xl font-semibold text-center"> Archives </h2>
        <hr class="border-2">

        <table class="table">
          <!-- head -->
          <thead>
            <tr class="border-b border-gray-400 text-base font-semibold">
              <th>No.</th>
              <th>Category Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="(d, idx) in dataArchive" class="border-b border-gray-300 text-base font-semibold">
              <th>{{ idx + 1 }}.</th>
              <td>{{ d.categoryName }}</td>

              <td>
                <div class="flex gap-4">
                  <button class="btn btn-error" @click="restoreModal(d.categoryId)">Restore</button>
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
        <p class="py-4 text-xl font-semibold text-red-600">Are you sure that want to archive this data?</p>
        <div class="modal-action">
          <form method="dialog" class="flex gap-2">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn" @click="archiveModal(null, true)">No</button>
            <button class="btn btn-error" @click="archiveData()">Yes</button>
          </form>
        </div>
      </div>
    </dialog>


    <dialog id="restore_modal" class="modal">
      <div class="modal-box">
        <!-- <h3 class="text-lg font-bold">Hello!</h3> -->
        <p class="py-4 text-xl font-semibold text-red-600">Are you sure that want to <span class="font-semibold">restore</span> this archive data?</p>
        <div class="modal-action">
          <form method="dialog" class="flex gap-2">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn" @click="restoreModal(null, true)">No</button>
            <button class="btn btn-error" @click="restoreData()">Yes</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>
