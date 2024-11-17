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

function levelAllowed(level: string): boolean {
  const userAccess = user.getDecryptedLevel();
  if (userAccess && typeof userAccess === "string") {
    const match = userAccess.match(level);
    if (match) {
      return true
    }
  }

  return false
}

function isCurrentSelection(prout: string): boolean {
  return route.fullPath == prout;
}

</script>
<template>
  <aside id="default-sidebar" class="h-screen w-64 border border-x-gray-200 transition-transform" aria-label="Sidebar">
    <div class="flex h-full flex-col justify-between overflow-y-auto bg-gray-50 px-3 py-4">
      <div>
        <div class="px-2 py-4">
          <RouterLink to="/dashboard" class="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/logo.png" class="h-6" alt="CJC LOGO" />
            <span class="self-center whitespace-nowrap text-lg font-semibold">Activity Tracker</span>
          </RouterLink>
        </div>
        <ul class="space-y-2 font-medium">
          <li>
            <RouterLink
              to="/dashboard"
              :class="isCurrentSelection('/dashboard') ? 'bg-gray-200' : ''"
              class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 ">
              <svg
                class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 21">
                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
              </svg>
              <span class="ms-3">Overview</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/dashboard/activity"
              :class="isCurrentSelection('/dashboard/activity') ? 'bg-gray-200' : ''"
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
          <li>
            <RouterLink
              to="/dashboard/club-organizatons"
              :class="isCurrentSelection('/dashboard/club-organizatons') ? 'bg-gray-200' : ''"
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

              <span class="ms-3 flex-1 whitespace-nowrap">Club and Origanization</span>
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/dashboard/users"
              :class="isCurrentSelection('/dashboard/users') ? 'bg-gray-200' : ''"
              class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100">
              <svg
                class="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18">
                <path
                  d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
              </svg>
              <span class="ms-3 flex-1 whitespace-nowrap">Users</span>
            </RouterLink>
          </li>
          <li v-if="levelAllowed('WEBMASTER|ADMIN')">
            <RouterLink
              to="/dashboard/manage"
              :class="isCurrentSelection('/dashboard/manage') ? 'bg-gray-200' : ''"
              class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100">
              <svg
                class="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path fill-rule="evenodd" d="M3 6a2 2 0 0 1 2-2h5.532a2 2 0 0 1 1.536.72l1.9 2.28H3V6Zm0 3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H3Z" clip-rule="evenodd" />
              </svg>

              <span class="ms-3 flex-1 whitespace-nowrap">Manage</span>
            </RouterLink>
          </li>
          <li v-if="levelAllowed('WEBMASTER')">
            <RouterLink
              to="/server-health"
              :class="isCurrentSelection('/server-health') ? 'bg-gray-200' : ''"
              class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100">
              <svg
                class="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15v4m6-6v6m6-4v4m6-6v6M3 11l6-5 6 5 5.5-5.5" />
              </svg>

              <span class="ms-3 flex-1 whitespace-nowrap">Server Health</span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <div>
        <RouterLink to="/demo" class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100">
          <svg  class="h-5 w-5 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.008-3.018a1.502 1.502 0 0 1 2.522 1.159v.024a1.44 1.44 0 0 1-1.493 1.418 1 1 0 0 0-1.037.999V14a1 1 0 1 0 2 0v-.539a3.44 3.44 0 0 0 2.529-3.256 3.502 3.502 0 0 0-7-.255 1 1 0 0 0 2 .076c.014-.398.187-.774.48-1.044Zm.982 7.026a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2h-.01Z"
              clip-rule="evenodd" />
          </svg>
          <span class="ms-3 flex-1 whitespace-nowrap">Demo</span>
        </RouterLink>

        <a href="#" @click="userLogOut()" class="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100">
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
