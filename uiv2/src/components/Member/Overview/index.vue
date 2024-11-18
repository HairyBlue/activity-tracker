<script lang="ts" setup>
import $ from 'jquery';
import { userStore, dataStore } from '../../../store/userStore';
import { userPreference } from '../../../store/userPref';
import { onMounted, ref, watch, nextTick } from 'vue';
// import { useRouter } from 'vue-router';

import Chart from './chart.vue';
import Table from './Table.vue';

// const router = useRouter();
const user = userStore();
const sdata = dataStore();
const userPref = userPreference();

const schoolYears = ref<any>([]);
const activitySchoolYear = ref<string>(userPref.getValue('overview.activitySchoolYear', sdata.currentYearStr));
const activitySemester = ref<'1' | '2'>(userPref.getValue('overview.semester', '1'));
const activityStatus = ref<"APPROVED" | "DISAPPROVED" | "PENDING">(userPref.getValue('overview.activityStatus', 'APPROVED'));
const chartType = ref<'bar' | 'line'>(userPref.getValue('overview.chartType', 'bar'));

const chartLabel = ref<string[]>([]);
const chartData = ref<number[]>([]);

const latest20Activity = ref<any>(null);

const show = ref<boolean>(false);

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

function co(co: any) {
  chartLabel.value = [];
  chartLabel.value = [];
  chartData.value = [];

  for (let o of co) {
    if (o.clubAcronym.length > 0) {
      chartLabel.value.push(o.clubAcronym);
    } else {
      chartLabel.value.push(o.clubName);
    }
    chartData.value.push(o.count);
  }
}

async function changeChart() {
  show.value = false;
  await nextTick();
  show.value = true;
}

function fetchData() {
  show.value = false;
  // console.log(user.getToken(), user.level);
  setTimeout(() => {
    $.ajax({
      url: `${user.basePath}/api/overview/${activitySchoolYear.value}/${activitySemester.value}/${activityStatus.value}`,
      method: 'GET',
      contentType: 'application/json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
      },
    }).then((value) => {
      
      latest20Activity.value = groupActivity(value.data.latest);
      co(value.data.co);

      setTimeout(() => {
        show.value = true;
      }, 500);
    });
  }, 500);
}

function cleanData() {
  chartData.value = [];
  chartLabel.value = [];
}

watch(
  [activitySchoolYear, activitySemester, activityStatus, chartType],
  ([new_activitySchoolYear, new_activitySemester, new_activityStatus, new_chartType], [old_activitySchoolYear, old_activitySemester, old_activityStatus, old_chartType]) => {
    if (new_activitySchoolYear !== old_activitySchoolYear) {
      cleanData();
      fetchData();
      userPref.setValue('overview.activitySchoolYear', new_activitySchoolYear);
    }
    if (new_activitySemester !== old_activitySemester) {
      cleanData();
      fetchData();
      userPref.setValue('overview.semester', new_activitySemester);
    }

    if (new_activityStatus != old_activityStatus) {
      fetchData();
      userPref.setValue('overview.activityStatus', new_activityStatus);
    }

    if (new_chartType != old_chartType) {
      changeChart();
      userPref.setValue('overview.chartType', new_chartType);
    }
  }
);

function exportExcel() {
    const fileName = ref<string>(`Clubs, Organizations And Colleges Activities For ${activitySemester.value == '1'? 'First' : 'Second'} Semester SY ${activitySchoolYear.value} [${activityStatus.value}]`)
    const link = document.createElement('a');
    link.href =  `${user.basePath}/export/excel?year=${activitySchoolYear.value}&semester=${activitySemester.value}&filename=${fileName.value}&activityStatus=${activityStatus.value}`
    link.setAttribute("_target", "blank")

    link.click();
    document.body.removeChild(link);
}

onMounted(() => {
  setTimeout(() => {
    schoolYears.value = sdata.sortedSchoolYear(sdata.initData.initYear);
  }, 300);

  fetchData();
});
</script>

<template>
  <div v-if="show" class="p-4" data-testid="overview-section">
    <section class="card rounded-none bg-base-100 p-2 shadow-xl">
      <!-- SCHOOL YEAR -->
      <div class="flex items-center justify-end gap-4">
        <!-- activityStatus -->
        <div>
          <select class="select select-bordered w-full max-w-xs rounded-none" v-model="activityStatus">
            <option disabled selected value="">Status</option>
            <option value="APPROVED">Approved</option>
            <option value="DISAPPROVED">Disapproved</option>
            <option value="PENDING">Pending</option>
          </select>
        </div>

        <div class="flex items-center">
          <!-- <label for="activity-start" class="block text-sm font-medium leading-6 text-gray-900">School Year</label> -->
          <select id="activity-start" class="select select-bordered rounded-none" v-model="activitySchoolYear">
            <option disabled selected value="">Pick a school year</option>
            <option v-for="schoolYear in schoolYears" :value="schoolYear.schoolYear" :id="schoolYear.school_year_uuid">
              {{ schoolYear.schoolYear }}
            </option>
          </select>
        </div>
        <!-- SCHOOL SEMESTER -->
        <div class="flex items-center">
          <!-- <label for="activity-end" class="block text-sm font-medium leading-6 text-gray-900">Semester</label> -->
          <select name="activity-end" class="select select-bordered rounded-none" v-model="activitySemester">
            <option disabled selected value="">Pick a semester</option>
            <option :value="1">First Semester</option>
            <option :value="2">Second Semester</option>
          </select>
        </div>
        <!-- Chart Type-->
        <div>
          <select class="select select-bordered w-full max-w-xs rounded-none" v-model="chartType">
            <option disabled selected value="">Chart Type</option>
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
          </select>
        </div>

        <button class="btn btn-active" @click="exportExcel()">Export Excel</button>
      </div>
      <div class="mt-4">
        <h2 class="text-center text-xl font-semibold">
          Clubs, Organizations And Colleges Activities For {{ activitySemester == '1' ? `First Semester SY ${activitySchoolYear}` : `Second Semester SY ${activitySchoolYear}` }}
        </h2>
      </div>
      <Chart v-if="chartLabel.length > 0" :label="chartLabel" :dataset="chartData" :type="chartType" />
    </section>

    <section class="card mt-8 rounded-none bg-base-100 shadow-xl">
      <Table  :latest20Activity="latest20Activity" />
    </section>
  </div>
  <div v-else>
    <div class="flex h-screen items-center justify-center space-x-2 bg-white">
      <span class="sr-only">Loading...</span>
      <div class="h-8 w-8 animate-bounce rounded-full bg-gray-600 [animation-delay:-0.3s]"></div>
      <div class="h-8 w-8 animate-bounce rounded-full bg-gray-700 [animation-delay:-0.15s]"></div>
      <div class="h-8 w-8 animate-bounce rounded-full bg-gray-800"></div>
    </div>
  </div>
</template>
