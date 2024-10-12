import * as cryptojs from 'crypto-js';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import $ from 'jquery';

const key = 'zYG6uuNtesuGk+2+LDv5Y1zhZThKlPg8fkji5GVSrAU=';

const basePath = import.meta.env.VITE_NODE_ENV !== "production" ? "" : (import.meta.env.VITE_PUBLIC_PATH ? `/${import.meta.env.VITE_PUBLIC_PATH}`: "");
const maxUserAge = import.meta.env.VITE_NODE_ENV !== "production" ? 24 : (import.meta.env.VITE_MAX_USER_AGE ? parseInt(import.meta.env.VITE_MAX_USER_AGE) : 24);

function encrypWithCryptojs(plaintext: string, strKey: string) {
  return cryptojs.AES.encrypt(plaintext, strKey).toString();
}

function decrypWithCryptojs(ciphertext: string, strKey: string): string | boolean {
  try {
    const bytes = cryptojs.AES.decrypt(ciphertext, strKey);
    return bytes.toString(cryptojs.enc.Utf8);
  } catch(e) {
    console.log("Oh no... trying to change the local storage, you will be logout. bye :)")
    return false
  }
}

export const userStore = defineStore('userStore', function () {
  const level: string = "";

  function localCred(): any {
    return localStorage.getItem('activity_tracker_presist');
  }

  function localSessionExpired(): any {
    const encryptTime = localStorage.getItem('activity_tracker_session_expiration');
    if (encryptTime) {
      return decrypWithCryptojs(encryptTime, key)
    }

    return false
  }

  function setLocalSessionExpired() {
    const expirationTime = Date.now() + (maxUserAge * 60 * 60 * 1000); // 3 hours | maxUserAge * 60 * 60 * 1000
    const encryptTime = encrypWithCryptojs(expirationTime.toString(), key)
    localStorage.setItem('activity_tracker_session_expiration', encryptTime);
  }

  function setLocalCred(jsonStr: string) {
    localStorage.setItem('activity_tracker_presist', jsonStr);
    setLocalSessionExpired();
  }

  function getDecryptedLevel() {
    if (localCred()) {
      const persisted = JSON.parse(localCred());
      const ciphertext = persisted.user.stringify;
      return decrypWithCryptojs(ciphertext, key);
    }
    
    return false
  }

  function getToken() {
    if (localCred()) {
      const persisted = JSON.parse(localCred());
      return persisted.user.token;
    }

    return "NONE"
  }

  function getLevel() {
    if (localCred()) {
      return JSON.parse(localCred()).user.level;
    }
  }

  function removeLocalStorage() {
    localStorage.removeItem('activity_tracker_presist');
    localStorage.removeItem('activity_tracker_pref');
    localStorage.removeItem('activity_tracker_session_expiration');
  }

  function isSessionExpired() {
    const currentTime = Date.now();
    if (localSessionExpired()) {
      return currentTime > parseInt(localSessionExpired());
    } else {
      removeLocalStorage()
    }

    return false;
  }

  function isSessionExpiringSoon() {
    const currentTime = Date.now();
    if (localSessionExpired()) {
      return parseInt(localSessionExpired()) - currentTime <= 5 * 60 * 1000; //5 * 60 * 1000
    } else {
      removeLocalStorage()
    }

    return false; 
  }

  function logout() {
    $.ajax({
      url: `${basePath}/api/logout`,
      method: 'PATCH',
      contentType: 'application/json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
      },
    })
  }

  return {
    basePath,
    setLocalCred,
    setLocalSessionExpired,
    isSessionExpired,
    isSessionExpiringSoon,
    getToken,
    getLevel,
    localCred,
    removeLocalStorage,
    getDecryptedLevel,
    level,
    logout
  };
});


export const dataStore = defineStore('dataStore', function () {
  const initData: any = {};

  const currentYear = new Date().getFullYear();
  const currentYearStr = currentYear.toString() + "-" + (currentYear + 1).toString()

  const activity_uuid = ref<string>('');

  function sortedSchoolYear(initSchoolyear: any[]) {
    const yearObj: { [key: string]: string } = {};
    const initSchoolYear: any[] = [];
  
    for (let year of initSchoolyear) {
      yearObj[year.school_year_uuid] = year.yearStart + '-' + year.yearEnd;
    }
  
    const yearStr = Object.entries(yearObj);
  
    yearStr.sort((a, b) => {
      const yearA = parseInt(a[1].split('-')[0]);
      const yearB = parseInt(b[1].split('-')[0]);
  
      return yearA - yearB;
    });
  
    for (let [key, value] of yearStr) {
      const obj = {
        school_year_uuid: key,
        schoolYear: value,
      };
  
      initSchoolYear.push(obj);
    }
  
    return initSchoolYear;
  }

  function setActivityUUID(uuid: string) {
    activity_uuid.value = uuid;
  }

  return {
   initData,
   sortedSchoolYear,
   currentYearStr,
   setActivityUUID,
   activity_uuid
  };
});

