<script setup>
import { ref, onMounted } from 'vue';
import CatalogView from './views/CatalogView.vue';

const isBackendOnline = ref(true);
const checkingHealth = ref(false);

const verifyBackendHealth = async () => {
  checkingHealth.value = true;
  try {
    const response = await fetch('/api/health');
    isBackendOnline.value = response.ok;
  } catch {
    isBackendOnline.value = false;
  } finally {
    checkingHealth.value = false;
  }
};

onMounted(() => {
  verifyBackendHealth();
});
</script>

<template>
  <div class="app-shell">
    <!-- Top Global Header -->
    <header class="app-header">
      <div class="app-header__container">
        <div class="app-brand">
          <div class="app-brand__icon">📦</div>
          <div>
            <h1 class="app-brand__title">Campus Equipment Borrowing System</h1>
            <p class="app-brand__subtitle">College Department Equipment Inventory & Live Status</p>
          </div>
        </div>

        <div class="app-header__meta">
          <span class="phase-pill">Phase 03: Borrow Request Submission</span>
          <div
            class="health-indicator"
            :class="isBackendOnline ? 'health-indicator--online' : 'health-indicator--offline'"
            title="Backend API Connection Status"
            @click="verifyBackendHealth"
          >
            <span class="health-indicator__dot"></span>
            <span class="health-indicator__label">
              {{ isBackendOnline ? 'Express API Online' : 'API Disconnected' }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main View Surface -->
    <main class="app-main">
      <div class="app-main__container">
        <CatalogView />
      </div>
    </main>

    <!-- Global Footer -->
    <footer class="app-footer">
      <div class="app-footer__container">
        <p>Campus Equipment Borrowing System • Phase 03: Borrow Request Submission Flow</p>
        <p class="app-footer__tech">Vite + Vue 3 Composition API • Pinia Store • Express Monolith REST API</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #0b1120;
  color: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.app-header {
  background-color: #0f172a;
  border-bottom: 1px solid #1e293b;
  position: sticky;
  top: 0;
  z-index: 20;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}

.app-header__container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.app-brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.app-brand__icon {
  font-size: 1.8rem;
  line-height: 1;
  background-color: #1e293b;
  padding: 0.5rem;
  border-radius: 0.65rem;
  border: 1px solid #334155;
}

.app-brand__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.app-brand__subtitle {
  margin: 0.15rem 0 0 0;
  font-size: 0.825rem;
  color: #94a3b8;
}

.app-header__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.phase-pill {
  font-size: 0.75rem;
  font-weight: 600;
  background-color: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.35);
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  white-space: nowrap;
}

.health-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0.7rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  border-width: 1px;
  border-style: solid;
}

.health-indicator__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.health-indicator--online {
  background-color: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.35);
  color: #34d399;
}
.health-indicator--online .health-indicator__dot {
  background-color: #10b981;
  box-shadow: 0 0 6px #10b981;
}

.health-indicator--offline {
  background-color: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.35);
  color: #f87171;
}
.health-indicator--offline .health-indicator__dot {
  background-color: #ef4444;
  box-shadow: 0 0 6px #ef4444;
}

.app-main {
  flex: 1;
  padding: 2rem 1.5rem 3rem 1.5rem;
}

.app-main__container {
  max-width: 1240px;
  margin: 0 auto;
}

.app-footer {
  border-top: 1px solid #1e293b;
  background-color: #0f172a;
  padding: 1.5rem;
  text-align: center;
  color: #64748b;
  font-size: 0.825rem;
}

.app-footer__container {
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.app-footer p {
  margin: 0;
}

.app-footer__tech {
  font-size: 0.75rem;
  color: #475569;
}
</style>
