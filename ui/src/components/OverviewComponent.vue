<script setup lang="ts">
// deps
import { ref, onMounted, watch } from 'vue';
import $ from 'jquery';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
//comp
import { userStore } from '../store/userStore';
import { userPreference } from "../store/userPref"

import LineChartOverviewCt from './charts/LineChartOverviewCt.vue';
import LineChartOverviewPct from './charts/LineChartOverviewPct.vue';
import DoughnutChart from './charts/Doughnut Chart.vue';
import ButtonSubmit from './globals/buttons/ButtonSubmit.vue';
const user = userStore();
const userPref = userPreference()

const chartType = ref<'bar' | 'line'>(userPref.getValue("overview.chart", 'line'));

const countOrPct = ref<'count' | 'percentage'>(userPref.getValue("overview.countOrPct", 'count'));

const year = ref<any>(userPref.getValue("overview.year", new Date().getFullYear()));

const semester = ref<'1' | '2'>(userPref.getValue("overview.semester", '1'));
  
const years = ref<Array<string>>([]);

const labelsCt = ref<Array<string>>([]);
const datasetsCt = ref<Array<number>>([]);
const labelsPct = ref<Array<string>>([]);
const datasetsPct = ref<Array<number>>([]);

const pieCharData = ref<Array<number>>([]);

const clubHasAct = ref<Array<any>>([]);
const clubNoAct = ref<Array<any>>([]);
const latest20Activity = ref<Array<any>>([]);


const fileName = ref<string>(`Clubs, Organizations And Colleges Activities For Second Semester SY ${year.value}-${Number(year.value) + 1}`)

// Be carefull on this as condition depends on string

function chartLineDataCt(data: any[]) {
  if (data.length > 0) {
    for (let d of data) {
      if (d.clubAcronym !== '') {
        labelsCt.value.push(d.clubAcronym);
      } else {
        labelsCt.value.push(d.clubName);
      }
      datasetsCt.value.push(d.count);
    }
  }
}

function chartLineDataPct(data: any[]) {
  if (data.length > 0) {
    for (let d of data) {
      if (d.clubAcronym !== '') {
        labelsPct.value.push(d.clubAcronym);
      } else {
        labelsPct.value.push(d.clubName);
      }
      datasetsPct.value.push(d.count);
    }
  }
}
function fetchData() {
  $.ajax({
    url: '/api/overview',
    method: 'GET',
    contentType: 'application/json',
    data: { year: year.value, semester: semester.value },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  }).then((data) => {
    // console.log(data);
    years.value = data.result.yearRef;
    pieCharData.value = data.result.clubActivityRef.nums;
    clubHasAct.value = data.result.clubActivityRef.hasActivity;
    clubNoAct.value = data.result.clubActivityRef.noActivity;
    latest20Activity.value = data.result.latest20ActivityRef;
    chartLineDataCt(data.result.countRef);
    chartLineDataPct(data.result.percentageRef);
  });
}

function downloadPdf() {
  html2canvas(document.getElementById('content') as HTMLElement, { scale: 2 }).then((canvas) => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    // // get the page size of A4
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    // const aspectRatio = canvas.width / canvas.height;
    // // const chartHeight = pdfWidth / aspectRatio;
    // const chartWidth = pdfWidth - 10 - 10;
    // const maxHeight = pdfHeight - 20;
    // const chartHeight = Math.min(maxHeight, pdfWidth / aspectRatio);

    // Define margins
    const marginLeft = 10; // Adjust as needed
    const marginRight = 10; // Adjust as needed
    const marginTop = 10; // Adjust as needed
    const marginBottom = 10; // Adjust as needed

    // console.log(canvas.width, canvas.height);
    const availableWidth = pdfWidth - marginLeft - marginRight;
    const availableHeight = pdfHeight - marginTop - marginBottom;

    const aspectRatio = canvas.width / canvas.height;
    const chartWidth = Math.min(availableWidth, availableHeight * aspectRatio);
    const chartHeight = chartWidth / aspectRatio;
    const x = marginLeft + (availableWidth - chartWidth) / 2;
    const y = marginTop + (availableHeight - chartHeight) / 2;

    const img = canvas.toDataURL('image/png');

    pdf.addImage(img, 'PNG', x, y, chartWidth, chartHeight, undefined, 'FAST');
    if (semester.value == '1') {
      pdf.save(`Clubs, Organizations And Colleges Activities For First Semester SY ${year.value}-${Number(year.value) + 1} [${chartType.value} chart].pdf`);
    }
    if (semester.value == '2') {
      pdf.save(`Clubs, Organizations And Colleges Activities For Second Semester SY ${year.value}-${Number(year.value) + 1} [${chartType.value} chart].pdf`);
    }
  });
}

function exportExcel() {
    const link = document.createElement('a');
    link.href =  `/excel-export?year=${year.value}&semester=${semester.value}&filename=${fileName.value}`
    link.setAttribute("_target", "blank")

    link.click();
    document.body.removeChild(link);
}

function clearChartData() {
  labelsCt.value = [];
  labelsPct.value = [];
  datasetsCt.value = [];
  datasetsPct.value = [];
  pieCharData.value = [];
}

