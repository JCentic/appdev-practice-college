<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import { useEquipmentStore } from '../stores/equipment';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  equipment: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'success']);

const equipmentStore = useEquipmentStore();

// Helper to format date as YYYY-MM-DD
function formatDate(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const todayString = computed(() => {
  return formatDate(new Date());
});

const defaultDueDateString = computed(() => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return formatDate(d);
});

// Form state
const form = reactive({
  borrowerName: '',
  borrowerRole: 'Student',
  startDate: '',
  dueDate: '',
  purpose: ''
});

// Errors state
const errors = reactive({
  borrowerName: '',
  borrowerRole: '',
  startDate: '',
  dueDate: '',
  purpose: '',
  general: ''
});

const isSubmitting = ref(false);

// Reset form and errors
function resetForm() {
  form.borrowerName = '';
  form.borrowerRole = 'Student';
  form.startDate = todayString.value;
  form.dueDate = defaultDueDateString.value;
  form.purpose = '';

  errors.borrowerName = '';
  errors.borrowerRole = '';
  errors.startDate = '';
  errors.dueDate = '';
  errors.purpose = '';
  errors.general = '';
}

// Watch isOpen to initialize/reset form when opened
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      resetForm();
    }
  },
  { immediate: true }
);

// Client-side validation per Phase 03 plan
function validateForm() {
  let isValid = true;

  // Clear previous errors
  errors.borrowerName = '';
  errors.borrowerRole = '';
  errors.startDate = '';
  errors.dueDate = '';
  errors.purpose = '';
  errors.general = '';

  if (!form.borrowerName.trim()) {
    errors.borrowerName = 'Borrower full name is required.';
    isValid = false;
  }

  if (!form.borrowerRole.trim()) {
    errors.borrowerRole = 'Please select a borrower role.';
    isValid = false;
  }

  if (!form.startDate) {
    errors.startDate = 'Start date is required.';
    isValid = false;
  }

  if (!form.dueDate) {
    errors.dueDate = 'Expected return date is required.';
    isValid = false;
  }

  if (form.startDate && form.dueDate) {
    const start = new Date(form.startDate);
    const due = new Date(form.dueDate);

    if (isNaN(start.getTime())) {
      errors.startDate = 'Invalid start date.';
      isValid = false;
    }

    if (isNaN(due.getTime())) {
      errors.dueDate = 'Invalid due date.';
      isValid = false;
    }

    if (start && due && due < start) {
      errors.dueDate = 'Expected return date cannot be earlier than the start date.';
      isValid = false;
    }
  }

  if (!form.purpose.trim()) {
    errors.purpose = 'Please describe the purpose or course/project justification.';
    isValid = false;
  } else if (form.purpose.trim().length < 5) {
    errors.purpose = 'Purpose must be at least 5 characters long.';
    isValid = false;
  }

  return isValid;
}

