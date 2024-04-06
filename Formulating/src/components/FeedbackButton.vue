<template>
  <div class="fixed bottom-1 right-1">
    <button @click="showForm = !showForm" class="bg-slate-400 hover:bg-Slate-500 text-white font-bold py-2 px-4 rounded">
      Feedback
    </button>
    <form v-if="showForm" @submit.prevent="submitFeedback" class="mt-4">
      <textarea v-model="message" placeholder="Write your feedback here..." class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none" rows="4"></textarea>
      <button type="submit" class="mt-2 bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded">
        Send
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const showForm = ref(false);
const message = ref('');

const submitFeedback = () => {
  let body = { message: message.value };
  axios.post('users/feedback', body);
  console.log(message.value);
  message.value = '';
  showForm.value = false;
};
</script>