<script setup lang="ts">
// deps
import { ref, onMounted, watch } from 'vue';
import router from '../router';
import $ from 'jquery';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
//comp
import { userStore } from '../store/userStore';
import BarChart from './charts/BarChart.vue';
import LineChart from './charts/LineChart.vue';
import ButtonSubmit from './globals/buttons/ButtonSubmit.vue';
const user = userStore();

const year = ref<any>(new Date().getFullYear());
const clubKey = ref<string>('');
const clubs = ref<Array<any>>([]);

const categoryLabels = ref<Array<string>>([]);
const categoryDatasets = ref<Array<number>>([]);
// const monthsLabels = ref<Array<Object>>([]);
// const monthsDatasets = ref<Array<Object>>([]);
const monthsData = ref<Array<any>>([]);
const years = ref<Array<string>>([]);

const isClick = ref<number>(0);

const semester = ref<'1' | '2'>('1');
function chartCategoryRef(categories: any[]) {
  for (let c of categories) {
    if (clubKey.value == `${c.clubName}-${c.clubAcronym}`) {
      for (let cd of c.category) {
        categoryLabels.value.push(cd.categoryName);
        categoryDatasets.value.push(cd.count);
      }
    }
  }
}

function chartMonthRef(months: any[]) {
  for (let m of months) {
    if (clubKey.value == `${m.clubName}-${m.clubAcronym}`) {
      // monthsLabels.value = Object.keys(m.category);
      // monthsDatasets.value = Object.values(m.category);
      monthsData.value.push(m.category);
    }
  }
}

function fetchData() {
  $.ajax({
    url: '/api/clubs-organizatons',
    method: 'GET',
    contentType: 'application/json',
    data: { year: year.value, semester: semester.value },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
    },
  }).then((data) => {
    // console.log(data);
    clubs.value = data.result.clubsRef;
    years.value = data.result.yearRef;
    chartCategoryRef(data.result.categoryRef);
    chartMonthRef(data.result.monthsRef);
  });
}

function resetData() {
  categoryLabels.value = [];
  categoryDatasets.value = [];
  monthsData.value = [];
}

function handleClub(clubfx: string, idx: number) {
  resetData();
  isClick.value = idx;
  clubKey.value = clubfx;
  fetchData();
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
      pdf.save(`${clubKey.value} First Semester Activities For SY ${year.value}-${Number(year.value) + 1}.pdf`);
    }
    if (semester.value == '2') {
      pdf.save(`${clubKey.value} Second Semester Activities For SY ${year.value}-${Number(year.value) + 1}.pdf`);
    }
  });
}

watch([year, semester], ([yearNew, newSemester], [yearOld, oldSemester]) => {
  if (yearNew !== yearOld) {
    resetData();
    fetchData();
  }
  if (newSemester !== oldSemester) {
    resetData();
    fetchData();
  }
});

onMounted(() => {
  fetchData();
});

setTimeout(() => {
  clubKey.value = `${clubs.value[0].clubName}-${clubs.value[0].clubAcronym}`;
  fetchData();
}, 600);

// setTimeout(() => {
//   downloadPdf();
// }, 2000);
</script>

<template>
  <div id="club-container" class="md:p-6">
    <!--  -->
    <!--  -->
    <div class="flex items-center justify-between">
      <h1>Club and Organization</h1>
      <div class="mr-4 flex gap-2">
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
        <ButtonSubmit v-if="categoryLabels.length > 0 && monthsData.length > 0" @click="downloadPdf" class="h-[30px] border px-8 py-1">Download PDF</ButtonSubmit>
      </div>
    </div>
    <!--  -->
    <!--  -->
    <section id="clubs" class="flex flex-wrap gap-1">
      <div
        v-for="(club, idx) of clubs"
        :key="club.clubName"
        @click="handleClub(`${club.clubName}-${club.clubAcronym}`, idx)"
        class="card border px-8 py-1"
        :class="idx == isClick ? 'bg-slate-300' : ''">
        <div v-if="club.clubAcronym !== ''">
          <span> {{ club.clubAcronym }}</span>
        </div>
        <div v-else>
          <span> {{ club.clubName }}</span>
        </div>
      </div>
    </section>
    <!--  -->
    <!--  -->
    <section id="content" class="h-full">
      <!-- <h2 class="mt-4 text-center text-xl font-semibold">{{ clubKey }}</h2> -->

      <section class="mt-2">
        <BarChart v-if="categoryDatasets.length > 0" :label="categoryLabels" :dataset="categoryDatasets"
          >{{ clubKey }} {{ semester == '1' ? `First Semester SY ${year}-${Number(year) + 1}` : `Second Semester SY ${year}-${Number(year) + 1}` }}</BarChart
        >
      </section>
      <section class="mt-2 max-md:mr-2">
        <!-- <div v-for="(label, idx) of monthsLabels">
        <span>{{ label }}</span>
        <span>{{ monthsDatasets[idx] }}</span>
      </div> -->
        <div v-for="data of monthsData">
          <div class="mt-4" v-for="(eKey, idx) of Object.keys(data)">
            <span class="text-lg">{{ eKey }}</span>
            <LineChart v-if="monthsData.length > 0" :dataset="Object.values(data)[idx]" />
          </div>
        </div>
      </section>
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
