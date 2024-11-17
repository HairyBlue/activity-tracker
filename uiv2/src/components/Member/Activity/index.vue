<script lang="ts" setup>
import Form from './Form.vue';
import Table from './Table.vue';

import { ref } from 'vue';

const showForm = ref<boolean>(false);


function onShowFormClick() {
  showForm.value = !showForm.value;
}
</script>

<template>
  <div class="w-full h-screen px-4">
    <button type="button" @click="onShowFormClick" class="btn btn-accent my-4">  
      {{ showForm ? "Hide Form Submission " : "Show Form Submission "  }}
    </button>
    <hr>
    <Form v-if="showForm"/>
    <br>
    <br>
    <Table />
  </div>
</template>
