<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEquipmentStore } from '../stores/equipment';
import EquipmentSearchBar from '../components/equipment/EquipmentSearchBar.vue';
import EquipmentGrid from '../components/equipment/EquipmentGrid.vue';
import BorrowModal from '../components/BorrowModal.vue';

const equipmentStore = useEquipmentStore();

// Destructure reactive state & getters with storeToRefs per vue-pinia-best-practices
const {
  equipment,
  isLoading,
  error,
  categories,
  totalCount,
  availableCount,
  reservedCount,
  borrowedCount,
  maintenanceCount
} = storeToRefs(equipmentStore);

// Destructure actions directly
const { fetchEquipment } = equipmentStore;

// Ephemeral search & filter state
const searchQuery = ref('');
const selectedCategory = ref('All Categories');
const selectedStatus = ref('All Statuses');

// Borrow modal & notification state
const isModalOpen = ref(false);
const selectedEquipmentForBorrow = ref(null);
const successNotification = ref(null);
let notificationTimer = null;

function handleOpenBorrowModal(item) {
  selectedEquipmentForBorrow.value = item;
  isModalOpen.value = true;
}

function handleCloseBorrowModal() {
  isModalOpen.value = false;
}

function handleBorrowSuccess(newRequest) {
  if (notificationTimer) {
    clearTimeout(notificationTimer);
  }
  successNotification.value = {
    title: 'Borrow Request Submitted Successfully',
    message: `Your request (#${newRequest.id}) for "${newRequest.equipmentName}" is now Pending staff review.`,
    details: `Borrower: ${newRequest.borrowerName} (${newRequest.borrowerRole}) • Expected Return: ${newRequest.dueDate}`
  };
  notificationTimer = setTimeout(() => {
    successNotification.value = null;
  }, 9000);
}

function dismissNotification() {
  if (notificationTimer) {
    clearTimeout(notificationTimer);
  }
  successNotification.value = null;
}

// Pure computed property for filtered list per vue-best-practices
const filteredEquipment = computed(() => {
  let list = equipment.value;

  if (selectedCategory.value !== 'All Categories') {
    list = list.filter((item) => item.category === selectedCategory.value);
  }

  if (selectedStatus.value !== 'All Statuses') {
    list = list.filter((item) => item.status === selectedStatus.value);
  }

  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.trim().toLowerCase();
    list = list.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }

  return list;
});

function handleQuickStatusFilter(status) {
  if (selectedStatus.value === status) {
    selectedStatus.value = 'All Statuses';
  } else {
    selectedStatus.value = status;
  }
}

function clearAllFilters() {
  searchQuery.value = '';
  selectedCategory.value = 'All Categories';
  selectedStatus.value = 'All Statuses';
}

onMounted(() => {
  fetchEquipment();
});
</script>

