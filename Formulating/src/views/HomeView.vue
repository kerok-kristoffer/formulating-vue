<template>
  <main
    class="home flex flex-col w-full min-h-screen bg-cover bg-center"
    :style="{ 'background-image': `url(${imgUrl})` }"
  >
    <div
      class="flex flex-col items-center justify-center min-h-screen bg-opacity-60 bg-slate-300 p-4 lg:p-8"
    >
      <!-- Hero Section -->
      <section
        class="text-center mb-8 w-full px-4 lg:w-auto lg:px-0 flex flex-row items-center justify-center space-x-2"
      >
        <h1 class="text-4xl font-bold">
          Welcome to
          <img
            src="@/assets/mySatchel_text.png"
            alt="mySatchel"
            @click="goToFree"
            class="inline-block h-10 align-middle pb-2 pl-0 ml-0"
          />
        </h1>
      </section>
      <section
        class="text-center mb-12 w-full px-4 lg:w-auto lg:px-0 flex flex-row items-center justify-center space-x-4"
      >
        <h2 class="text-2xl lg:text-3xl font-bold mb-4">
          Take full advantage of mySatchel with our beta version.
        </h2>
        <RouterLink
          to="/beta"
          class="bg-slate-500 text-white rounded-md py-2 px-4 mb-4 hover:bg-slate-600"
          >Try the Beta 7 days for FREE!</RouterLink
        >
      </section>

      <!-- Features Section -->
      <section class="text-center mb-16 w-full px-4 lg:w-auto lg:px-0">
        <h2 class="text-2xl lg:text-3xl font-semibold mb-4">Why Choose Us?</h2>
        <div class="flex flex-col lg:flex-row justify-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div class="w-full lg:max-w-xs p-4 bg-white rounded-lg shadow-md">
            <img
              src="../assets/feature_calc.jpg"
              alt="Feature 1"
              class="w-full h-32 object-cover mb-4 custom-lower-position"
            />
            <h3 class="text-lg lg:text-xl font-bold mb-2">Automated Calculations</h3>
            <p class="text-gray-600">
              mySatchel takes care of calculating percentages and costs so you don't have to, every
              time you re-calculate a formula
            </p>
          </div>
          <div class="w-full lg:max-w-xs p-4 bg-white rounded-lg shadow-md">
            <img
              src="../assets/feature_dragdrop2.png"
              alt="Feature 2"
              class="w-full h-32 object-cover mb-4"
            />
            <h3 class="text-lg lg:text-xl font-bold mb-2">Drag and drop</h3>
            <p class="text-gray-600">
              Reuse Ingredients for new Formulas by dragging and dropping them from your list of
              ingredients to the Phase you are working on
            </p>
          </div>
          <div class="w-full lg:max-w-xs p-4 bg-white rounded-lg shadow-md">
            <img
              src="../assets/feature_print.jpeg"
              alt="Feature 3"
              class="w-full h-32 object-cover mb-4 custom-lower-position-80"
            />
            <h3 class="text-lg lg:text-xl font-bold mb-2">Print friendly formats</h3>
            <p class="text-gray-600">
              mySatchel comes out of the box with a print friendly page that is adaptable for your
              needs. You can choose to include your notes or your automatically generated and sorted
              Inci list.
            </p>
          </div>
        </div>
      </section>

      <section class="text-center mb-16 w-full px-4 lg:w-auto lg:px-0">
        <p class="text-2xl lg:text-3xl font-bold mb-4">Start formulating with our basic calculator now!</p>
        <RouterLink
            to="/"
            class="bg-slate-500 text-white rounded-md py-2 px-4 mb-4 hover:bg-slate-600"
        >Try the Free Calculator</RouterLink>
      </section>

      <!-- Testimonials Section -->
      <section class="text-center mb-16 w-full px-4 lg:w-auto lg:px-0">
        <h2 class="text-2xl lg:text-3xl font-semibold mb-4">What Our Users Say</h2>
        <div
          class="flex flex-col lg:flex-row lg:flex-wrap justify-center space-y-4 lg:space-y-0 lg:space-x-4"
        >
          <div class="w-full lg:max-w-xs p-4 bg-white rounded-lg shadow-md">
            <p class="text-gray-600 mb-4">
              "Math being not my favorite thing and spread sheets just a headache for me- mySatchel
              has made all my formulating a breeze.
            </p>
            <p class="text-gray-600 mb-4">
              I love getting a quick estimate in price and that I can tweak my formula as I go
              easily without having to redo every bit of math I have worked out.
            </p>
            <p class="text-gray-600 mb-4">mySatchel is the answer to my formulating needs."</p>
            <h3 class="text-lg lg:text-xl font-bold">- Beta User</h3>
          </div>
          <!--          <div class="w-full lg:max-w-xs p-4 bg-white rounded-lg shadow-md">-->
          <!--            <p class="text-gray-600 mb-4">-->
          <!--              "A game-changer for our team. The beta version is fantastic."-->
          <!--            </p>-->
          <!--            <h3 class="text-lg lg:text-xl font-bold">- User 2</h3>-->
          <!--          </div>-->
        </div>
      </section>

