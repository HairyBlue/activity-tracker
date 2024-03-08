import { defineStore } from 'pinia';
import router from '../router';

export const userStore = defineStore('userSore', function () {
  const userPresist = localStorage.getItem('activity_tracker_presist');
  function checkIfPersist() {
    if (!userPresist) router.push('/');
  }

  function getToken() {
    checkIfPersist();
    if (userPresist) {
      return JSON.parse(userPresist).user.token;
    }
  }

  return {
    getToken,
    checkIfPersist,
  };
});
