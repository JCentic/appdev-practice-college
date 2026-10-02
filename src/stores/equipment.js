import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useEquipmentStore = defineStore('equipment', () => {
  // Reactive state
  const equipment = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const lastFetched = ref(null);

  // Getters (computed)
  const totalCount = computed(() => equipment.value.length);

  const availableCount = computed(
    () => equipment.value.filter((item) => item.status === 'Available').length
  );

  const reservedCount = computed(
    () => equipment.value.filter((item) => item.status === 'Reserved').length
  );

  const borrowedCount = computed(
    () => equipment.value.filter((item) => item.status === 'Borrowed').length
  );

  const maintenanceCount = computed(
    () => equipment.value.filter((item) => item.status === 'Under Maintenance').length
  );

  const categories = computed(() => {
    const unique = new Set(equipment.value.map((item) => item.category));
    return ['All Categories', ...Array.from(unique)];
  });

  // Actions
  async function fetchEquipment() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch('/api/equipment');
      if (!response.ok) {
        throw new Error(`Failed to load equipment list (HTTP ${response.status})`);
      }

      const json = await response.json();
      // Handle both { data: [...] } format and raw array format
      if (Array.isArray(json)) {
        equipment.value = json;
      } else if (json && Array.isArray(json.data)) {
        equipment.value = json.data;
      } else {
        equipment.value = [];
      }

      lastFetched.value = new Date().toISOString();
    } catch (err) {
      error.value = err.message || 'An unexpected error occurred while fetching equipment.';
    } finally {
      isLoading.value = false;
    }
  }

  // Return ALL state, getters, and actions for Pinia setup store compliance
  return {
    // State
    equipment,
    isLoading,
    error,
    lastFetched,

    // Getters
    totalCount,
    availableCount,
    reservedCount,
    borrowedCount,
    maintenanceCount,
    categories,

    // Actions
    fetchEquipment
  };
});
