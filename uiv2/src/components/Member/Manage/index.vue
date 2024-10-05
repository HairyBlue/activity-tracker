<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// import $ from 'jquery';

import { userStore } from '../../../store/userStore';

const router = useRouter();
const route = useRoute();

const accessby2 = 'WEBMASTER|ADMIN';
const user = userStore();

const level = user.getDecryptedLevel();
const hasAccess = ref<boolean>(false);

function isCurrentSelection(prout: string): boolean {
  return route.fullPath == prout;
}

onMounted(() => {
  if (level) {
    if (typeof level == "string" && level.match(accessby2)) {
      hasAccess.value = true;
      user.level = level;
    } else {
      hasAccess.value = false;
      router.push('/');
    }
  }
});
</script>

<template>
  <div v-if="hasAccess" class="w-full">
    <section>
      <div class="border p-1">
        <!--  -->
        <RouterLink to="/dashboard/manage">
          <button
            :class="isCurrentSelection('/dashboard/manage') ? 'bg-[#1f2937] text-white' : ''"
            class="btn btn-outline ml-1 rounded-none border border-solid border-gray-400"
            id="club">
            Club and Organization
          </button>
        </RouterLink>
        <!--  -->
        <RouterLink to="/dashboard/manage/category">
          <button
            :class="isCurrentSelection('/dashboard/manage/category') ? 'bg-[#1f2937] text-white' : ''"
            class="btn btn-outline ml-1 rounded-none border border-solid border-gray-400"
            id="category">
            Category
          </button>
        </RouterLink>

        <RouterLink to="/dashboard/manage/school-year">
          <button :class="isCurrentSelection('/dashboard/manage/school-year') ? 'bg-[#1f2937] text-white' : ''" class="btn btn-outline ml-1 rounded-none border border-solid border-gray-400" id="schoolYear">School Year</button>
        </RouterLink>
      </div>
    </section>
    <section>
      <RouterView />
    </section>
  </div>
</template>
