<script lang="ts" setup>
// import $ from 'jquery';
import { userStore } from '../../store/userStore';
import { useRouter, useRoute } from 'vue-router';

const user = userStore();
const router = useRouter();
const route = useRoute();

function userLogOut() {
  user.logout();
  user.removeLocalStorage()
  setTimeout(()=>{
    router.push('/');
  }, 1500)
}

function isCurrentSelection(prout: string): boolean {
  return route.fullPath == prout;
}
</script>

<template>
  <aside id="default-sidebar" class="h-screen w-64 border border-x-gray-200 transition-transform" aria-label="Sidebar">
    <div class="h-full overflow-y-auto bg-gray-50 px-3 py-4 flex flex-col justify-between">
      <div>
        <div class="px-2 py-4">
          <RouterLink data-testid="header-title" to="/dashboard" class="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/logo.png" class="h-6" alt="CJC LOGO" />
            <span class="self-center whitespace-nowrap text-lg font-semibold">Activity Tracker</span>
          </RouterLink>
        </div>
        <ul class="space-y-2 font-medium">
          <li>
            <RouterLink
              data-testid="student-dashboard-link"
              to="/student/dashboard"
              :class="isCurrentSelection('/student/dashboard') ? 'bg-gray-200' : ''"
              class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100">
              <svg
                class="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path
                  fill-rule="evenodd"
                  d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
                  clip-rule="evenodd" />
              </svg>

              <span class="ms-3 flex-1 whitespace-nowrap">Club and Organization</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              data-testid="student-dashboard-activity-link"
              to="/student/dashboard/activity"
              :class="isCurrentSelection('/student/dashboard/activity') ? 'bg-gray-200' : ''"
              class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100">
              <svg
                class="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 18">
                <path
                  d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
              </svg>
              <span class="ms-3 flex-1 whitespace-nowrap">Activity</span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <div>
        <a data-testid="student-sign-out" href="#" @click="userLogOut()" class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100">
          <svg
            class="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 16">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
          </svg>
          <span class="ms-3 flex-1 whitespace-nowrap">Sign Out</span>
        </a>
      </div>
    </div>
  </aside>
</template>
