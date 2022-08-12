<template>
    <div class="drop-zone" 
            @drop="onDrop($event, 1)"
            @dragenter.prevent
            @dragover.prevent
            >
        <h2>Recipe</h2>
        <div 
            v-for="item in getList(1)" 
            :key="item.id" 
            class="drag-el" 
            draggable="true"
            @dragstart="startDrag($event, item)"
        >
            {{ item.title }}
        </div>
    </div>
    <div class="drop-zone" >
            <h2>Ingredients</h2>
        <div 
            v-for="item in getList(2)" 
            :key="item.id" 
            class="drag-el"
            draggable="true"
            @dragstart="startDrag($event, item)"
        >
            {{ item.title }}
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'

export default {
    setup() {
        const items = ref([
            { id:0, title: 'Water', list: 1},
            { id:1, title: 'Fire', list: 1},
            { id:2, title: 'Earth', list: 2},
            { id:3, title: 'Fire', list: 2},
        ])

        const getList = (list) => {
            return items.value.filter((item) => item.list == list)
        }

        const startDrag = (event, item) => {
            console.log(item)
            event.dataTransfer.dropEffect = 'move'
            event.dataTransfer.effectAllowed = 'move' // change to copy for our purposes?
            event.dataTransfer.setData('itemId', item.id)
        }

        const onDrop = (event, list) => {
            const itemID = event.dataTransfer.getData('itemID')
            const item = items.value.find((item) => item.id == itemID)
            item.list = list
        }

        return {
            getList,
            startDrag,
            onDrop
        }
    }
}
</script> 

<style>
.drop-zone {
    width: 50%;
    margin: 50px auto;
    background-color: #ecf0f1;
    padding: 10px;
    min-height: 10px;
}

.drag-el {
    background-color: #3498db;
    color: white;
    padding: 5px;
    margin-bottom: 10px;
}

.drag-el:nth-last-of-type() {
    margin-bottom: 0;
}

</style>

