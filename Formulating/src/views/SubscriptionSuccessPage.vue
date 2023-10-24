<template>
  <div class="flex flex-col w-1/2 mx-auto">
    <div class="flex flex-row h-96"></div>
    <div class="profile bg-slate-200 p-3 rounded-md">
      <h1 class="text-lg font-bold">Success</h1>
      <h2>Thanks for your order!</h2>
      <p>Subscription to mySatchel Beta successful!</p>
      <p>
        Start formulating by
        <RouterLink class="bg-slate-300 hover:bg-slate-400 px-1 h-8 rounded-md py-1" to="login"
          >logging in!</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