// Form submission handler
async function handleSubmit() {
  if (!validateForm()) {
    return;
  }

  if (!props.equipment) {
    errors.general = 'No equipment selected for borrowing.';
    return;
  }

  isSubmitting.value = true;
  errors.general = '';

  try {
    const payload = {
      equipmentId: props.equipment.id,
      borrowerName: form.borrowerName.trim(),
      borrowerRole: form.borrowerRole.trim(),
      startDate: form.startDate,
      dueDate: form.dueDate,
      purpose: form.purpose.trim()
    };

    const newRequest = await equipmentStore.submitBorrowRequest(payload);
    emit('success', newRequest);
    emit('close');
  } catch (err) {
    errors.general = err.message || 'Failed to submit borrow request. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}

// Close on escape key
function handleKeyDown(e) {
  if (e.key === 'Escape' && props.isOpen && !isSubmitting.value) {
    emit('close');
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        @click.self="!isSubmitting && emit('close')"
      >
        <div class="modal-dialog">
          <!-- Modal Header -->
          <header class="modal-header">
            <div class="modal-header__title-group">
              <span class="modal-header__badge">Borrow Request</span>
              <h2 id="modal-title" class="modal-title">Equipment Checkout Form</h2>
            </div>
            <button
              type="button"
              class="modal-close-btn"
              :disabled="isSubmitting"
              aria-label="Close modal"
              @click="emit('close')"
            >
              ✕
            </button>
          </header>

          <!-- Pre-selected Equipment Info Card -->
          <div v-if="equipment" class="equipment-summary">
            <div class="equipment-summary__header">
              <span class="equipment-summary__category">{{ equipment.category }}</span>
              <span class="equipment-summary__code">{{ equipment.code }}</span>
            </div>
            <h3 class="equipment-summary__name">{{ equipment.name }}</h3>
            <p class="equipment-summary__desc">{{ equipment.description }}</p>
          </div>

          <!-- General Error Banner -->
          <div v-if="errors.general" class="error-banner">
            <span class="error-banner__icon">⚠️</span>
            <span class="error-banner__text">{{ errors.general }}</span>
          </div>

          <!-- Borrow Request Form -->
          <form class="modal-form" @submit.prevent="handleSubmit">
            <!-- Borrower Full Name -->
            <div class="form-group">
              <label for="borrowerName" class="form-label">
                Borrower Name <span class="required-indicator">*</span>
              </label>
              <input
                id="borrowerName"
                v-model="form.borrowerName"
                type="text"
                class="form-input"
                :class="{ 'form-input--error': errors.borrowerName }"
                placeholder="e.g. Jane Doe"
                :disabled="isSubmitting"
                required
              />
              <span v-if="errors.borrowerName" class="field-error">{{ errors.borrowerName }}</span>
            </div>

            <!-- Borrower Academic Role -->
            <div class="form-group">
              <label for="borrowerRole" class="form-label">
                Borrower Role <span class="required-indicator">*</span>
              </label>
              <select
                id="borrowerRole"
                v-model="form.borrowerRole"
                class="form-select"
                :class="{ 'form-select--error': errors.borrowerRole }"
                :disabled="isSubmitting"
                required
              >
                <option value="Student">Student (Undergraduate / Graduate)</option>
                <option value="Faculty">Faculty / Instructor</option>
                <option value="Department Staff">Department Staff</option>
                <option value="Researcher">Researcher / Lab Fellow</option>
              </select>
              <span v-if="errors.borrowerRole" class="field-error">{{ errors.borrowerRole }}</span>
            </div>

            <!-- Dates Row -->
            <div class="form-row">
              <!-- Start Date -->
              <div class="form-group">
                <label for="startDate" class="form-label">
                  Borrow Date <span class="required-indicator">*</span>
                </label>
                <input
                  id="startDate"
                  v-model="form.startDate"
                  type="date"
                  class="form-input"
                  :class="{ 'form-input--error': errors.startDate }"
                  :min="todayString"
                  :disabled="isSubmitting"
                  required
                />
                <span v-if="errors.startDate" class="field-error">{{ errors.startDate }}</span>
              </div>

              <!-- Due Date (Return Date) -->
              <div class="form-group">
                <label for="dueDate" class="form-label">
                  Expected Return Date <span class="required-indicator">*</span>
                </label>
                <input
                  id="dueDate"
                  v-model="form.dueDate"
                  type="date"
                  class="form-input"
                  :class="{ 'form-input--error': errors.dueDate }"
                  :min="form.startDate || todayString"
                  :disabled="isSubmitting"
                  required
                />
                <span v-if="errors.dueDate" class="field-error">{{ errors.dueDate }}</span>
              </div>
            </div>

            <!-- Purpose / Justification -->
            <div class="form-group">
              <label for="purpose" class="form-label">
                Purpose / Academic Use Justification <span class="required-indicator">*</span>
              </label>
              <textarea
                id="purpose"
                v-model="form.purpose"
                class="form-textarea"
                :class="{ 'form-textarea--error': errors.purpose }"
                placeholder="Explain why this equipment is needed (e.g. Capstone project demonstration, CS101 Lab experiment, seminar presentation)..."
                rows="3"
                :disabled="isSubmitting"
                required
              ></textarea>
              <span v-if="errors.purpose" class="field-error">{{ errors.purpose }}</span>
            </div>

            <!-- Notice Callout -->
            <div class="form-notice">
              <span class="notice-icon">ℹ️</span>
              <span>
                Submitted requests are marked as <strong>Pending</strong>. Department staff will review and approve availability before physical pickup.
              </span>
            </div>

            <!-- Modal Action Buttons -->
            <footer class="modal-actions">
              <button
                type="button"
                class="btn-secondary"
                :disabled="isSubmitting"
                @click="emit('close')"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn-primary"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting" class="spinner"></span>
                <span>{{ isSubmitting ? 'Submitting Request...' : 'Submit Borrow Request' }}</span>
              </button>
            </footer>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal Overlay / Backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(11, 17, 32, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  overflow-y: auto;
}

/* Modal Dialog Window */
.modal-dialog {
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.75rem;
  color: #f8fafc;
}

/* Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #334155;
}

.modal-header__badge {
  display: inline-block;
  font-size: 0.725rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #38bdf8;
  background-color: rgba(56, 189, 248, 0.12);
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  margin-bottom: 0.35rem;
}

.modal-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #ffffff;
}

.modal-close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  line-height: 1;
}

.modal-close-btn:hover:not(:disabled) {
  background-color: #334155;
  color: #ffffff;
}

.modal-close-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Equipment Summary Card */
.equipment-summary {
  background-color: #0f172a;
  border: 1px solid #334155;
  border-radius: 0.75rem;
  padding: 1rem 1.15rem;
  margin-bottom: 1.25rem;
}

.equipment-summary__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.equipment-summary__category {
  font-size: 0.725rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.equipment-summary__code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: #38bdf8;
  background-color: rgba(56, 189, 248, 0.1);
  padding: 0.1rem 0.4rem;
  border-radius: 0.25rem;
}

.equipment-summary__name {
  margin: 0 0 0.35rem 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #f8fafc;
}

.equipment-summary__desc {
  margin: 0;
  font-size: 0.825rem;
  color: #94a3b8;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Error Banner */
.error-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #fca5a5;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
}

.error-banner__icon {
  font-size: 1.1rem;
}

/* Form Styles */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 480px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #e2e8f0;
}

.required-indicator {
  color: #f87171;
}

.form-input,
.form-select,
.form-textarea {
  background-color: #0f172a;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  padding: 0.65rem 0.85rem;
  color: #f8fafc;
  font-size: 0.875rem;
  font-family: inherit;
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
}

.form-input--error,
.form-select--error,
.form-textarea--error {
  border-color: #ef4444 !important;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.field-error {
  font-size: 0.775rem;
  color: #f87171;
  font-weight: 500;
}

.form-notice {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background-color: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.2);
  padding: 0.65rem 0.85rem;
  border-radius: 0.5rem;
  font-size: 0.785rem;
  color: #93c5fd;
  line-height: 1.45;
}

.notice-icon {
  font-size: 0.95rem;
  line-height: 1;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #334155;
}

.btn-secondary {
  background-color: #334155;
  color: #cbd5e1;
  border: 1px solid #475569;
  padding: 0.65rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #475569;
  color: #ffffff;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #2563eb;
  color: #ffffff;
  border: 1px solid #3b82f6;
  padding: 0.65rem 1.35rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
  border-color: #60a5fa;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  width: 0.9rem;
  height: 0.9rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Modal Transitions per component-transition.md */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-dialog,
.modal-fade-leave-active .modal-dialog {
  transition: transform 0.25s ease;
}

.modal-fade-enter-from .modal-dialog,
.modal-fade-leave-to .modal-dialog {
  transform: scale(0.96) translateY(-10px);
}
</style>
