<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
import { userStore } from './store/userStore';
import { useRouter, useRoute } from 'vue-router';

const accessby3 = 'WEBMASTER|ADMIN|STAFF';
const accesbyStudent = 'STUDENT';

const router = useRouter();
const route = useRoute();
const user = userStore();

const typeDevice = ref<string>('');
const isMobileOrTablet = ref<boolean>(false);

const isExpiredSoon = ref<boolean>(false);
const isExpiredSelectNo = ref<boolean>(false);

const pathInterval = ref<any>(null);
const checkDeviceInterval = ref<any>(null);
const isExpiredSoonInterval = ref<any>(null);


function checkDevice() {
  // isMobileOrTablet.value = window.innerWidth <= 768;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    isMobileOrTablet.value = true;
    const devices: any = /iPhone|iPad|iPod|Android/i.exec(navigator.userAgent);
    typeDevice.value = devices[0];
  } else {
    isMobileOrTablet.value = false;
  }
}

function extendSessionNo() {
  isExpiredSelectNo.value = true;
}

function extendSessionYes() {
  isExpiredSelectNo.value = false;
  user.setLocalSessionExpired();
}

onMounted(() => {
  if (pathInterval.value !== null) {
    pathInterval.value = null;
  }

  if (checkDeviceInterval.value !== null)  {
    checkDeviceInterval.value = null;
  }

  isExpiredSoonInterval.value = setInterval(()=> {

    if (route.name !== 'login') {

      if (!isExpiredSelectNo.value) {
        isExpiredSoon.value = user.isSessionExpiringSoon();

        if (isExpiredSoon.value) {
          const modal: any = document.getElementById('expire_modal');
          modal.showModal();
        }
      }

      if (user.isSessionExpired()) {
          user.logout()
          user.removeLocalStorage()
          isExpiredSoon.value = false;
          isExpiredSelectNo.value = false;
          setTimeout(()=>{
            router.push('/');
          }, 1500)
    
      }

    }
  }, 3000);

  pathInterval.value = setInterval(()=>{
    if (!user.localCred()) {
      user.removeLocalStorage();
      router.push('/');
    }

    if (route.name == 'login' && user.localCred()) {
      const userAccess = user.getDecryptedLevel();
        if (userAccess && typeof userAccess == "string") {
          if (userAccess.match(accessby3)) {
            router.push('/dashboard');
          } else if (userAccess.match(accesbyStudent)) {
            router.push('/student/dashboard');
          } else {
            user.removeLocalStorage();
            router.push('/');
        }
      } else {
        user.removeLocalStorage();
        router.push('/');
      }
    }
  }, 500)

  checkDeviceInterval.value = setInterval(()=>{
      checkDevice();
  }, 300);

  window.addEventListener('resize', checkDevice);
});

onMounted(() => {
  if (!user.localCred()) {
    if (pathInterval.value) {
      clearInterval(pathInterval.value);
    }
  }
})

onUnmounted(() => {
  clearInterval(pathInterval.value);
  clearInterval(checkDeviceInterval.value);
  clearInterval(isExpiredSoonInterval.value);
  window.removeEventListener('resize', checkDevice);
});

</script>
<template>
  <div v-if="isMobileOrTablet" class="flex h-screen w-screen flex-col items-center justify-center text-center">
    <div class="card bg-base-100 shadow-xl">
      <div class="flex justify-center px-2 py-4">
        <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/logo.png" class="h-8" alt="Flowbite Logo" />
          <span class="self-center whitespace-nowrap text-xl font-semibold">Activity Tracker</span>
        </a>
      </div>

      <div class="card-body text-center">
        <h2 class="card-title">Cant access the website. You are using {{ typeDevice }} device.</h2>
        <h1>Please use laptop or desktop to access the website</h1>
      </div>
    </div>
  </div>

  <div v-else>
    <main>
      <RouterView />
    </main>

    <dialog v-if="isExpiredSoon" id="expire_modal" class="modal">
        <div class="modal-box">
          <!-- <h3 class="text-lg font-bold">Hello!</h3> -->
          <p class="py-4 text-xl font-semibold text-red-600">Your session will expire soon. Do you want to extend it ?</p>
          <div class="modal-action">
            <form method="dialog" class="flex gap-2">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn" @click="extendSessionNo()">No</button>
              <button class="btn btn-error" @click="extendSessionYes()">Yes</button>
            </form>
          </div>
        </div>
      </dialog>

  </div>
</template>
