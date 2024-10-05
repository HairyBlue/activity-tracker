<script lang="ts" setup>
import $ from 'jquery';
import { userStore, dataStore } from '../../../store/userStore';
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const user = userStore();
const sdata = dataStore();

const categories = ref<Array<any>>([]);
const clubs = ref<Array<any>>([]);
const schoolYears = ref<Array<any>>([]);

const category_uuid = ref<string>('');
const club_uuid = ref<string>('');
const activitySchoolYear = ref<string>(sdata.currentYearStr);
const activitySemester = ref<string>('1');
const orderBy = ref<string>('ASC');
const pageSize = ref<number>(20);
const pageNumber = ref<number>(1);
const searchFilter = ref<string>('');

const activityData = ref<any[]>([]);
const activityCount = ref<number>(0);

function fetchData() {
  // console.log(user.getToken(), user.level);
  setTimeout(() => {
    $.ajax({
      url: `${user.basePath}/api/activity/${user.level}`,
      method: 'GET',
      contentType: 'application/json',
      data: {
        activitySchoolYear: activitySchoolYear.value,
        activitySemester: activitySemester.value,
        orderBy: orderBy.value,
        pageSize: pageSize.value,
        pageNumber: pageNumber.value,
        category_uuid: category_uuid.value,
        club_uuid: club_uuid.value,
        // searchFilter: searchFilter.value,
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
      },
    }).then((value) => {
      // console.log(value);
      activityData.value = value.data;
    });
  }, 500);

  setTimeout(() => {
    $.ajax({
      url: `${user.basePath}/api/activity-count`,
      method: 'GET',
      contentType: 'application/json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${user.getToken()}`);
      },
    }).then((value) => {
      // console.log(value);
      activityCount.value = value.count != null ? value.count[0].count : 0;
    });
  }, 500);
}

watch(
  [category_uuid, club_uuid, activitySchoolYear, activitySemester, orderBy, pageSize, pageNumber, searchFilter],
  (
    [new_category_uuid, new_club_uuid, new_activitySchoolYear, new_activitySemester, new_orderBy, new_pageSize, new_pageNumber, new_searchFilter],
    [old_category_uuid, old_club_uuid, old_activitySchoolYear, old_activitySemester, old_orderBy, old_pageSize, old_pageNumber, old_searchFilter]
  ) => {
    // Check if any variable has changed
    // if (
    //   new_searchFilter !== old_searchFilter ||
    //   new_category_uuid !== old_category_uuid ||
    //   new_club_uuid !== old_club_uuid ||
    //   new_activitySchoolYear !== old_activitySchoolYear ||
    //   new_activitySemester !== old_activitySemester ||
    //   new_orderBy !== old_orderBy ||
    //   new_pageSize !== old_pageSize ||
    //   new_pageNumber !== old_pageNumber
    // ) {
    //   fetchData();
    // }
    // Handle changes and call fetchData if needed
    if (new_category_uuid !== old_category_uuid) {
      // console.log('category_uuid changed');
      fetchData(); // Fetch data if category_uuid changes
    }

    if (new_club_uuid !== old_club_uuid) {
      // console.log('club_uuid changed');
      fetchData(); // Fetch data if club_uuid changes
    }

    if (new_activitySchoolYear !== old_activitySchoolYear) {
      // console.log('activitySchoolYear changed');
      fetchData(); // Fetch data if activitySchoolYear changes
    }

    if (new_activitySemester !== old_activitySemester) {
      // console.log('activitySemester changed');
      fetchData(); // Fetch data if activitySemester changes
    }

    if (new_orderBy !== old_orderBy) {
      // console.log('orderBy changed');
      fetchData(); // Fetch data if orderBy changes
    }

    if (new_pageSize !== old_pageSize) {
      // console.log('pageSize changed');
      fetchData(); // Fetch data if pageSize changes
    }

    if (new_pageNumber !== old_pageNumber) {
      // console.log('pageNumber changed');
      fetchData(); // Fetch data if pageNumber changes
    }

    if (new_searchFilter !== old_searchFilter) {
      // console.log('searchFilter changed');
      fetchData(); // Fetch data if searchFilter changes
    }
  }
);

function resetFilter() {
  const vars = [category_uuid, club_uuid, searchFilter];
  for (let variables of vars) {
    variables.value = '';
  }

  activitySchoolYear.value = sdata.currentYearStr;
  activitySemester.value = '1';
  orderBy.value = 'ASC';
  pageSize.value = 20;
  pageNumber.value = 1;

  fetchData();
}

