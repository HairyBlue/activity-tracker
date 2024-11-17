<script lang="ts" setup>
import Form from './SlugForm.vue';
import ImageUpload from './ImageUpload.vue';

import { ref } from 'vue';

const showForm = ref<boolean>(true);


function onShowFormClick() {
  showForm.value = !showForm.value;
}


</script>

<template>
  <div class="w-full px-4">
    <button type="button" @click="onShowFormClick" class="btn btn-accent my-4">  
      {{ showForm ? "Hide Form Submission " : "Show Form Submission "  }}
    </button>
    <hr>
    <Form v-if="showForm"/>
    <br>
    <br>
    <ImageUpload />
  </div>
</template>
