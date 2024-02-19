<script setup lang="ts">
import dashboardSvg from '../assets/svg/overview.svg';
import activitySvg from '../assets/svg/activity.svg';
import clubsSvg from '../assets/svg/clubs.svg';
import manageSvg from '../assets/svg/manage.svg';
</script>

<template>
   <aside>
      <nav>
         <router-link to="/overview">
            <div><img :src="dashboardSvg" alt="overview" /></div
         ></router-link>
         <router-link to="/activity">
            <div><img :src="activitySvg" alt="activity" /></div
         ></router-link>
         <router-link to="/clubs">
            <div><img :src="clubsSvg" alt="clubs" /></div>
         </router-link>
         <router-link to="/manage">
            <div><img :src="manageSvg" alt="manage" /></div>
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
   min-height: 100vh;
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
</style>
