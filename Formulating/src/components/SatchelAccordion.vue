<template>

    <div v-show="!isOpen" class=""></div>
      <button
        @click="toggleAccordion()"
        class="flex items-center space-x-3"
        :aria-expanded="isOpen"
        :aria-controls="'collapse'"
      >
        <slot name="title" />
        <svg
          class="self-end w-3 transition-all duration-200 transform"
          :class="{
            'rotate-180': isOpen,
            'rotate-270': !isOpen,
          }"
          fill="none"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 10"
          aria-hidden="true"
        >
          <path
            d="M15 1.2l-7 7-7-7"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
  
      <div v-show="isOpen" :id="'collapse'">
        <slot name="content" />
      </div>
  </template>
  
  <script setup lang="ts">

  import { ref } from 'vue'

  const isOpen = ref(false)

  const toggleAccordion = () => {
    console.log(isOpen)
        isOpen.value = !isOpen.value;
  } 
  </script>