function clickPageNum(prevNext: 'prev' | 'next') {
  const maxPage = Math.ceil(activityCount.value / pageSize.value);

  if (prevNext == 'prev') {
    if (pageNumber.value == 1) return;
    pageNumber.value -= 1;
    fetchData();
  }
  if (prevNext == 'next') {
    if (pageNumber.value == maxPage) return;
    pageNumber.value += 1;
    fetchData();
  }
}

function clickEach(clubAcronym: string, clubName: string, activity_uuid: string) {
  let club: string = clubAcronym.length > 0 ? clubAcronym : clubName;
  club = club.replace(/\//g, '_');
  sdata.setActivityUUID(activity_uuid);

  router.push(`/student/dashboard/activity/${club}/${activity_uuid}`);
}

onMounted(() => {
  fetchData();

  setTimeout(() => {
    categories.value = sdata.initData.initCategory;
    clubs.value = sdata.initData.initClub;
    schoolYears.value = sdata.sortedSchoolYear(sdata.initData.initYear);
  }, 300);
});
</script>
<template>
  <div class="h-screen overflow-auto">
    <div class="p-2">
      <div class="flex flex-wrap gap-2">
        <!-- Search -->
        <!-- <div>
          <input type="text" placeholder="Search here" class="input input-bordered input-primary w-full max-w-xs rounded-none" v-model="searchFilter" />
        </div> -->
        <!-- Club -->
        <div>
          <select class="select select-primary w-full max-w-xs rounded-none" v-model="category_uuid">
            <option disabled selected value="">Category</option>
            <option v-for="category in categories" :value="category.category_uuid" :id="category.category_uuid">{{ category.categoryName }}</option>
          </select>
        </div>
        <!-- Category -->
        <div>
          <select class="select select-primary w-full max-w-xs rounded-none" v-model="club_uuid">
            <option disabled selected value="">Club</option>
            <option v-for="club in clubs" :value="club.club_uuid" :id="club.club_uuid">{{ club.clubName }}</option>
          </select>
        </div>
        <!-- SchoolYear -->
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

        <!-- Order By r-->
        <div>
          <select class="select select-primary w-full max-w-xs rounded-none" v-model="orderBy">
            <option disabled selected value="">Order Activity Start Date</option>
            <option :value="'ASC'">Ascending</option>
            <option :value="'DESC'">Descending</option>
          </select>
        </div>
        <!-- REST -->
        <div>
          <!-- <span class="font-8 text-xl"> | </span> -->
          <button class="btn btn-primary btn-active" @click="resetFilter()">Reset Filter</button>
        </div>
      </div>

      <!-- TABLE -->
      <div class="no-scrollbar h-screen overflow-auto" v-if="activityData.length > 0">
        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th></th>
              <th>Club and Organization</th>
              <th>Activity Name</th>
              <th>Category</th>
              <th>Semester</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, idx) in activityData" @click="clickEach(data.clubAcronym, data.clubName, data.activity_uuid)" class="hover:bg-slate-200">
              <th>{{ idx + 1 }}</th>
              <td>{{ data.clubAcronym.length > 0 ? data.clubAcronym : data.clubName }}</td>
              <td>{{ data.activityName }}</td>
              <td>{{ data.categoryName }}</td>
              <td>{{ data.activitySemester }}</td>
              <td>{{ data.activityDisplayDate }}</td>
              <td>
                <!-- Approved -->
                <div v-if="data.activityStatus == 1" class="badge badge-success gap-2">approved</div>
                <div v-else class="badge badge-warning gap-2">pending</div>
                <!-- Approved -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <div class="mt-16 text-center text-4xl font-semibold text-gray-600">
          <div>
            <span>No data currently showed</span>
          </div>
        </div>
      </div>
      <!-- Pagination -->
      <div class="mt-10">
        <div class="flex items-center justify-center gap-2">
          <!-- <span class="font-8 text-xl"> | </span> -->
          <button class="btn btn-primary rounded-none" @click="clickPageNum('prev')">Prev</button>
          <button class="btn btn-outline btn-error rounded-none border">{{ pageNumber }}</button>
          <button class="btn btn-primary rounded-none" @click="clickPageNum('next')">Next</button>
          <select class="select select-primary max-w-xs rounded-none" v-model="pageSize">
            <option :value="20">20</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* * Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
