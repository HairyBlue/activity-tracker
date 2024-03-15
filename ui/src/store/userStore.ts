import { defineStore } from 'pinia';
import router from '../router';

export const userStore = defineStore('userSore', function () {
  function isLocalCred(): any{
    return localStorage.getItem('activity_tracker_presist');
  }

  function checkIfPersist() {
    if (!isLocalCred()) {
      router.push('/');
      return
    }
  }

  function getToken() {
    checkIfPersist();
    if (isLocalCred()) {
      return JSON.parse(isLocalCred()).user.token;
    }
  }

  return {
    getToken,
    checkIfPersist,
  };
});
