<template>
  <main class="exit-survey flex flex-col w-full h-full bg-slate-300 p-4">
    <div class="my-auto
    mx-0 md:mx-24 flex flex-col md:pt-96 pb-72 md:pb-72
    bg-slate-300 bg-opacity-40
    h-full md:h-4/5 md:w-3/5 w-full">
      <section class="survey bg-slate-200 shadow-lg shadow-slate-500 p-5
      md:p-8 rounded-b-md md:rounded-md md:mx-12">
        <h2 class="font-semibold mx-2">We're sorry to see you go</h2>
        <form class="flex flex-col survey-form justify-end" @submit.prevent="submitSurvey">
          <div class="flex flex-col w-full">
            <label class="my-2">We’d love to hear your feedback so we can make mySatchel better for you and others. Could you take a moment to let us know why you’re canceling?</label>
            <div class="flex flex-col">
              <label class="my-1">
                <input type="radio" v-model="selectedReason" value="Too expensive" /> Too expensive
              </label>
              <label class="my-1">
                <input type="radio" v-model="selectedReason" value="Not using it enough" /> Not using it enough
              </label>
              <label class="my-1">
                <input type="radio" v-model="selectedReason" value="Found a better alternative" /> Found a better alternative
              </label>
              <label class="my-1">
                <input type="radio" v-model="selectedReason" value="Technical issues" /> Technical issues
              </label>
              <label class="my-1">
                <input type="radio" v-model="selectedReason" value="Other" /> Other
              </label>
            </div>
          </div>
          <div class="flex flex-col w-full mt-4">
            <label class="my-2">Additional feedback (optional):</label>
            <p class="text-sm italic pl-6">
              <ul class="list-disc decoration-slate-400 ">
                <li>What did you like most about mySatchel?</li>
                <li>What could we improve?</li>
                <li>Was there anything specific that led to your decision to cancel?</li>
                <li>Is there a feature or service we’re missing that would have kept you subscribed?</li>
              </ul>
              </p>
            <textarea v-model="feedback" class="w-full p-2 my-2 border rounded-md"></textarea>
            <p class="text-sm">Your feedback is confidential and will be used to improve mySatchel. Thank you for your time and valuable feedback! We hope to serve you again in the future.</p>
          </div>
          <div class="w-full flex flex-row justify-end mt-4">
            <input class="flex bg-slate-300 h-8 mx-2 px-2 rounded-md hover:cursor-pointer hover:bg-slate-400" value="Submit" type="submit" />
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useAccountStore } from '@/stores/account'
import axios from 'axios'

const selectedReason = ref('')
const feedback = ref('')
const account = useAccountStore()

const submitSurvey = async () => {
  const surveyData = {
    reason: selectedReason.value,
    message: feedback.value
  }

  axios.post('survey', surveyData).then(() => {
    console.log('Survey submitted:', surveyData)
    account.logout()
  }).catch((error) => {
    console.error('Error submitting survey:', error)
  })
}
</script>

<style>
@media (min-width: 1024px) {
  .exit-survey {
    display: flex;
    align-items: center;
  }
}
</style>