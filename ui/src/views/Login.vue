<script setup lang="ts">
import ButtonWarn from '../components/globals/buttons/ButtonWarn.vue';
import { ref } from 'vue';
import $ from 'jquery';
import router from '../router';
const emailOrUsername = ref<string>('');
const password = ref<string>('');
let status = ref<any>(null);

function handleStatus(type: 'error' | 'loading' | 'success', msg: string) {
  status.value = { type: type, message: msg };
}

function handleLogin() {
  //check if credentials not empty
  if (emailOrUsername.value == '' || password.value == '') {
    handleStatus('error', 'Incomplete credentials, unable to siginin');
  } else {
    //time out for fancy
    handleStatus('loading', 'Proccessing credentials...');

    $.ajax({
      url: '/api/login',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ emailOrUsername: emailOrUsername.value, password: password.value }),
    })
      .done((data) => {
        if (data.token) {
          localStorage.setItem('activity_tracker_presist', JSON.stringify({ user: { token: data.token, level: data.level } }));
        }
        if (data.message == 'success') {
          setTimeout(() => {
            handleStatus('success', 'Login ok');
          }, 500);
          setTimeout(() => {
            router.push('/overview');
          }, 1000);
        }
      })
      .fail((jqXHR) => {
        if (jqXHR.status == 401) {
          handleStatus('error', 'Invalid credentials');
        }
      });
  }
}

window.addEventListener("keypress", function (event: KeyboardEvent) {
  if(event.key == "Enter") handleLogin()
})
</script>

<template>
  <div class="login">
    <div class="login-form">
      <div class="login-header">
        <img src="/logo.png" alt="" />
        <span>Activity Tracker</span>
      </div>
      <div class="card flex h-[350px] flex-1 flex-col gap-4 px-6 py-6 text-center font-extrabold">
        <span class="text-xl">Sign in to your account</span>
        <section class="flex flex-col text-start">
          <label for="usernameoremail">Your email or username</label>
          <input id="usernameoremail" type="text" class="h-8" required v-model="emailOrUsername" />
        </section>
        <section class="flex flex-col text-start">
          <label for="password">Password</label>
          <input id="password" type="password" autocomplete="off" class="h-8" required v-model="password" />
        </section>
        <ButtonWarn id="login-action" class="mx-auto mt-8 w-3/4 p-2" @click="handleLogin">Sign in to your account</ButtonWarn>
        <!-- <span>Forgot your password?</span> -->
        <span v-if="status" :class="status.type == 'success' ? 'text-green-400' : status.type == 'loading' ? 'text-black' : 'text-red-400'"> {{ status.message }}</span>
      </div>
    </div>
    <div class="login-fade"></div>
  </div>
</template>

<style scoped>
.login {
  min-width: 100%;
  min-height: 100dvh;
  background-image: url('/building.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
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
</style>
