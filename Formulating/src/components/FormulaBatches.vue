<script setup lang="ts">
          import { ref, computed, watch, onMounted } from 'vue';
          import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

          const props = defineProps<{
            formulaId: number,
            formulaName: string,
            userData: any // Replace with your actual userData type
          }>();

          const batchesMap = computed(() => props.userData.batches ?? new Map());
          const batches = computed(() => batchesMap.value.get(props.formulaId) ?? []);

          const prefix = ref("");
          const today = ref(new Date().toISOString().slice(0, 10).replace(/-/g, ""));

          function getAbbreviation(name: string): string {
            const cleaned = name.replace(/[(){}[\]\\\/.,:;'"!?@#$%^&*_+=<>|~`-]/g, ' ');
            const words = cleaned.split(/\s+/).filter(Boolean);
            return words.map(word => word[0]?.toUpperCase() ?? '').join('');
          }

          const abbreviation = computed(() => getAbbreviation(props.formulaName));

          let prevAbbreviation = '';

          onMounted(() => {
            prefix.value = abbreviation.value;
            prevAbbreviation = abbreviation.value;
          });

          watch(() => props.formulaName, (newName) => {
            const newAbbreviation = getAbbreviation(newName);
            if (newAbbreviation !== prevAbbreviation) {
              prefix.value = newAbbreviation;
              prevAbbreviation = newAbbreviation;
            }
          });

          function createBatch() {
            const batchName = `${prefix.value}${today.value}`;
            if (!props.userData.batches) props.userData.batches = new Map();
            if (!props.userData.batches.has(props.formulaId)) props.userData.batches.set(props.formulaId, []);
            props.userData.batches.get(props.formulaId).push(batchName);
            if (props.userData.save) props.userData.save();
          }

          function deleteBatch(index: number) {
            const batchList = props.userData.batches?.get(props.formulaId);
            if (batchList) {
              batchList.splice(index, 1);
              if (props.userData.save) props.userData.save();
            }
          }
          </script>

<template>
  <div class="my-4">
    <div class="flex justify-center items-center gap-2">
      <input
        v-model="prefix"
        :placeholder="abbreviation"
        type="text"
        class="border rounded px-2 py-1 w-24"
      />
      <input
        v-model="today"
        class="border rounded px-2 py-1 w-24"
        type="text"
      />
      <button
        @click="createBatch"
        class="bg-slate-400 hover:bg-slate-500 text-white px-3 py-1 rounded font-semibold"
      >
        Make Batch
      </button>
    </div>
    <div v-if="batches.length" class="mt-2">
      <h3 class="font-semibold text-sm mb-1">Batches:</h3>
      <ul class="border-2 border-slate-400 rounded overflow-hidden">
        <li
          v-for="(batch, idx) in batches"
          :key="batch"
          class="flex items-center justify-between text-sm even:bg-slate-300 odd:bg-slate-100 px-3 py-0.5"
        >
          <span class="truncate">{{ batch }}</span>
          <font-awesome-icon
              @click="deleteBatch(idx)"
              :icon="['fa', 'circle-xmark']"
              v-tooltip="'delete batch'"
              class="my-1 hover:cursor-pointer flex hover:text-red-500 text-slate-500 text-md"
          />
        </li>
      </ul>
    </div>
  </div>
</template>