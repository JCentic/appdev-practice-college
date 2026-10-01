<script setup>
import { ref, onMounted } from 'vue';

const healthData = ref(null);
const isLoading = ref(true);
const errorMessage = ref('');

const checkHealth = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const response = await fetch('/api/health');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    healthData.value = data;
  } catch (err) {
    errorMessage.value = err.message || 'Failed to connect to backend server';
    healthData.value = null;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  checkHealth();
});
</script>

<template>
  <main class="app-container">
    <div class="card">
      <header class="header">
        <div class="badge">Phase 01</div>
        <h1 class="title">Campus Equipment Borrowing System</h1>
        <p class="subtitle">Monolithic Architecture Scaffolding & Health Check</p>
      </header>

      <section class="status-section">
        <div v-if="isLoading" class="status-box loading">
          <span class="spinner"></span>
          <p>Connecting to backend API...</p>
        </div>

        <div v-else-if="errorMessage" class="status-box error">
          <div class="status-header">
            <span class="indicator-dot error-dot"></span>
            <span class="status-title">Backend connection failed</span>
          </div>
          <p class="status-detail">{{ errorMessage }}</p>
          <button class="action-btn retry-btn" @click="checkHealth">Retry Connection</button>
        </div>

        <div v-else-if="healthData" class="status-box success">
          <div class="status-header">
            <span class="indicator-dot success-dot"></span>
            <span class="status-title">Backend connected: {{ healthData.status }}</span>
          </div>
          <p class="status-detail">{{ healthData.message }}</p>
          <div class="meta-info">
            <span>Server Response Time: {{ new Date(healthData.timestamp).toLocaleTimeString() }}</span>
          </div>
          <button class="action-btn refresh-btn" @click="checkHealth">Re-check Connection</button>
        </div>
      </section>

      <footer class="footer">
        <p>Vite + Vue 3 Frontend (Port 5173) ⇄ Express REST API Backend (Port 5000)</p>
      </footer>
    </div>
  </main>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #f8fafc;
  padding: 1.5rem;
  box-sizing: border-box;
}

.card {
  width: 100%;
  max-width: 580px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 1rem;
  padding: 2.25rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
  text-align: center;
}

.header {
  margin-bottom: 2rem;
}

.badge {
  display: inline-block;
  background-color: #3b82f6;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
}

.title {
  font-size: 1.625rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
}

.subtitle {
  font-size: 0.95rem;
  color: #94a3b8;
  margin: 0;
}

.status-section {
  margin: 2rem 0;
}

.status-box {
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.status-box.loading {
  background-color: #1e293b;
  border: 1px dashed #475569;
  color: #94a3b8;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(148, 163, 184, 0.2);
  border-top-color: #38bdf8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status-box.success {
  background-color: rgba(16, 185, 129, 0.12);
  border: 1px solid #059669;
  color: #d1fae5;
}

.status-box.error {
  background-color: rgba(239, 68, 68, 0.12);
  border: 1px solid #dc2626;
  color: #fee2e2;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.indicator-dot {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
}

.indicator-dot.success-dot {
  background-color: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.indicator-dot.error-dot {
  background-color: #ef4444;
  box-shadow: 0 0 8px #ef4444;
}

.status-title {
  font-size: 1.15rem;
  font-weight: 600;
}

.status-detail {
  font-size: 0.9rem;
  color: #cbd5e1;
  margin: 0;
}

.meta-info {
  font-size: 0.8rem;
  color: #94a3b8;
}

.action-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn {
  background-color: #059669;
  color: #ffffff;
}

.refresh-btn:hover {
  background-color: #047857;
}

.retry-btn {
  background-color: #dc2626;
  color: #ffffff;
}

.retry-btn:hover {
  background-color: #b91c1c;
}

.footer {
  border-top: 1px solid #334155;
  padding-top: 1.25rem;
  font-size: 0.8rem;
  color: #64748b;
}

.footer p {
  margin: 0;
}
</style>