watch([chartType, year, semester, countOrPct], ([newType, newYear, newSemester, countOrPctNew], [oldType, oldYear, oldSemester, countOrPctOld]) => {
  if (newType !== oldType) {
    clearChartData();
    fetchData();
    userPref.setValue("overview.chart", newType)
  }
  if (newYear !== oldYear) {
    clearChartData();
    fetchData();
    userPref.setValue("overview.year", newYear)
  }
  if (newSemester !== oldSemester) {
    clearChartData();
    fetchData();
    userPref.setValue("overview.semester", newSemester)
  }
  if (countOrPctNew != countOrPctOld) {
    userPref.setValue("overview.countOrPct", countOrPctNew)
  }
});

onMounted(() => {
  fetchData();
});
// setTimeout(() => {
//   downloadPdf();
// }, 2000);
</script>

<template>
  <div id="overview-container" class="md:p-6">
    <!--  -->
    <!--  -->
    <div class="flex items-center justify-between max-md:flex-col">
      <h1>Overview</h1>
      <div class="mr-4 flex gap-2 max-md:flex-wrap">
        <div>
          <select class="h-[30px] border px-2 py-1" v-model="chartType">
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>
        <div>
          <select class="h-[30px] border px-2 py-1" v-model="countOrPct">
            <option value="count">Total Count</option>
            <option value="percentage">Total Percentage</option>
          </select>
        </div>
        <div>
          <select class="h-[30px] border px-8 py-1" v-model="year">
            <option v-for="year of years" :value="year">{{ year }}</option>
          </select>
        </div>
        <div>
          <select class="h-[30px] border px-8 py-1" v-model="semester">
            <option :value="1">First Semester</option>
            <option :value="2">Second Semester</option>
          </select>
        </div>
        <ButtonSubmit v-if="labelsCt.length > 0 && labelsPct.length > 0" @click="downloadPdf" class="h-[30px] border px-8 py-1">Download PDF</ButtonSubmit>
        <ButtonSubmit v-if="labelsCt.length > 0 && labelsPct.length > 0" @click="exportExcel" class="h-[30px] border px-8 py-1">Download Excel</ButtonSubmit>
      </div>
    </div>
    <!--  -->
    <!--  -->
    <section id="content" class="h-[60vh]">
      <LineChartOverviewCt v-if="labelsCt.length > 0 && countOrPct == 'count'" :label="labelsCt" :dataset="datasetsCt" :type="chartType"
        ><slot
          >Clubs, Organizations And Colleges Activities For
          {{ semester == '1' ? `First Semester SY ${year}-${Number(year) + 1}` : `Second Semester SY ${year}-${Number(year) + 1}` }}</slot
        ></LineChartOverviewCt
      >
      <LineChartOverviewPct v-if="labelsCt.length > 0 && countOrPct == 'percentage'" :label="labelsPct" :dataset="datasetsPct" :type="chartType"
        >Clubs, Organizations And Colleges Activities For
        {{ semester == '1' ? `First Semester SY ${year}-${Number(year) + 1}` : `Second Semester SY ${year}-${Number(year) + 1}` }}</LineChartOverviewPct
      >
    </section>

    <section class="flex w-full gap-2 max-lg:flex-col lg:h-[500px]">
      <section class="card mt-2 p-4 lg:w-1/2">
        <DoughnutChart v-if="pieCharData.length > 0" :dataset="pieCharData" />
      </section>
      <section class="card mt-2 overflow-y-auto p-4 lg:w-1/4">
        <span>Clubs and Organizations have target activity</span>
        <div class="overflow-y-auto">
          <table class="w-full table-auto">
            <thead class="border-b">
              <tr>
                <th class="text-start">name</th>
                <th class="text-start">acronym</th>
              </tr>
            </thead>
            <tbody class="text-[10px]">
              <tr v-for="(row, idx) in clubHasAct" :class="idx % 2 == 1 ? 'grayed-out' : ''">
                <td>{{ row.clubName }}</td>
                <td>{{ row.clubAcronym }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="card mt-2 overflow-y-auto p-4 lg:w-1/4">
        <span>Clubs and Organizations dont have target activity</span>
        <div class="overflow-y-auto">
          <table class="w-full table-auto">
            <thead class="border-b">
              <tr>
                <th class="text-start">name</th>
                <th class="text-start">acronym</th>
              </tr>
            </thead>
            <tbody class="text-[10px]">
              <tr v-for="(row, idx) in clubNoAct" :class="idx % 2 == 1 ? 'grayed-out' : ''">
                <td>{{ row.clubName }}</td>
                <td>{{ row.clubAcronym }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>

    <section class="card mt-4 p-4">
      <span class="text-center text-lg font-medium">Latest 20 Activities</span>
      <table class="w-full table-auto">
        <thead>
          <tr>
            <th>Clubs</th>
            <th>Activity</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody class="max-sm:text-[10px] md:text-[12px]">
          <tr v-for="(row, idx) in latest20Activity" :key="idx" class="text-center" :class="idx % 2 == 1 ? 'grayed-out' : ''">
            <td>{{ row.clubName }}</td>
            <td>{{ row.activityName }}</td>
            <td>{{ row.categoryName }}</td>
            <td>{{ row.activityDisplayDate }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<style scoped>
h1 {
  font-size: var(--font-s-xl);
  font-weight: var(--font-w-xl);
  text-align: start;
}

#club-container {
  min-height: 100%;
}

table {
  background-color: var(--white-color);
}

td,
th {
  padding: 2px;
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
</style>
./chats/LineChartOverviewCt.vue./chats/LineChartOverviewPct.vue
