<script setup lang="ts">
import { ref, onMounted } from 'vue';
import $ from 'jquery';

import router from '../router';
import { userStore } from '../store/userStore';

const currentYear = new Date().getFullYear();

const user = userStore();
const accessby3 = 'WEBMASTER|ADMIN|STAFF';
const studentAccess = 'STUDENT';

const emailOrUsername = ref<string>('');
const password = ref<string>('');
const errorMessage = ref<string>('Please complete the form');
const enableError = ref<boolean>(false);
const loginOk = ref<boolean>(false);

const showPassword = ref<boolean>(false);

const activityTrackerApp = "https://drive.google.com/drive/folders/1-IM-mGe3oqkGGgS_mdmyinVrp-j-1YkF?usp=drive_link" //`${user.basePath}/activity-tracker-app-win32-x64-1.0.0.zip`;
const enableDownloadApp = ref<boolean>(true);

function removeDownloadPopup() {
  enableDownloadApp.value = false
}

function showPasswordFunc() {
  showPassword.value = !showPassword.value;
}

function removeError() {
  enableError.value = false;
}
function handleLogin() {
  if (emailOrUsername.value.length == 0 || password.value.length == 0) {
    errorMessage.value = 'Please complete the form';
    enableError.value = true;
    return;
  }

  $.ajax({
    url: `${user.basePath}/api/login`,
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ emailOrUsername: emailOrUsername.value, password: password.value }),
  })
    .done((data) => {
      if (data.token) {
        user.removeLocalStorage();
        
        if (data.message == 'success') {
          user.setLocalCred(
            JSON.stringify({
              user: {
                token: data.token,
                stringify: data.stringify,
              },
            })
          );

          const level = user.getDecryptedLevel();
          if (level && typeof level == "string") {
            enableError.value = false
            loginOk.value = true;

            setTimeout(() => {
              if (level.match(accessby3)) {
                router.push('/dashboard');
              } else if (level == studentAccess) {
                router.push('/student/dashboard');
              }
            }, 2500);

          } else {
            user.removeLocalStorage();
          }   
        }
      }
    })
    .fail((jqXHR) => {
      // console.log(jqXHR);
      if (jqXHR.status == 401) {
        errorMessage.value = 'Invalid credentials';
        enableError.value = true;
      }
    });
}

function isElectron() {
    // Renderer process
    //@ts-ignore
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
      return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
      return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) { 
      return true;
    }

    return false;
}

onMounted(()=>{
  window.addEventListener('keypress', function (event: KeyboardEvent) {
    if (event.key == 'Enter') handleLogin();
  });

//  console.log(isElectron() ? "Runs on electron" : "Not runs on electron")
 if (isElectron()) {
  enableDownloadApp.value = false;
 }
})
</script>

<template>
  <div>
    <div id="login" class="flex h-screen w-screen flex-col justify-center">
      <div class="card m-auto flex bg-base-100 shadow-xl lg:card-side max-lg:block sm:w-1/2">
        <!--  -->
        <div class="flex justify-center border-r-gray-200 px-2 py-4 max-md:border">
          <RouterLink to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="/logo.png" class="h-12" alt="CJC LOGO" />
            <span class="self-center whitespace-nowrap text-2xl font-semibold">Activity Tracker</span>
          </RouterLink>
        </div>
        <div class="card-body">
          <h2 class="card-title">Enter you account</h2>

          <label class="input input-bordered mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input type="text" class="grow" placeholder="Email or Username" required v-model="emailOrUsername" />
          </label>

          <label class="input input-bordered mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
              <path
                fill-rule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clip-rule="evenodd" />
            </svg>
            <input :type="showPassword ? 'text' : 'password'" class="grow" value="" placeholder="password" required v-model="password" />
            <div>
              <div v-if="showPassword" name="eye-off" @click="showPasswordFunc()">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7" />
                </svg>
              </div>
              <div v-else name="eye" @click="showPasswordFunc()">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5" />
                </svg>
              </div>
            </div>
          </label>

          <div class="card-actions justify-end">
            <button
              @click="handleLogin()"
              type="submit"
              class="btn bg-gradient-to-r from-red-400 via-red-500 to-red-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br max-lg:w-full">
              Login
            </button>
          </div>

          <div v-if="enableError">
            <div>
              <div role="alert" class="alert alert-error">
                <div @click="removeError()">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span> {{ errorMessage }}</span>
              </div>
            </div>
          </div>
          <!--  -->

          <div v-if="loginOk">
            <div>
              <div role="alert" class="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Succesfully login</span>
              </div>
            </div>
          </div>

          <div v-if="enableDownloadApp">
            <div>
              <div role="alert" class="alert alert-info p-2 flex">
                <div @click="removeDownloadPopup()">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>Activity Tracker is now available for windows. <a :href="activityTrackerApp" class="underline hover:font-bold ">Click to download</a></span>
              </div>
            </div>
          </div>
          <!--  -->
        </div>
      </div>
      <footer>
        <div class="footer-content">
          <span>&copy; {{ currentYear }} Activity Tracker - DSSC</span>
          <br>
          <span>Developed by <a href="https://github.com/HairyBlue" target="_blank">Nicki Marty Pecision</a></span>
          <br>
          <span>
            CCIS | ACSS
          </span>
        </div>
      </footer>
    </div>
  </div>

</template>

<style scoped>
#login {
  background-image: url('/building.png');
  background-image: url('/building.webp');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.login-form {
  width: 350px;
  margin: 0 auto;
  z-index: 1;
  position: relative;
}

.login-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  color: var(--white-color);
  font-size: var(--font-s-lg);
  font-weight: var(--font-w-xl);
  padding: 8px;
}

.login-fade {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--dark-color);
  opacity: 25%;
}

footer {
  opacity: 75%;
  background-color: #333;
  color: #fff;
  padding: 8px;
  text-align: center;
}

.footer-content p {
  margin: 0;
  font-size: 14px;
}

.footer-content a {
  color: #ffcc00;
  text-decoration: none;
}

.footer-content a:hover {
  text-decoration: underline;
}
</style>
