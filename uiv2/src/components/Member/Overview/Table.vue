<script lang="ts" setup>
import { ref } from 'vue';
import { dataStore } from '../../../store/userStore';
import { useRouter } from 'vue-router';

const props = defineProps(['latest20Activity']);
const latest20Activity = ref<any>(props.latest20Activity);

const router = useRouter();


const sdata = dataStore();

function clickEach(clubAcronym: string, clubName: string, activity_uuid: string) {
  let club: string = clubAcronym.length > 0 ? clubAcronym : clubName;
  club = club.replace(/\//g, '_');
  sdata.setActivityUUID(activity_uuid);

  router.push(`/dashboard/activity/${club}/${activity_uuid}`);
}

</script>

<template>
  <div >
    <table class="table">
      <!-- head -->
      <thead>
        <tr>
          <th>Club and Organization</th>
          <th>Activity Name</th>
          <th>Category</th>
          <th>Semester</th>
          <th>Date</th>
          <th>No. Participants</th>
          <th>Attendees</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in latest20Activity">
              <!-- <td>{{ idx + 1 }}</td> -->

              <td class="align-top">{{ data["activities"][0].clubAcronym.length > 0 ? data["activities"][0].clubAcronym : data["activities"][0].clubName }}</td>
              <td class="align-top">{{ data["activities"][0].activityName }}</td>
              <td class="align-top">
                <div v-for="category of data['categories']">
                  {{ category.name }}, 
                </div>
              </td>
              <td class="align-top">{{ data["activities"][0].activitySemester }}</td>
              <td class="align-top">              
                <div v-for="attendees of data['activities'][0].activityDisplayDate.split('---')">
                  {{ attendees }}, 
                </div>
              </td>
              
              <td class="align-top">{{ data["activities"][0].activityNumberParticipants }}</td>
              <td class="align-top">
                <div v-for="attendees of JSON.parse(data['activities'][0].activityPersonel)">
                  {{ attendees }}, 
                </div>
              </td>

              <td>
                <div class="flex flex-nowrap">
                <!-- Approved -->
                  <div v-if="data['activities'][0].activityStatus == 'APPROVED'" class="badge badge-success gap-2">{{ data["activities"][0].activityStatus.toLowerCase()  }}</div>
                  <div v-else-if="data['activities'][0].activityStatus == 'DISAPPROVED'" class="badge badge-error gap-2">{{ data["activities"][0].activityStatus.toLowerCase()  }}</div>
                  <div v-else-if="data['activities'][0].activityStatus == 'PENDING'" class="badge badge-warning gap-2">{{ data["activities"][0].activityStatus.toLowerCase()  }}</div>
                  <div class="ml-2 badge badge-neutral gap-2" @click="clickEach(data['activities'][0].clubAcronym, data['activities'][0].clubName, data['activities'][0].activity_same_record_uuid)" > 
                    view 
                    <svg width="16px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 4L12 12M20 4V8.5M20 4H15.5M19 12.5V16.8C19 17.9201 19 18.4802 18.782 18.908C18.5903 19.2843 18.2843 19.5903 17.908 19.782C17.4802 20 16.9201 20 15.8 20H7.2C6.0799 20 5.51984 20 5.09202 19.782C4.71569 19.5903 4.40973 19.2843 4.21799 18.908C4 18.4802 4 17.9201 4 16.8V8.2C4 7.0799 4 6.51984 4.21799 6.09202C4.40973 5.71569 4.71569 5.40973 5.09202 5.21799C5.51984 5 6.07989 5 7.2 5H11.5" stroke="#c2c2c2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                  </div>
                <!-- Approved -->
                </div>
              </td>
            </tr>
      </tbody>
    </table>
  </div>

</template>
