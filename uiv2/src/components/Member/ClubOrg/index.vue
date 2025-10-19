<script lang="ts" setup>
import $ from 'jquery';
import { userStore, dataStore } from '../../../store/userStore';
import { userPreference } from '../../../store/userPref';
import { onMounted, ref, watch, nextTick } from 'vue';
import Barchart from './CategoryChart.vue';
import Linechart from './MonthChart.vue';

// const router = useRouter();
const user = userStore();
const sdata = dataStore();
const userPref = userPreference();

const schoolYears = ref<any>([]);
const activitySchoolYear = ref<string>(userPref.getValue('clubOrg.activitySchoolYear', sdata.currentYearStr));
const activityStatus = ref<"APPROVED" | "DISAPPROVED" | "PENDING">(userPref.getValue('clubOrg.activityStatus', 'APPROVED'));
const activitySemester = ref<'1' | '2'>(userPref.getValue('clubOrg.semester', '1'));

const data = ref<any[]>([]);
const selected = ref<number>(0);
const perCategoryData = ref<any>({});
const perMonthsData = ref<any>({});

const show = ref<boolean>(false);
const renderComponent = ref<boolean>(true);

function fetchData() {
  show.value = false;

  setTimeout(() => {
    $.ajax({
      url: `${user.basePath}/api/club-org/${activitySchoolYear.value}/${activitySemester.value}/${activityStatus.value}`,
      method: 'GET',
      contentType: 'application/json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
      },
    }).then((value) => {
      data.value = value.data;

      show.value = true;
      onSelect(selected.value);
    });
  }, 500);
}

async function onSelect(idx: number) {
  selected.value = idx;
  const selectedData = data.value[idx];

  perCategoryData.value = selectedData.category;
  perMonthsData.value = selectedData.months;

  renderComponent.value = false;
  await nextTick();
  renderComponent.value = true;
}

// function cleanData() {
//   chartData.value = [];
//   chartLabel.value = [];
// }

watch([activitySchoolYear, activitySemester, activityStatus], ([new_activitySchoolYear, new_activitySemester, new_activityStatus], [old_activitySchoolYear, old_activitySemester, old_activityStatus]) => {
  if (new_activitySchoolYear !== old_activitySchoolYear) {
    fetchData();
    userPref.setValue('clubOrg.activitySchoolYear', new_activitySchoolYear);
  }

  if (new_activitySemester !== old_activitySemester) {
    fetchData();
    userPref.setValue('clubOrg.semester', new_activitySemester);
  }

  if (new_activityStatus != old_activityStatus) {
    fetchData();
    userPref.setValue('clubOrg.activityStatus', new_activityStatus);
  }

});


onMounted(() => {
  setTimeout(() => {
    schoolYears.value = sdata.sortedSchoolYear(sdata.initData.initYear);
  }, 300);

  fetchData();
});
</script>

<template>
  <div class="h-screen w-full p-1" data-testid='club-organizatons-section'>
    <section>
      <div class="flex justify-between gap-2">
        <!-- SchoolYear -->
        <h2 class="p-1 text-lg font-semibold">Club and Organization</h2>

        <div class="flex gap-2">
          <div>
            <select class="select select-primary w-full max-w-xs rounded-none" v-model="activityStatus">
              <option disabled selected value="">Status</option>
              <option value="APPROVED">Approved</option>
              <option value="DISAPPROVED">Disapproved</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          <div>
            <select class="select select-primary w-full max-w-xs rounded-none" v-model="activitySchoolYear">
              <option disabled selected value="">School Year</option>
              <option v-for="schoolYear in schoolYears" :value="schoolYear.schoolYear" :id="schoolYear.school_year_uuid">
                {{ schoolYear.schoolYear }}
              </option>
            </select>
          </div>
          <!-- School Semester-->
          <div>
            <select class="select select-primary w-full max-w-xs rounded-none" v-model="activitySemester">
              <option disabled selected value="">Semester</option>
              <option :value="1">First Semester</option>
              <option :value="2">Second Semester</option>
            </select>
          </div>
          
        </div>
      </div>
    </section>

    <div class="flex">
      <section id="club-list" class="">
        <ul class="h-screen overflow-auto">
          <li
            v-for="(list, idx) in data"
            @click="onSelect(idx)"
            class="p-2 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] hover:bg-gray-300"
            :class="selected == idx ? 'bg-gray-300' : ''">
            {{ idx + 1 }}. {{ list.clubName }}
          </li>
        </ul>
      </section>
      <section v-if="renderComponent" class="w-[80%] p-4">
        <div v-if="show" class="card mt-8 rounded-none bg-base-100 shadow-xl">
          <Barchart :category="perCategoryData" />
        </div>
        <div v-if="show" class="card mt-8 rounded-none bg-base-100 shadow-xl">
          <Linechart :months="perMonthsData" :selected="selected" />
        </div>
      </section>
    </div>
  </div>
</template>
