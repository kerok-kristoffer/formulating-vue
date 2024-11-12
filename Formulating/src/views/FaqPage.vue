<template>
  <main class="faq flex flex-col w-full min-h-screen bg-cover bg-center p-8" :style="{ 'background-image': `url(${imgUrl})` }">
    <div class="bg-slate-200 bg-opacity-80 p-8 rounded-lg shadow-lg">
      <h1 class="text-4xl font-bold mb-8 text-center text-slate-800">Frequently Asked Questions</h1>
      <div v-for="(qa, index) in faqList" :key="index" class="mb-6">
        <h2 class="text-2xl font-semibold mb-2 text-slate-700">{{ qa.question }}</h2>
        <p class="text-lg text-slate-600">{{ qa.answer }}</p>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import imgUrl from '/login_bg.jpg'

const faqList = ref([
  { question: 'What is mySatchel?', answer: 'mySatchel is a revolutionary app for formulating and managing your projects.' },
  { question: 'How do I sign up?', answer: 'You can sign up by clicking the "Register" button on the login page.' },
  { question: 'Is there a free trial?', answer: 'Yes, we offer a 14-day free trial for new users.' },
  // Add more questions and answers as needed
])
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
}

.faq {
  min-height: 100vh;
  background-size: cover;
  background-position: center;
}

</style>