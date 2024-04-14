import { defineStore } from 'pinia';
import router from '../router';

export const userStore = defineStore('userStore', function () {
  function isLocalCred(): any {
    return localStorage.getItem('activity_tracker_presist');
  }

  function checkIfPersist() {
    if (!isLocalCred()) {
      router.push('/');
      return;
    }
  }

  function getToken() {
    checkIfPersist();
    if (isLocalCred()) {
      return JSON.parse(isLocalCred()).user.token;
    }
  }

  function getLevel() {
    checkIfPersist();
    if (isLocalCred()) {
      return JSON.parse(isLocalCred()).user.level;
    }
  }
  function removeToken() {
    localStorage.removeItem('activity_tracker_presist');
    localStorage.removeItem('activity_tracker_pref')
    router.push('/');
    return;
  }
  return {
    getToken,
    getLevel,
    checkIfPersist,
    removeToken,
  };
});
