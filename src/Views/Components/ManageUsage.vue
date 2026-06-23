<script setup>
import { ref } from "vue";

/* ------------------ ADD APPLIANCE ------------------ */
const userId = ref("");
const appName = ref("");
const appType = ref("");
const appPower = ref("");
const appLocation = ref("");

const applianceSuccess = ref("");
const applianceError = ref("");

async function addAppliance() {
  applianceSuccess.value = "";
  applianceError.value = "";

  try {
    const res = await fetch(`http://35.172.27.21:8080/api/appliance/user/${userId.value}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: appName.value,
        type: appType.value,
        powerWatts: Number(appPower.value),
        location: appLocation.value
      })
    });

    if (!res.ok) throw new Error("Failed to add appliance");

    const data = await res.json();
    applianceSuccess.value = `Appliance '${data.name}' added successfully`;
  } catch (err) {
    applianceError.value = err.message;
  }
}

/* ------------------ ADD USAGE LOG ------------------ */
const applianceId = ref("");
const hoursUsed = ref("");
const date = ref("");

const usageSuccess = ref("");
const usageError = ref("");

const recommendations = ref([]);

async function addUsage() {
  usageSuccess.value = "";
  usageError.value = "";
  recommendations.value = [];

  try {
    const res = await fetch(`http://35.172.27.21:8080/api/usageLog/appliance/${applianceId.value}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hoursUsed: Number(hoursUsed.value),
        date: date.value
      })
    });

    if (!res.ok) throw new Error("Failed to add usage log");

    const usage = await res.json();
    usageSuccess.value = `Usage log created (ID: ${usage.usageLogId})`;

    const recRes = await fetch(`http://35.172.27.21:8080/api/recommendation/usage/${usage.usageLogId}`);
    if (recRes.ok) {
      recommendations.value = await recRes.json();
    }

  } catch (err) {
    usageError.value = err.message;
  }
}
</script>

<template>
  <div class="container">

    <h1 class="title">⚡ Manage Appliances & Usage</h1>

    <!-- ADD APPLIANCE -->
    <div class="box">
      <h2>Add Appliance</h2>

      <input v-model="userId" placeholder="User ID" />
      <input v-model="appName" placeholder="Appliance Name" />
      <input v-model="appType" placeholder="Type (Electric, Gas...)" />
      <input v-model="appPower" placeholder="Power (Watts)" />
      <input v-model="appLocation" placeholder="Location (Kitchen...)" />

      <button @click="addAppliance">Add Appliance</button>

      <p v-if="applianceSuccess" class="success">{{ applianceSuccess }}</p>
      <p v-if="applianceError" class="error">{{ applianceError }}</p>
    </div>

    <!-- ADD USAGE -->
    <div class="box">
      <h2>Add Usage Log</h2>

      <input v-model="applianceId" placeholder="Appliance ID" />
      <input v-model="hoursUsed" placeholder="Hours Used" />
      <input v-model="date" type="date" />

      <button @click="addUsage">Add Usage</button>

      <p v-if="usageSuccess" class="success">{{ usageSuccess }}</p>
      <p v-if="usageError" class="error">{{ usageError }}</p>
    </div>

    <!-- RECOMMENDATIONS -->
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
  max-width: 700px;
  margin: 60px auto;
  padding: 20px;
}

.title {
  font-size: 30px;
  font-weight: bold;
  color: #ffeb3b;
  margin-bottom: 30px;
  text-align: center;
}

.box {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  backdrop-filter: blur(6px);
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
  width: 100%;
}

button:hover {
  background-color: #27ae60;
}

.success {
  color: #2ecc71;
}

.error {
  color: #ff6b6b;
}
</style>
