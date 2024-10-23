<template>
    <div>
        <button @click="getAlert">Alert</button>
        <h3 v-if="message">Received message: {{ props.message }} </h3>
    </div>
</template>

<script lang="ts" setup>

    
    const emits = defineEmits(["pressed"]);

    function getAlert() {
        emits("pressed", "info from HelloWorld component");
    }

    interface props {
        message?: string;
    }
    const props = withDefaults(defineProps<props>(),{
        message: ""
    });
</script>