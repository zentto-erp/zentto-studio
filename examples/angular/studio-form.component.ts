// Example: Zentto Studio in Angular 17+
// npm install @zentto/studio @zentto/studio-core
// In app.module.ts or standalone component: schemas: [CUSTOM_ELEMENTS_SCHEMA]

import { Component, ElementRef, ViewChild, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-studio-form',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div style="max-width: 800px; margin: 40px auto">
      <h1>Zentto Studio — Angular</h1>
      <zentto-studio-renderer #formRef></zentto-studio-renderer>
      <pre *ngIf="submitted" style="margin-top: 16px; padding: 16px; background: #1e1e2d; color: #a2a3b7; border-radius: 8px;">{{ formData | json }}</pre>
    </div>
  `,
})
export class StudioFormComponent implements AfterViewInit {
  @ViewChild('formRef') formRef!: ElementRef;

  formData: Record<string, unknown> = {};
  submitted = false;

  private schema = {
    id: 'angular-demo', version: '1.0', title: 'Contact Form',
    layout: { type: 'grid', columns: 2, gap: 16 },
    sections: [{
      id: 'main', title: 'Contact',
      fields: [
        { id: 'name', type: 'text', field: 'name', label: 'Name', required: true },
        { id: 'email', type: 'email', field: 'email', label: 'Email', required: true },
        { id: 'phone', type: 'phone', field: 'phone', label: 'Phone' },
        { id: 'message', type: 'textarea', field: 'message', label: 'Message', colSpan: 2 },
      ]
    }],
    actions: [{ id: 'send', type: 'submit', label: 'Send', variant: 'primary' }]
  };

  async ngAfterViewInit() {
    // Dynamic import to register web components
    await import('@zentto/studio');

    const el = this.formRef.nativeElement;
    el.schema = this.schema;

    el.addEventListener('studio-submit', (e: CustomEvent) => {
      this.formData = e.detail.data;
      this.submitted = true;
    });
  }
}
