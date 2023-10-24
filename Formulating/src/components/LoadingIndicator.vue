<template>
  <div class="content-loading">
    <div class="spinner"></div>
    <p>Loading...</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingIndicator'
}
</script>

<style scoped>
.content-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #cbd5e1;
  border-top: 4px solid #64748b;
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
