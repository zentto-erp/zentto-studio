<!-- Example: Zentto Studio in Vue 3 -->
<!-- npm install @zentto/studio @zentto/studio-core -->
<!-- vite.config.ts: add @zentto/studio to optimizeDeps.include -->

<template>
  <div style="max-width: 800px; margin: 40px auto">
    <h1>Zentto Studio — Vue 3</h1>
    <zentto-studio-renderer ref="formRef" />
    <pre v-if="submitted" style="margin-top: 16px; padding: 16px; background: #1e1e2d; color: #a2a3b7; border-radius: 8px;">{{ JSON.stringify(formData, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const formRef = ref<HTMLElement | null>(null);
const formData = ref<Record<string, unknown>>({});
const submitted = ref(false);

const schema = {
  id: 'vue-demo', version: '1.0', title: 'Contact Form',
  layout: { type: 'grid', columns: 2, gap: 16 },
  sections: [{
    id: 'main', title: 'Contact',
    fields: [
      { id: 'name', type: 'text', field: 'name', label: 'Name', required: true },
      { id: 'email', type: 'email', field: 'email', label: 'Email', required: true },
      { id: 'message', type: 'textarea', field: 'message', label: 'Message', colSpan: 2 },
    ]
  }],
  actions: [{ id: 'send', type: 'submit', label: 'Send', variant: 'primary' }]
};

onMounted(async () => {
  await import('@zentto/studio');

  if (formRef.value) {
    (formRef.value as any).schema = schema;

    formRef.value.addEventListener('studio-submit', ((e: CustomEvent) => {
      formData.value = e.detail.data;
      submitted.value = true;
    }) as EventListener);
  }
});
</script>

<style>
/* Vue needs this to allow custom elements */
</style>
