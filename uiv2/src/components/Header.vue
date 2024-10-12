<script setup lang="ts">

</script>

<template>
  <header>
    <div class="logo-header">
      <img src="/logo.png" alt="" />
      <span>Activity Tracker</span>
    </div>
    <span>Logout</span>
  </header>
</template>

<style scoped>
header {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100%;
  height: 50px;
  background-color: var(--white-color);
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px 0 32px;
  z-index: 3;
}
</style>

<style scoped>
.logo-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  color: var(--white-dark);
  font-size: var(--font-s-md);
  font-weight: var(--font-w-xl);
}
</style>