<!--      <section class="text-center mb-16 w-full px-4 lg:w-auto lg:px-0">-->
<!--        <div class="p-4 bg-white rounded-lg shadow-md">-->
<!--          <ComparisonTable />-->
<!--        </div>-->
<!--      </section>-->

      <!-- Pricing Section -->
      <section class="text-center mb-16 w-full px-4 lg:w-auto lg:px-0">
        <h2 class="text-2xl lg:text-3xl font-semibold mb-4">Pricing</h2>
        <div class="flex flex-col lg:flex-row justify-center space-y-4 lg:space-y-0 lg:space-x-4">
          <div class="w-full lg:max-w-xs p-4 bg-white rounded-lg shadow-md">
            <h3 class="text-lg lg:text-xl font-bold mb-2">Beta Monthly</h3>
            <p class="text-gray-600 mb-2">$7.5/month</p>
            <p class="text-gray-600 mb-4">Register now to get access to the 7-day free trial!</p>
            <RouterLink
              to="/beta"
              class="bg-slate-500 text-white rounded-md py-2 px-4 hover:bg-slate-600"
              text="Access FREE trial now!"
            ></RouterLink>

            <!--            <stripe-buy-button-->
            <!--              buy-button-id="buy_btn_1QRfN7AyAF7HunP4A1WWcjKA"-->
            <!--              publishable-key="pk_live_51OPmhJAyAF7HunP4jDglwW09eX9oixSs91nlyxRt1VjxIxbmMihTAL2G7tSEwtWNoquaKHjCiY5aeHuLAxyo8AEK00kyKKMDMA"-->
            <!--            >-->
            <!--            </stripe-buy-button>-->
          </div>
          <div class="w-full lg:max-w-xs p-4 bg-white rounded-lg shadow-md">
            <h3 class="text-lg lg:text-xl font-bold mb-2">Beta Yearly</h3>
            <p class="text-gray-600 mb-2">$6.25/month</p>
            <p class="text-gray-600 mb-4">Register now to get access to the 7-day free trial!</p>
            <RouterLink
              to="/beta"
              class="bg-slate-500 text-white rounded-md py-2 px-4 hover:bg-slate-600"
              text="Access FREE trial now!"
            ></RouterLink>
            <!--            <stripe-buy-button-->
            <!--              buy-button-id="buy_btn_1QRfVYAyAF7HunP4tIJ6Hweu"-->
            <!--              publishable-key="pk_live_51OPmhJAyAF7HunP4jDglwW09eX9oixSs91nlyxRt1VjxIxbmMihTAL2G7tSEwtWNoquaKHjCiY5aeHuLAxyo8AEK00kyKKMDMA"-->
            <!--            >-->
            <!--            </stripe-buy-button>-->
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="text-center mb-16 w-full px-4 lg:w-auto lg:px-0">
        <h2 class="text-2xl lg:text-3xl font-semibold mb-4">Have more questions?</h2>
        <RouterLink
          to="/faq"
          class="bg-slate-500 text-white rounded-md py-2 px-4 hover:bg-slate-600"
          >Visit FAQ</RouterLink
        >
        or contact us on social media.
      </section>

      <!-- Social Media Section -->
      <section class="text-center w-full px-4 lg:w-auto lg:px-0">
        <h2 class="text-2xl lg:text-3xl font-semibold mb-4">Follow Us</h2>
        <div class="flex justify-center space-x-4">
          <a
            href="https://instagram.com"
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
      </section>
    </div>

    <!-- Floating div for already signed up notice -->
    <div
      class="hidden md:block fixed top-4 right-4 bg-slate-200 bg-opacity-90 p-4 rounded-lg shadow-lg"
    >
      <p class="text-center mb-2">Already signed up?</p>
      <button
        @click="goToLogin"
        class="bg-slate-400 text-white rounded-md p-2 hover:bg-slate-500 w-full"
      >
        Login
      </button>
    </div>
  </main>
</template>

<script setup>
import { faFacebookF, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons'
import imgUrl from '/mySatchel_bg-3.png'
import { onMounted } from 'vue'
import router from '@/router'
import ComparisonTable from '@/components/ComparisonTable.vue'

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://js.stripe.com/v3/buy-button.js'
  script.async = true
  document.body.appendChild(script)
})

const goToLogin = () => {
  router.push('/login')
}

function goToFree() {
  router.push('/')
}
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
}

h1 img {
  height: 3em; /* Adjust the height to match the font size */
}

.home {
  min-height: 100vh;
  background-size: cover;
  background-position: center;
}
.custom-lower-position {
  object-position: center 65%;
}
.custom-lower-position-80 {
  object-position: center 95%;
}
</style>
