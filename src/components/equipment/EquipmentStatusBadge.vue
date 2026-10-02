<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) =>
      ['Available', 'Reserved', 'Borrowed', 'Under Maintenance'].includes(value)
  }
});

const statusConfig = computed(() => {
  switch (props.status) {
    case 'Available':
      return {
        modifierClass: 'status-badge--available',
        label: 'Available'
      };
    case 'Reserved':
      return {
        modifierClass: 'status-badge--reserved',
        label: 'Reserved'
      };
    case 'Borrowed':
      return {
        modifierClass: 'status-badge--borrowed',
        label: 'Borrowed'
      };
    case 'Under Maintenance':
      return {
        modifierClass: 'status-badge--maintenance',
        label: 'Under Maintenance'
      };
    default:
      return {
        modifierClass: 'status-badge--unknown',
        label: props.status
      };
  }
});
</script>

<template>
  <span :class="['status-badge', statusConfig.modifierClass]">
    <span class="status-badge__dot"></span>
    <span class="status-badge__text">{{ statusConfig.label }}</span>
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  line-height: 1;
  white-space: nowrap;
  border-width: 1px;
  border-style: solid;
  transition: all 0.2s ease;
}

.status-badge__dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Green: Available */
.status-badge--available {
  background-color: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.35);
  color: #34d399;
}
.status-badge--available .status-badge__dot {
  background-color: #10b981;
  box-shadow: 0 0 6px #10b981;
}

/* Yellow: Reserved */
.status-badge--reserved {
  background-color: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.35);
  color: #fbbf24;
}
.status-badge--reserved .status-badge__dot {
  background-color: #f59e0b;
  box-shadow: 0 0 6px #f59e0b;
}

/* Blue: Borrowed */
.status-badge--borrowed {
  background-color: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.35);
  color: #60a5fa;
}
.status-badge--borrowed .status-badge__dot {
  background-color: #3b82f6;
  box-shadow: 0 0 6px #3b82f6;
}

/* Red/Gray: Under Maintenance */
.status-badge--maintenance {
  background-color: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.35);
  color: #f87171;
}
.status-badge--maintenance .status-badge__dot {
  background-color: #ef4444;
  box-shadow: 0 0 6px #ef4444;
}

/* Fallback unknown */
.status-badge--unknown {
  background-color: rgba(148, 163, 184, 0.15);
  border-color: rgba(148, 163, 184, 0.35);
  color: #cbd5e1;
}
.status-badge--unknown .status-badge__dot {
  background-color: #94a3b8;
}
</style>
