<template>
  <div class="comparison-table">
    <h2 class="text-3xl font-bold mb-4">Why Choose mySatchel?</h2>
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="border p-4 text-lg font-bold">Feature</th>
          <th class="border p-4 text-lg font-bold">mySatchel</th>
          <th class="border p-4 text-lg font-bold">Spreadsheets</th>
          <th class="border p-4 text-lg font-bold">Other Calculators</th>
        </tr>
      </thead>
      <tbody>
        <ComparisonRow
          feature="Persistent Ingredients"
          mySatchel="checked"
          spreadsheets="checked"
          otherCalculators="unchecked"
        />
        <ComparisonRow
          feature="Interactive Price Updates"
          mySatchel="checked"
          spreadsheets="checked"
          otherCalculators="unchecked"
        />
        <ComparisonRow
            feature="Print friendly formulas"
            mySatchel="checked"
            spreadsheets="unchecked"
            otherCalculators="checked"
        />
        <ComparisonRow
          feature="User-Friendly Interface"
          mySatchel="checked"
          spreadsheets="unchecked"
          otherCalculators="unchecked"
        />
        <ComparisonRow
          feature="Drag and drop ingredients"
          mySatchel="checked"
          spreadsheets="unchecked"
          otherCalculators="unchecked"
        />
        <ComparisonRow
          feature="Automatically ordered Inci List"
          mySatchel="checked"
          spreadsheets="unchecked"
          otherCalculators="unchecked"
        />
        <ComparisonRow
          feature="Category based ingredient search"
          mySatchel="checked"
          spreadsheets="unchecked"
          otherCalculators="unchecked"
        />
        <!-- Add more rows as needed -->
      </tbody>
    </table>
  </div>
</template>

<script setup>
import ComparisonRow from './ComparisonRow.vue'
</script>

<style scoped>
.comparison-table {
  margin: 2rem 0;
}
</style>