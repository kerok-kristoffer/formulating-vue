<template>
  <div class="overlay">
    <div class="overlay-content">
      <button @click="$emit('close')" class="close-button">X</button>
      <h2>Upgrade to Pro</h2>
      <p>Unlock all features by upgrading to the Pro version.</p>
      <!-- Add your Stripe pricing table here -->
      <div class="pricing-table">
        <!-- Example pricing table content -->
        <div class="pricing-option">
          <h3>Pro Plan</h3>
          <p>$9.99/month</p>
          <button @click="redirectToStripe">Subscribe</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const redirectToStripe = () => {
  // Redirect to your Stripe checkout page
  window.location.href = 'https://your-stripe-checkout-url';
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-content {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  position: relative;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.pricing-table {
  margin-top: 1rem;
}

.pricing-option {
  margin-bottom: 1rem;
}
</style>