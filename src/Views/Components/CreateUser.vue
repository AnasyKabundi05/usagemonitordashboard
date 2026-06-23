<script setup>
import { ref } from "vue";

const name = ref("");
const email = ref("");
const output = ref("");

async function createUser() {
  const response = await fetch("http://35.172.27.21:8080/api/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name.value,
      email: email.value
    })
  });

  const data = await response.json();
  output.value = JSON.stringify(data, null, 2);
}

</script>

<template>
  <div class="container">
    <h1 class="title">
      ⚡ Smart Home Usage Monitor
    </h1>

    <h2>Create User</h2>

    <input v-model="name" placeholder="Name" />
    <input v-model="email" placeholder="Email" />

    <button @click="createUser">Create User</button>

    <br>

    <router-link to="/usage"><button>View Usage</button></router-link>

    <br>

    <router-link to="/manageUsage"><button>Manage Usage</button></router-link>

    <pre>{{ output }}</pre>
  </div>
</template>

<style scoped>
/* Full-page dark blue background */
:global(body) {
  background-color: #0a1a3a;
  margin: 0;
  font-family: Arial, sans-serif;
  color: white;
}

/* Centered container */
.container {
  max-width: 500px;
  margin: 60px auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(6px);
}

/* Title styling */
.title {
  display: flex;
  align-items: center;
  font-size: 28px;
  font-weight: bold;
  color: #ffeb3b; /* yellow lightning bolt color */
  gap: 10px;
  margin-bottom: 20px;
}

/* Inputs */
input {
  display: block;
  width: 100%;
  margin: 12px 0;
  padding: 10px;
  border-radius: 6px;
  border: none;
  outline: none;
}

/* Green button */
button {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  transition: 0.2s;
}

button:hover {
  background-color: #27ae60;
}

/* Output box */
pre {
  background: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 6px;
  margin-top: 20px;
  white-space: pre-wrap;
}
</style>
