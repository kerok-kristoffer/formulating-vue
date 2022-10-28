<template>
    <div class="tag-input">
        <div 
            v-for="tag, index in tags"
            :key="tag"
            class="tag-input__tag">

            <span>x</span>
            {{ tag }}
        </div>
        <input
            type="text"
            placeholder="Enter a tag"
            class="tag-input__text"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const tags = ref([])
onMounted(async () => {
    tags.value = ["hello", "world"]
    console.log(tags.value)
})


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
