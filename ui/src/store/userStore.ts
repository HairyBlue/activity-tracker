import { defineStore } from 'pinia';
import router from '../router';
let userPresist: any =

setInterval(() => {
  userPresist =  localStorage.getItem('activity_tracker_presist');
}, 500)

export const userStore = defineStore('userSore', function () {
  function getToken() {
    if (userPresist) {
      return JSON.parse(userPresist).user.token;
    }
      
  }
  function checkIfPersist() {
    if (!userPresist) router.push('/');
  }
  return {
    getToken,
    checkIfPersist,
  };
});
