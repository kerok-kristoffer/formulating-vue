<script lang="ts" setup>
    import HelloWorld from "./components/HelloWorld.vue";
    import { ref, reactive } from 'vue';

    let messageToChildComponent = "Hello";
    let x = ref(0);
    let y = ref(0);
    let showExamples = ref(true);
    let url = "http://kerok.tech";

    type Tuple = [number, string, boolean]
    type OptionalTuple = [string?, boolean?]

    const arr: Tuple = [1, "2", true] // Tuple requires types on initialization
    arr.push(3)
    arr.push("4")
    arr.push(false)
    const arr2: OptionalTuple = [] // OptionalTuple allows empty init (using <>?)
    //arr2.push(1) // OptionalTuple does not let us push numbers
    arr2.push("2")
    arr2.push(true)


    interface BookInfo {
        title: string;
        author: string;
        isFav: boolean;
        // [key: string]: any; // adds possibilty to use extra loosely typed props for impls like below
    }
    const pc: BookInfo = reactive({
        title: "Psycho Cybernetics", author: "Maxwell Maltz", isFav: true 
    })

    let books: BookInfo[] = [
        reactive({title: "War of Art", author: "Steven Pressfield", isFav: true, /* extra: "hey!" */}),
        pc,
        reactive({
        title: "Millionaire Fastlane", author: "MJ DeMarco", isFav: true
        }),
    ];
 
    const handleMouseMove = (e: MouseEvent) => {
        x.value = e.offsetX;
        y.value = e.offsetY;
    }
    const toggleShow = () => {
        showExamples.value = !showExamples.value;
    }
    const toggleFav = (book: BookInfo) :void => {
        book.isFav = !book.isFav;
    }
    const pressed = (info: string) => {
        alert("Hello From Pressed Function with: " + info);
    }

    let pokemon = ref(null) as any;
    async function asyncPressed() {
        const info = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
        const json = await info.json();
        pokemon.value = json;
    }

</script>

<template>
    <body>
        <div class="main">
            <div class="showExample">
                <button @click="toggleShow">toggle</button>
                <div class="show" v-show="showExamples">
                                
                    <div id="mouseMoveExample">
                        <div class="box" @mousemove="handleMouseMove">{{x}} {{y}}</div>
                    </div>

                    <div id="attribute-binding-example">
                        <a v-bind:href="url">link</a> <br>
                        <a :href="url">link</a>
                    </div>

                    <div class="books" id="list-example">
                        <ul>
                            <li v-for="book in books" :class="{fav: book.isFav}" @click="toggleFav(book)">
                                <h3>{{ book.title }}</h3>
                                <p>{{ book.author }}</p>
                            </li>
                        </ul>
                    </div>

                    <div id="componentExample">
                        <HelloWorld :message="messageToChildComponent" @pressed="pressed" />

                        <HelloWorld @pressed="asyncPressed" />
                        <div v-if="pokemon">
                            <img :src="pokemon.sprites.back_default" alt="">
                        </div>
                    </div>

                </div>
            </div>

        </div>

        
    </body>
</template>

<style>

    .body {
        background: #eee;
        max-width: 960px;
        margin: 20px auto;
    }

    .books {
        background: #eee;
    }

    p, h3, ul {
        margin: 0;
        padding: 0;
    }
    li {
        list-style-type: none;
        background: #ddd;
        margin: 20px auto;
        padding: 10px 20px;
        border-radius: 10px;
        
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    li.fav {
        background: #ccc;
    }

    .box {
        padding: 100px 0;
        width: 400px;
        text-align: center;
        background: #ddd;
        margin: 20px;
        display: inline-block
    }


</style>