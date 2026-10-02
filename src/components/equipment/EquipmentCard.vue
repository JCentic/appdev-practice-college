<script setup>
import { computed } from 'vue';
import EquipmentStatusBadge from './EquipmentStatusBadge.vue';

const props = defineProps({
  equipment: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['borrow']);

const isAvailable = computed(() => props.equipment.status === 'Available');

const statusHint = computed(() => {
  switch (props.equipment.status) {
    case 'Available':
      return 'Ready for student & faculty borrow requests';
    case 'Reserved':
      return 'Hold placed for upcoming academic session';
    case 'Borrowed':
      return 'Active loan in progress with borrower';
    case 'Under Maintenance':
      return 'Under technical inspection & service';
    default:
      return 'Status pending verification';
  }
});
</script>

<template>
  <article class="equipment-card">
    <header class="equipment-card__header">
      <span class="equipment-card__category">{{ equipment.category }}</span>
      <EquipmentStatusBadge :status="equipment.status" />
    </header>

    <div class="equipment-card__body">
      <div class="equipment-card__title-row">
        <h3 class="equipment-card__name">{{ equipment.name }}</h3>
        <span class="equipment-card__code">{{ equipment.code }}</span>
      </div>
      <p class="equipment-card__description">{{ equipment.description }}</p>

      <div class="equipment-card__actions">
        <button
          type="button"
          class="borrow-btn"
          :class="{ 'borrow-btn--available': isAvailable, 'borrow-btn--disabled': !isAvailable }"
          :disabled="!isAvailable"
          :title="isAvailable ? 'Request to borrow this item' : `Item is currently ${equipment.status}`"
          @click="isAvailable && emit('borrow', equipment)"
        >
          <span v-if="isAvailable" class="borrow-btn__icon">📋</span>
          <span>{{ isAvailable ? 'Borrow Item' : 'Unavailable' }}</span>
        </button>
      </div>
    </div>

    <footer class="equipment-card__footer">
      <span class="equipment-card__hint">{{ statusHint }}</span>
      <span class="equipment-card__id">ID #{{ equipment.id }}</span>
    </footer>
  </article>
</template>

<style scoped>
.equipment-card {
  display: flex;
  flex-direction: column;
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.875rem;
  padding: 1.25rem;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.2);
}

.equipment-card:hover {
  transform: translateY(-2px);
  border-color: #475569;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.3);
}

.equipment-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.875rem;
}

.equipment-card__category {
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #0f172a;
  padding: 0.2rem 0.55rem;
  border-radius: 0.375rem;
  border: 1px solid #1e293b;
}

.equipment-card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.equipment-card__title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.equipment-card__name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #f8fafc;
  line-height: 1.35;
}

.equipment-card__code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: #38bdf8;
  background-color: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.2);
  padding: 0.15rem 0.45rem;
  border-radius: 0.25rem;
  white-space: nowrap;
}

.equipment-card__description {
  margin: 0.35rem 0 1rem 0;
  font-size: 0.875rem;
  color: #cbd5e1;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.equipment-card__actions {
  margin-top: auto;
  margin-bottom: 0.875rem;
}

.borrow-btn {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.borrow-btn--available {
  background-color: #2563eb;
  color: #ffffff;
  border-color: #3b82f6;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
}

.borrow-btn--available:hover {
  background-color: #1d4ed8;
  border-color: #60a5fa;
  transform: translateY(-1px);
}

.borrow-btn--available:active {
  transform: translateY(0);
}

.borrow-btn--disabled {
  background-color: rgba(30, 41, 59, 0.8);
  color: #64748b;
  border-color: #334155;
  cursor: not-allowed;
  opacity: 0.65;
}

.borrow-btn__icon {
  font-size: 0.95rem;
  line-height: 1;
}

.equipment-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.875rem;
  border-top: 1px solid #334155;
  font-size: 0.775rem;
}

.equipment-card__hint {
  color: #94a3b8;
  font-style: italic;
}

.equipment-card__id {
  color: #64748b;
  font-weight: 500;
}
</style>
