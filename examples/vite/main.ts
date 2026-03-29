// Example: Zentto Studio in Vite (Vanilla TypeScript)
// npm install @zentto/studio @zentto/studio-core

import '@zentto/studio';
import type { StudioSchema } from '@zentto/studio-core';

const schema: StudioSchema = {
  id: 'vite-demo',
  version: '1.0',
  title: 'Registration Form',
  layout: { type: 'grid', columns: 2, gap: 16 },
  sections: [{
    id: 'main',
    title: 'Your Details',
    fields: [
      { id: 'name', type: 'text', field: 'name', label: 'Full Name', required: true },
      { id: 'email', type: 'email', field: 'email', label: 'Email', required: true },
      { id: 'age', type: 'number', field: 'age', label: 'Age' },
      { id: 'country', type: 'select', field: 'country', label: 'Country',
        props: { options: [
          { value: 'US', label: 'United States' },
          { value: 'UK', label: 'United Kingdom' },
          { value: 'DE', label: 'Germany' },
        ]}
      },
      { id: 'bio', type: 'textarea', field: 'bio', label: 'Bio', colSpan: 2 },
      { id: 'terms', type: 'checkbox', field: 'terms', label: 'I agree to the terms', required: true },
    ]
  }],
  actions: [
    { id: 'register', type: 'submit', label: 'Register', variant: 'primary' },
  ]
};

// Mount
const app = document.querySelector<HTMLElement>('#app')!;
app.innerHTML = '<zentto-studio-renderer id="form"></zentto-studio-renderer>';

const form = document.getElementById('form') as any;
form.schema = schema;

form.addEventListener('studio-submit', (e: CustomEvent) => {
  alert('Registered!\n' + JSON.stringify(e.detail.data, null, 2));
});
