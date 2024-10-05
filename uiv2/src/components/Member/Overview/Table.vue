<script lang="ts" setup>
import { ref } from 'vue';
const props = defineProps(['latest20Activity']);
const latest20Activity = ref<any>(props.latest20Activity);
// console.log(latest20Activity.value)
</script>

<template>
  <div >
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th></th>
          <th>Club and Organization</th>
          <th>Activity Name</th>
          <th>Category</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, idx) in latest20Activity" class="hover:bg-slate-200">
          <th>{{ idx + 1 }}</th>
          <td>{{ data.clubAcronym.length > 0 ? data.clubAcronym : data.clubName }}</td>
          <td>{{ data.activityName }}</td>
          <td>{{ data.categoryName }}</td>
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

</template>
