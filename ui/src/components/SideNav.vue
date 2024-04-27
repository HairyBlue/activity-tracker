<script setup lang="ts">
import { userStore } from '../store/userStore';

const user = userStore();
import dashboardSvg from '../assets/svg/overview.svg';
import activitySvg from '../assets/svg/activity.svg';
import clubsSvg from '../assets/svg/clubs.svg';
import manageSvg from '../assets/svg/manage.svg';
import userSvg from "../assets/svg/user.svg"
</script>

<template>
  <aside>
    <nav>
      <router-link to="/overview">
        <div aria-label="Overview" class="tooltip" aria-expanded="false"><img :src="dashboardSvg" alt="overview" /></div
      ></router-link>
      <router-link to="/activity">
        <div aria-label="Activity" class="tooltip" aria-expanded="false"><img :src="activitySvg" alt="activity" /></div
      ></router-link>
      <router-link to="/clubs-and-organizatons">
        <div aria-label="Clubs and Oraginzations" class="tooltip" aria-expanded="false"><img :src="clubsSvg" alt="clubs" /></div>
      </router-link>
      <router-link v-if="user.getLevel() !== 'STAFF'" to="/manage">
        <div aria-label="Manage" class="tooltip" aria-expanded="false"><img :src="manageSvg" alt="manage" /></div>
      </router-link>
      <router-link v-if="user.getLevel() !== 'STAFF'" to="/user">
        <div aria-label="User Management" class="tooltip" aria-expanded="false"><img :src="userSvg" alt="manage" /></div>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>
aside {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  min-height: 100dvh;
  background-color: var(--white-color);
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  position: fixed;
  z-index: 2;
}

aside > nav > a > div {
  margin-top: 16px;
  padding: 6px;
  border: 1px solid black;
  border-radius: 50%;
}
aside > nav > a > div,
img {
  cursor: pointer;
  min-width: 24px;
}

.tooltip {
  position: relative;
}

.tooltip::after {
  display: none;
}

.tooltip[aria-label]:hover:after {
  content: attr(aria-label);
  position: absolute;
  display: block;
  top: 2px;
  left: 50px;
  font-weight: 500;
  font-size: large;
  font-weight: 900;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  background-color: var(--white-color);
  border-radius: 4px;
  padding: 4px 6px;
  text-wrap: nowrap;
  /* color: $white;

  white-space: nowrap;
  text-decoration: none;
  text-indent: 0;
  overflow: visible;
  padding: 8px;
  border-radius: 5px; */
}
</style>
