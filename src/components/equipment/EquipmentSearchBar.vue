<script setup>
import { computed } from 'vue';

const searchQuery = defineModel('searchQuery', {
  type: String,
  default: ''
});

const selectedCategory = defineModel('selectedCategory', {
  type: String,
  default: 'All Categories'
});

const selectedStatus = defineModel('selectedStatus', {
  type: String,
  default: 'All Statuses'
});

const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  totalResults: {
    type: Number,
    required: true
  },
  totalEquipment: {
    type: Number,
    required: true
  }
});

const statuses = [
  'All Statuses',
  'Available',
  'Reserved',
  'Borrowed',
  'Under Maintenance'
];

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value.trim() !== '' ||
    selectedCategory.value !== 'All Categories' ||
    selectedStatus.value !== 'All Statuses'
  );
});

function resetFilters() {
  searchQuery.value = '';
  selectedCategory.value = 'All Categories';
  selectedStatus.value = 'All Statuses';
}
</script>

<template>
  <div class="search-bar">
    <div class="search-bar__controls">
      <!-- Search Input -->
      <div class="search-bar__input-wrapper">
        <svg
          class="search-bar__icon"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <input
          v-model="searchQuery"
          type="search"
          class="search-bar__input"
          placeholder="Search by equipment name, asset code, or description..."
        />
        <button
          v-if="searchQuery"
          type="button"
          class="search-bar__clear-btn"
          aria-label="Clear search text"
          @click="searchQuery = ''"
        >
          ✕
        </button>
      </div>

      <!-- Category Filter Dropdown -->
      <div class="search-bar__select-wrapper">
        <label for="category-select" class="search-bar__label">Category:</label>
        <select
          id="category-select"
          v-model="selectedCategory"
          class="search-bar__select"
        >
          <option
            v-for="cat in categories"
            :key="cat"
            :value="cat"
          >
            {{ cat }}
          </option>
        </select>
      </div>

      <!-- Status Filter Dropdown -->
      <div class="search-bar__select-wrapper">
        <label for="status-select" class="search-bar__label">Status:</label>
        <select
          id="status-select"
          v-model="selectedStatus"
          class="search-bar__select"
        >
          <option
            v-for="st in statuses"
            :key="st"
            :value="st"
          >
            {{ st }}
          </option>
        </select>
      </div>

      <!-- Reset button -->
      <button
        v-if="hasActiveFilters"
        type="button"
        class="search-bar__reset-btn"
        @click="resetFilters"
      >
        Reset Filters
      </button>
    </div>

    <!-- Live Results Summary -->
    <div class="search-bar__meta">
      <span class="search-bar__count">
        Showing <strong>{{ totalResults }}</strong> of {{ totalEquipment }} items
      </span>
      <span v-if="hasActiveFilters" class="search-bar__active-indicator">
        (Filters active)
      </span>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.875rem;
  padding: 1.25rem;
  margin-bottom: 1.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
}

.search-bar__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
  align-items: center;
}

.search-bar__input-wrapper {
  position: relative;
  flex: 1 1 280px;
  display: flex;
  align-items: center;
}

.search-bar__icon {
  position: absolute;
  left: 0.85rem;
  width: 1.1rem;
  height: 1.1rem;
  color: #94a3b8;
  pointer-events: none;
}

.search-bar__input {
  width: 100%;
  background-color: #0f172a;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  padding: 0.65rem 2.25rem 0.65rem 2.5rem;
  color: #f8fafc;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-bar__input:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
}

.search-bar__input::placeholder {
  color: #64748b;
}

.search-bar__clear-btn {
  position: absolute;
  right: 0.75rem;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0.2rem;
  line-height: 1;
}

.search-bar__clear-btn:hover {
  color: #f8fafc;
}

.search-bar__select-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 0 1 auto;
}

.search-bar__label {
  font-size: 0.825rem;
  font-weight: 500;
  color: #94a3b8;
  white-space: nowrap;
}

.search-bar__select {
  background-color: #0f172a;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  padding: 0.65rem 1rem;
  color: #f8fafc;
  font-size: 0.875rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.search-bar__select:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
}

.search-bar__reset-btn {
  background-color: #334155;
  color: #e2e8f0;
  border: none;
  border-radius: 0.5rem;
  padding: 0.65rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.search-bar__reset-btn:hover {
  background-color: #475569;
}

.search-bar__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.85rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(51, 65, 85, 0.6);
  font-size: 0.825rem;
  color: #94a3b8;
}

.search-bar__count strong {
  color: #38bdf8;
}

.search-bar__active-indicator {
  color: #fbbf24;
  font-size: 0.8rem;
}
</style>
