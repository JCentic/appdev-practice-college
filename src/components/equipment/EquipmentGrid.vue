<script setup>
import EquipmentCard from './EquipmentCard.vue';

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['retry', 'clearFilters', 'borrow']);
</script>

<template>
  <div class="equipment-grid-wrapper">
    <!-- Loading State -->
    <div v-if="isLoading" class="equipment-grid__loading">
      <div v-for="n in 6" :key="n" class="skeleton-card">
        <div class="skeleton-card__header">
          <div class="skeleton-line skeleton-line--pill"></div>
          <div class="skeleton-line skeleton-line--pill"></div>
        </div>
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--text"></div>
        <div class="skeleton-line skeleton-line--text-short"></div>
        <div class="skeleton-card__footer">
          <div class="skeleton-line skeleton-line--footer"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="equipment-grid__error">
      <div class="error-icon">⚠️</div>
      <h3 class="error-title">Failed to Load Equipment</h3>
      <p class="error-message">{{ error }}</p>
      <button
        type="button"
        class="retry-btn"
        @click="emit('retry')"
      >
        Retry Loading
      </button>
    </div>

    <!-- Empty State -->
    <div v-else-if="items.length === 0" class="equipment-grid__empty">
      <div class="empty-icon">🔍</div>
      <h3 class="empty-title">No Equipment Found</h3>
      <p class="empty-message">
        No items match your selected search keyword or category filter.
      </p>
      <button
        type="button"
        class="clear-filters-btn"
        @click="emit('clearFilters')"
      >
        Clear All Filters
      </button>
    </div>

    <!-- Items Grid -->
    <div v-else class="equipment-grid">
      <EquipmentCard
        v-for="item in items"
        :key="item.id"
        :equipment="item"
        @borrow="emit('borrow', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.equipment-grid-wrapper {
  width: 100%;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

/* Skeleton Loading */
.equipment-grid__loading {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.skeleton-card {
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.875rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 220px;
}

.skeleton-card__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.skeleton-card__footer {
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #334155;
}

.skeleton-line {
  background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.25rem;
}

.skeleton-line--pill {
  width: 70px;
  height: 18px;
  border-radius: 9999px;
}

.skeleton-line--title {
  width: 75%;
  height: 22px;
}

.skeleton-line--text {
  width: 100%;
  height: 14px;
}

.skeleton-line--text-short {
  width: 60%;
  height: 14px;
}

.skeleton-line--footer {
  width: 50%;
  height: 14px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Error State */
.equipment-grid__error {
  text-align: center;
  padding: 3rem 1.5rem;
  background-color: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 1rem;
  max-width: 500px;
  margin: 2rem auto;
}

.error-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.error-title {
  font-size: 1.25rem;
  color: #f87171;
  margin: 0 0 0.5rem 0;
}

.error-message {
  color: #cbd5e1;
  font-size: 0.9rem;
  margin: 0 0 1.25rem 0;
}

.retry-btn {
  background-color: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.6rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.retry-btn:hover {
  background-color: #dc2626;
}

/* Empty State */
.equipment-grid__empty {
  text-align: center;
  padding: 3.5rem 1.5rem;
  background-color: #1e293b;
  border: 1px dashed #334155;
  border-radius: 1rem;
  max-width: 500px;
  margin: 2rem auto;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.empty-title {
  font-size: 1.25rem;
  color: #f8fafc;
  margin: 0 0 0.5rem 0;
}

.empty-message {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0 0 1.25rem 0;
  line-height: 1.5;
}

.clear-filters-btn {
  background-color: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.6rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clear-filters-btn:hover {
  background-color: #2563eb;
}
</style>