<template>
  <section class="catalog-view">
    <!-- View Header -->
    <header class="catalog-header">
      <div class="catalog-header__info">
        <h2 class="catalog-header__title">Equipment Catalog</h2>
        <p class="catalog-header__desc">
          Browse department equipment and check live availability before submitting borrow requests.
        </p>
      </div>
      <button
        type="button"
        class="refresh-btn"
        :disabled="isLoading"
        title="Refresh catalog data"
        @click="fetchEquipment"
      >
        <span :class="['refresh-icon', { 'refresh-icon--spinning': isLoading }]">↻</span>
        <span>Refresh</span>
      </button>
    </header>

    <!-- Success Notification Alert -->
    <Transition name="banner-fade">
      <div v-if="successNotification" class="success-banner" role="alert">
        <div class="success-banner__icon">✓</div>
        <div class="success-banner__content">
          <h4 class="success-banner__title">{{ successNotification.title }}</h4>
          <p class="success-banner__message">{{ successNotification.message }}</p>
          <p class="success-banner__sub">{{ successNotification.details }}</p>
        </div>
        <button
          type="button"
          class="success-banner__close"
          aria-label="Dismiss alert"
          @click="dismissNotification"
        >
          ✕
        </button>
      </div>
    </Transition>

    <!-- Quick Status Overview Cards -->
    <div class="status-summary-bar">
      <button
        type="button"
        :class="['summary-chip', { 'summary-chip--active': selectedStatus === 'All Statuses' }]"
        @click="selectedStatus = 'All Statuses'"
      >
        <span class="chip-label">Total</span>
        <span class="chip-val">{{ totalCount }}</span>
      </button>

      <button
        type="button"
        :class="['summary-chip', 'summary-chip--available', { 'summary-chip--active': selectedStatus === 'Available' }]"
        @click="handleQuickStatusFilter('Available')"
      >
        <span class="chip-dot chip-dot--available"></span>
        <span class="chip-label">Available</span>
        <span class="chip-val">{{ availableCount }}</span>
      </button>

      <button
        type="button"
        :class="['summary-chip', 'summary-chip--reserved', { 'summary-chip--active': selectedStatus === 'Reserved' }]"
        @click="handleQuickStatusFilter('Reserved')"
      >
        <span class="chip-dot chip-dot--reserved"></span>
        <span class="chip-label">Reserved</span>
        <span class="chip-val">{{ reservedCount }}</span>
      </button>

      <button
        type="button"
        :class="['summary-chip', 'summary-chip--borrowed', { 'summary-chip--active': selectedStatus === 'Borrowed' }]"
        @click="handleQuickStatusFilter('Borrowed')"
      >
        <span class="chip-dot chip-dot--borrowed"></span>
        <span class="chip-label">Borrowed</span>
        <span class="chip-val">{{ borrowedCount }}</span>
      </button>

      <button
        type="button"
        :class="['summary-chip', 'summary-chip--maintenance', { 'summary-chip--active': selectedStatus === 'Under Maintenance' }]"
        @click="handleQuickStatusFilter('Under Maintenance')"
      >
        <span class="chip-dot chip-dot--maintenance"></span>
        <span class="chip-label">Maintenance</span>
        <span class="chip-val">{{ maintenanceCount }}</span>
      </button>
    </div>

    <!-- Search & Filter Controls -->
    <EquipmentSearchBar
      v-model:searchQuery="searchQuery"
      v-model:selectedCategory="selectedCategory"
      v-model:selectedStatus="selectedStatus"
      :categories="categories"
      :total-results="filteredEquipment.length"
      :total-equipment="totalCount"
    />

    <!-- Equipment Cards Grid -->
    <EquipmentGrid
      :items="filteredEquipment"
      :is-loading="isLoading"
      :error="error"
      @retry="fetchEquipment"
      @clear-filters="clearAllFilters"
      @borrow="handleOpenBorrowModal"
    />

    <!-- Borrow Request Modal -->
    <BorrowModal
      :is-open="isModalOpen"
      :equipment="selectedEquipmentForBorrow"
      @close="handleCloseBorrowModal"
      @success="handleBorrowSuccess"
    />
  </section>
</template>

<style scoped>
.catalog-view {
  width: 100%;
}

.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.catalog-header__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 0.35rem 0;
}

.catalog-header__desc {
  font-size: 0.925rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.45;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: #1e293b;
  border: 1px solid #334155;
  color: #cbd5e1;
  padding: 0.5rem 0.85rem;
  border-radius: 0.5rem;
  font-size: 0.825rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #334155;
  color: #ffffff;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.refresh-icon--spinning {
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Status Overview Bar */
.status-summary-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-bottom: 1.25rem;
}

.summary-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background-color: #1e293b;
  border: 1px solid #334155;
  padding: 0.45rem 0.85rem;
  border-radius: 0.5rem;
  font-size: 0.825rem;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.summary-chip:hover {
  border-color: #475569;
  background-color: #243048;
}

.summary-chip--active {
  border-color: #38bdf8;
  background-color: rgba(56, 189, 248, 0.12);
  color: #ffffff;
}

.chip-label {
  font-weight: 500;
}

.chip-val {
  font-weight: 700;
  background-color: #0f172a;
  padding: 0.1rem 0.45rem;
  border-radius: 0.25rem;
  font-size: 0.775rem;
}

.chip-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.chip-dot--available {
  background-color: #10b981;
}

.chip-dot--reserved {
  background-color: #f59e0b;
}

.chip-dot--borrowed {
  background-color: #3b82f6;
}

.chip-dot--maintenance {
  background-color: #ef4444;
}

/* Success Banner Styles */
.success-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  background-color: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.4);
  border-radius: 0.75rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.success-banner__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background-color: #10b981;
  color: #0f172a;
  font-weight: 800;
  font-size: 0.95rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.success-banner__content {
  flex: 1;
}

.success-banner__title {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #34d399;
}

.success-banner__message {
  margin: 0 0 0.35rem 0;
  font-size: 0.875rem;
  color: #e2e8f0;
  line-height: 1.45;
}

.success-banner__sub {
  margin: 0;
  font-size: 0.775rem;
  color: #94a3b8;
}

.success-banner__close {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 0.35rem;
  transition: all 0.2s ease;
  line-height: 1;
}

.success-banner__close:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

/* Banner Transition */
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: all 0.3s ease;
}

.banner-fade-enter-from,
.banner-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
