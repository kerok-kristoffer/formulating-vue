<template>
  <div
    id="front-page-container"
    class="flex flex-col w-full h-full bg-cover bg-scroll justify-around"
  >
    <!-- <img class="w-full h-5/5" src="../assets/Front-page-bg-sample-2.PNG" alt=""> -->
    <div class="flex flex-row justify-start">
      <div class="bg-slate-300 bg-opacity-40 ml-24 h-4/5 md:w-1/2 pb-36">
        <div class="px-36 py-12 flex flex-col justify-around text-lg">
          <img class="mb-4 h-44 w-96" src="../assets/mySatchel_logo_plain.png" alt="mySatchel" />
          <p class="mx-12 pt-2 font-extrabold text-3xl">Coming Winter 2023/2024</p>
          <p class="mx-12 py-4">
            mySatchel is a purpose built tool for natural skincare formulators
          </p>
          <p class="mx-12">under construction...</p>

          <input
            type="text"
            class="mt-52 rounded-md my-1 border-2 border-slate-400"
            placeholder="First Name"
          />
          <div class="flex flex-row mb-24">
            <input
              type="email"
              class="w-3/5 border-2 border-slate-400 border-r-0 rounded-l-md my-1"
              placeholder="Enter your email address"
            />
            <input
              type="button"
              class="w-2/5 bg-slate-300 border-2 border-l-0 border-slate-400 rounded-r-md h-11 my-1 px-2"
              value="Beta coming soon!"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style>
#front-page-container {
  background-image: url('../assets/fp-bg-v1.png');
}
</style>
