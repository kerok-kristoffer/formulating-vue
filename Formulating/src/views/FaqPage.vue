<template>
  <main
    class="faq flex flex-col w-full min-h-screen bg-cover bg-center p-8 items-center"
    :style="{ 'background-image': `url(${imgUrl})` }"
  >
    <div class="bg-slate-300 p-8 w-5/6 rounded-lg shadow-lg">
      <h1 class="text-4xl font-bold mb-8 text-center text-slate-800">Frequently Asked Questions</h1>
      <div v-for="(qa, index) in faqList" :key="index" class="mb-6">
        <div class="bg-slate-200 bg-opacity-60 p-4 rounded-lg">
          <h2 class="text-2xl font-semibold mb-2 text-slate-700">{{ qa.question }}</h2>
          <p class="text-lg text-slate-600">{{ qa.answer }}</p>
        </div>
      </div>
    </div>

    <!-- Social Media Section -->
    <section class="text-center w-full lg:w-auto lg:p-4 mt-4 bg-slate-200 bg-opacity-80 rounded">
      <h2 class="text-2xl lg:text-3xl font-semibold mb-4">Contact us!</h2>
      <div class="flex justify-center space-x-4">
        <a
          href="https://instagram.com/mysatchel"
          target="_blank"
          class="text-slate-500 hover:text-slate-600"
        >
          <font-awesome-icon :icon="faInstagram" class="w-8 h-8"></font-awesome-icon>
        </a>
        <a
          href="https://www.facebook.com/people/MySatchel/100089960321251/"
          target="_blank"
          class="text-slate-500 hover:text-slate-600"
        >
          <font-awesome-icon :icon="faFacebookF" class="w-8 h-8"></font-awesome-icon>
        </a>
        <a
          href="https://www.youtube.com/@mySatchelApp/videos"
          target="_blank"
          class="text-slate-500 hover:text-slate-600"
        >
          <font-awesome-icon :icon="faYoutube" class="w-8 h-8"></font-awesome-icon>
        </a>
      </div>
      <a href="mailto:support@mysatchel.app" class="text-slate-500 underline"
        >support@mysatchel.app</a
      >
    </section>

    <!-- Floating div for already signed up notice -->
    <div
      class="hidden md:block fixed top-4 right-4 bg-slate-200 bg-opacity-90 p-4 rounded-lg shadow-lg"
    >
      <button
        @click="goToHome"
        class="bg-slate-400 text-white rounded-md p-2 hover:bg-slate-500 w-full"
      >
        Return
      </button>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import imgUrl from '/login_bg.jpg'
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import router from '@/router'

const goToHome = () => {
  router.push('/')
}

const faqList = ref([
  {
    question: 'What is mySatchel?',
    answer:
      'mySatchel is an online formulating calculator that aims to become the go to helper for all your formulating needs.'
  },
  { question: 'Is there a free trial?', answer: 'Yes, we offer a 7-day free trial for new users.' },
  {
    question: 'Can I purchase the app outright instead of subscribing?',
    answer:
      'mySatchel operates as a subscription-based web app to ensure continuous updates, cross-platform accessibility, and ongoing customer support. This model allows us to provide new features and improvements regularly.'
  },
  {
    question: 'Does the app include essential oils and carrier oils in its INCI system?',
    answer:
      'Currently, the app allows users to manually add INCIs, and the app will sort and organize them by percentage in your formulas for easy reference. We’re in discussions with library providers to implement automated suggestions. If you have any questions, you can reach out to us through our email or social media platforms.'
  },
  {
    question: 'How is my data protected?',
    answer:
      'Data security is a top priority for us. All data is stored on secure AWS servers. We are also working on optional client-side encryption and backup exports to provide even greater privacy for advanced users. These features are coming soon as we gather feedback and prioritize user needs.'
  },
  {
    question: 'What happens after the free 7-day trial?',
    answer:
      'You will be prompted to subscribe via Stripe to choose the subscription that best fits your needs. You can cancel at any time through the Stripe portal and all your work will be saved for your access if you sign up again at a later date.'
  },
  {
    question: 'Is there a mobile app available?',
    answer:
      'mySatchel is currently a web app, accessible via your browser on desktops, tablets, and phones. While it’s designed for larger screens, many users find it convenient to use on their phones for quick updates or access on the go. We’re considering a dedicated mobile app in the future.'
  },
  {
    question: 'What features are planned for the future',
    answer:
      'We want to make mySatchel into the go to app for all your formulating needs. Currently in the works are client side encryption, spreadsheet imports and exports of data to .csv, auto generated Inci suggestions for your ingredients and direct cost support for liquid measurements. In the long run we hope to include an inventory management system, formula sharing functionality and more integrations with other formulating tools.'
  },
  {
    question: 'How can I provide feedback or suggestions?',
    answer:
      'We value your input! Use the feedback button within the app to share your thoughts or contact us directly via email or social media. Your suggestions are vital in helping us tailor mySatchel to meet the needs of formulators like you.'
  },
  {
    question: 'How can I learn more about how to use mySatchel',
    answer:
      'Follow us on our social media pages and visit our Youtube channel for an expanding list of tutorials for our basic functionality.'
  }
  // Add more questions and answers as needed
])
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
}

.faq {
  min-height: 100vh;
  background-size: cover;
  background-position: center;
}
</style>
