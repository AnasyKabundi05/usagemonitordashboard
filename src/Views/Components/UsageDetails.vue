<script setup>
import { ref } from "vue";

const usageLogId = ref("");
const usageLog = ref(null);
const appliance = ref(null);
const recommendations = ref([]);
const loading = ref(false);
const error = ref("");

async function loadAll() {
  loading.value = true;
  error.value = "";
  usageLog.value = null;
  appliance.value = null;
  recommendations.value = [];

  try {
    if (!usageLogId.value) throw new Error("Please enter a Usage Log ID");

    // 1. Load usage log
    const logRes = await fetch(`http://localhost:8080/api/usageLog/${usageLogId.value}`);
    if (!logRes.ok) throw new Error("Usage log not found");
    usageLog.value = await logRes.json();

    // Extract applianceId safely
    const applianceId =
        usageLog.value.applianceId ||
        usageLog.value.appliance?.applianceId ||
        usageLog.value.appliance_id;

    // 2. Load appliance details
    if (applianceId) {
      const appRes = await fetch(`http://localhost:8080/api/appliance/${applianceId}`);
      if (appRes.ok) {
        appliance.value = await appRes.json();
      }
    }

    // 3. Load recommendations for this usage log
    const recRes = await fetch(`http://localhost:8080/api/recommendation/${usageLogId.value}`);
    if (!recRes.ok) throw new Error("Recommendations not found");
    recommendations.value = await recRes.json();

  } catch (err) {
    error.value = err.message;
  }

  loading.value = false;
}
</script>

<template>
  <div class="container">
    <h1 class="title">⚡ Usage Log Details</h1>

    <input v-model="usageLogId" placeholder="Enter Usage Log ID" />
    <button @click="loadAll">Load Details</button>

    <p v-if="loading">Loading...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- Usage Log -->
    <div v-if="usageLog" class="box">
      <h2>Usage Log</h2>
      <p><strong>Hours Used:</strong> {{ usageLog.hoursUsed }} hours</p>
      <p><strong>Date:</strong> {{ usageLog.date }}</p>
      <p><strong>Energy (kWh):</strong> {{ usageLog.calculatedKwh }} kWh</p>
      <p><strong>Cost:</strong> €{{ usageLog.calculatedCost }}</p>
    </div>

    <!-- Appliance -->
    <div v-if="appliance" class="box">
      <h2>Appliance</h2>
      <p><strong>Name:</strong> {{ appliance.name }}</p>
      <p><strong>Type:</strong> {{ appliance.type }}</p>
      <p><strong>Location:</strong> {{ appliance.location }}</p>
      <p><strong>Power:</strong> {{ appliance.powerWatts }} W</p>
    </div>

    <!-- Recommendations -->
    <div v-if="recommendations.length > 0" class="box">
      <h2>Recommendations</h2>
      <div v-for="rec in recommendations" :key="rec.recommendationId">
        <p><strong>{{ rec.message }}</strong></p>
        <p>Potential Savings: {{ rec.potentialSavings }} kWh</p>
        <hr />
      </div>
    </div>
  </div>
</template>

<style scoped>
:global(body) {
  background-color: #0a1a3a;
  margin: 0;
  font-family: Arial, sans-serif;
  color: white;
}

.container {
  max-width: 600px;
  margin: 60px auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(6px);
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #ffeb3b;
  margin-bottom: 20px;
}

input {
  width: 100%;
  margin: 12px 0;
  padding: 10px;
  border-radius: 6px;
  border: none;
}

button {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #27ae60;
}

.error {
  color: #ff6b6b;
  margin-top: 10px;
}

.box {
  margin-top: 20px;
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 8px;
}
</style>
