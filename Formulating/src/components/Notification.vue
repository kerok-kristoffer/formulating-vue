<template>
      <div
        v-if="notification.show"
        class="fixed w-[300px] left-4 bottom-4 py-2 px-4 text-white animate-fade-in-down"
        :class="[notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500']"
    >
    {{ notification.message }}
  </div>
</template>


<script setup>

    import {computed, ref, onMounted } from "vue";
    import { useAccountStore } from "../stores/account";

    const store = useAccountStore();
    const tags = ref(["hello", "world"])

    const notification = computed(() => store.notification);
</script>

<script setup>

    
    
    </script>
    
    <style scoped>
    
        .tag-input {
            width: 100%;
            border: 1px solid #eee;
            font-size: 0.9em;
            height: 50px;
            box-sizing: border-box;
            padding: 0 10px;
        }
    
        .tag-input__tag {
            height: 30px;
            float: left;
            margin-right: 10px;
            background-color: #eee;
            margin-top: 10px;
            line-height: 30px;
            padding: 0 5px;
            border-radius: 5px;
        }
    
        .tag-input__tag > span {
            cursor: pointer;
            opacity: 0.75;
        }
    
        .tag-input__text {
            border: none;
            outline: none;
            font-size: 0.9em;
            line-height: 50px;
            background: none;
        }
    
    </style>