// @zentto/studio-core — Pre-built AppConfig templates
// Users can start from these and customize

import type { AppConfig } from '../app-types.js';

/**
 * Blank app template — minimal starting point
 */
export const TEMPLATE_BLANK: AppConfig = {
  id: 'blank-app',
  version: '1.0.0',
  branding: {
    title: 'Mi Aplicacion',
    subtitle: '',
    homeSegment: 'home',
    sidebarStyle: 'dark',
  },
  navigation: [
    { segment: 'home', title: 'Inicio', icon: '🏠' },
  ],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Inicio',
      content: 'empty',
    },
  ],
};

/**
 * CRM template — customer management app
 */
export const TEMPLATE_CRM: AppConfig = {
  id: 'crm-app',
  version: '1.0.0',
  branding: {
    title: 'CRM',
    subtitle: 'Gestion de Clientes',
    homeSegment: 'dashboard',
    primaryColor: '#3498db',
    sidebarStyle: 'dark',
  },
  user: { name: 'Usuario', roles: ['admin'] },
  navigation: [
    { kind: 'header', title: 'CRM' },
    { segment: 'dashboard', title: 'Dashboard', icon: '📊' },
    { segment: 'contactos', title: 'Contactos', icon: '👥', badge: 0 },
    { segment: 'empresas', title: 'Empresas', icon: '🏢' },
    { segment: 'oportunidades', title: 'Oportunidades', icon: '💰' },
    { kind: 'divider' },
    { kind: 'header', title: 'ACTIVIDADES' },
    { segment: 'tareas', title: 'Tareas', icon: '✅' },
    { segment: 'calendario', title: 'Calendario', icon: '📅' },
    { segment: 'nuevo-contacto', title: 'Nuevo Contacto', icon: '➕' },
    { kind: 'divider' },
    { segment: 'reportes', title: 'Reportes', icon: '📈' },
    { segment: 'configuracion', title: 'Configuracion', icon: '⚙️' },
  ],
  pages: [
    {
      id: 'dashboard', segment: 'dashboard', title: 'Dashboard', content: 'cards',
      cardsConfig: {
        columns: 4, variant: 'kpi',
        items: [
          { id: 'k1', title: 'Contactos Totales', value: '—', trend: 'up', trendValue: '' },
          { id: 'k2', title: 'Oportunidades Abiertas', value: '—', trend: 'flat', trendValue: '' },
          { id: 'k3', title: 'Valor Pipeline', value: '—', trend: 'up', trendValue: '' },
          { id: 'k4', title: 'Tareas Pendientes', value: '—', trend: 'down', trendValue: '' },
        ],
      },
    },
    {
      id: 'contactos', segment: 'contactos', title: 'Contactos', content: 'datagrid',
      gridConfig: {
        columns: [
          { field: 'nombre', header: 'Nombre', width: 200 },
          { field: 'email', header: 'Email', width: 200 },
          { field: 'telefono', header: 'Telefono', width: 140 },
          { field: 'empresa', header: 'Empresa', width: 180 },
          { field: 'estado', header: 'Estado', width: 100, type: 'status', statusColors: { Activo: '#27ae60', Prospecto: '#f39c12', Inactivo: '#95a5a6' } },
        ],
        dataSourceId: 'contactos',
        enableToolbar: true, enableSearch: true,
      },
      actions: [{ id: 'nuevo', type: 'custom', label: 'Nuevo Contacto', variant: 'primary' }],
    },
    {
      id: 'nuevo-contacto', segment: 'nuevo-contacto', title: 'Nuevo Contacto', content: 'schema',
      schema: {
        id: 'contact-form', version: '1.0', title: '',
        layout: { type: 'grid', columns: 2, gap: 16 },
        sections: [{
          id: 'datos', title: 'Datos del Contacto',
          fields: [
            { id: 'nombre', type: 'text', field: 'nombre', label: 'Nombre', required: true },
            { id: 'apellido', type: 'text', field: 'apellido', label: 'Apellido', required: true },
            { id: 'email', type: 'email', field: 'email', label: 'Email', required: true },
            { id: 'telefono', type: 'phone', field: 'telefono', label: 'Telefono' },
            { id: 'empresa', type: 'text', field: 'empresa', label: 'Empresa' },
            { id: 'cargo', type: 'text', field: 'cargo', label: 'Cargo' },
            { id: 'origen', type: 'select', field: 'origen', label: 'Origen', props: { options: [
              { value: 'web', label: 'Sitio Web' }, { value: 'referido', label: 'Referido' },
              { value: 'llamada', label: 'Llamada' }, { value: 'evento', label: 'Evento' },
            ]}},
            { id: 'prioridad', type: 'rating', field: 'prioridad', label: 'Prioridad', props: { mode: 'rating' } },
            { id: 'notas', type: 'textarea', field: 'notas', label: 'Notas', colSpan: 2 },
          ],
        }],
        actions: [
          { id: 'guardar', type: 'submit', label: 'Guardar Contacto', variant: 'primary' },
          { id: 'cancelar', type: 'reset', label: 'Cancelar', variant: 'secondary' },
        ],
      },
    },
    { id: 'empresas', segment: 'empresas', title: 'Empresas', content: 'empty' },
    { id: 'oportunidades', segment: 'oportunidades', title: 'Oportunidades', content: 'empty' },
    { id: 'tareas', segment: 'tareas', title: 'Tareas', content: 'empty' },
    { id: 'calendario', segment: 'calendario', title: 'Calendario', content: 'empty' },
    { id: 'reportes', segment: 'reportes', title: 'Reportes', content: 'empty' },
    { id: 'configuracion', segment: 'configuracion', title: 'Configuracion', content: 'empty' },
  ],
};

/**
 * E-Commerce Admin template — product/order management
 */
export const TEMPLATE_ECOMMERCE: AppConfig = {
  id: 'ecommerce-admin',
  version: '1.0.0',
  branding: {
    title: 'E-Commerce',
    subtitle: 'Admin Panel',
    homeSegment: 'dashboard',
    primaryColor: '#27ae60',
    sidebarStyle: 'dark',
  },
  navigation: [
    { kind: 'header', title: 'TIENDA' },
    { segment: 'dashboard', title: 'Dashboard', icon: '📊' },
    { segment: 'productos', title: 'Productos', icon: '📦' },
    { segment: 'categorias', title: 'Categorias', icon: '🏷️' },
    { segment: 'pedidos', title: 'Pedidos', icon: '🛒', badge: 0 },
    { kind: 'header', title: 'CLIENTES' },
    { segment: 'clientes', title: 'Clientes', icon: '👥' },
    { segment: 'reviews', title: 'Reseñas', icon: '⭐' },
    { kind: 'divider' },
    { segment: 'reportes', title: 'Reportes', icon: '📈' },
    { segment: 'configuracion', title: 'Configuracion', icon: '⚙️' },
  ],
  pages: [
    {
      id: 'dashboard', segment: 'dashboard', title: 'Dashboard', content: 'cards',
      cardsConfig: {
        columns: 4, variant: 'kpi',
        items: [
          { id: 'k1', title: 'Ventas Hoy', value: '—' },
          { id: 'k2', title: 'Pedidos Nuevos', value: '—' },
          { id: 'k3', title: 'Productos Activos', value: '—' },
          { id: 'k4', title: 'Clientes', value: '—' },
        ],
      },
    },
    {
      id: 'productos', segment: 'productos', title: 'Productos', content: 'datagrid',
      gridConfig: {
        columns: [
          { field: 'sku', header: 'SKU', width: 100 },
          { field: 'nombre', header: 'Producto', width: 250 },
          { field: 'precio', header: 'Precio', width: 100, type: 'currency' },
          { field: 'stock', header: 'Stock', width: 80, type: 'number' },
          { field: 'estado', header: 'Estado', width: 100, type: 'status', statusColors: { Activo: '#27ae60', Borrador: '#95a5a6', Agotado: '#e74c3c' } },
        ],
        dataSourceId: 'productos',
        enableToolbar: true, enableSearch: true, enableExport: true,
      },
      actions: [{ id: 'nuevo', type: 'custom', label: 'Nuevo Producto', variant: 'primary' }],
    },
    { id: 'categorias', segment: 'categorias', title: 'Categorias', content: 'empty' },
    { id: 'pedidos', segment: 'pedidos', title: 'Pedidos', content: 'empty' },
    { id: 'clientes', segment: 'clientes', title: 'Clientes', content: 'empty' },
    { id: 'reviews', segment: 'reviews', title: 'Reseñas', content: 'empty' },
    { id: 'reportes', segment: 'reportes', title: 'Reportes', content: 'empty' },
    { id: 'configuracion', segment: 'configuracion', title: 'Configuracion', content: 'empty' },
  ],
};

/**
 * HR/Nomina template — employee management
 */
export const TEMPLATE_HR: AppConfig = {
  id: 'hr-app',
  version: '1.0.0',
  branding: {
    title: 'RRHH',
    subtitle: 'Recursos Humanos',
    homeSegment: 'dashboard',
    primaryColor: '#9b59b6',
    sidebarStyle: 'dark',
  },
  navigation: [
    { kind: 'header', title: 'RRHH' },
    { segment: 'dashboard', title: 'Dashboard', icon: '📊' },
    { segment: 'empleados', title: 'Empleados', icon: '👥' },
    { segment: 'nuevo-empleado', title: 'Nuevo Empleado', icon: '➕' },
    { segment: 'departamentos', title: 'Departamentos', icon: '🏢' },
    { kind: 'header', title: 'NOMINA' },
    { segment: 'nominas', title: 'Nominas', icon: '💰' },
    { segment: 'conceptos', title: 'Conceptos', icon: '📋' },
    { kind: 'divider' },
    { segment: 'vacaciones', title: 'Vacaciones', icon: '🏖️' },
    { segment: 'asistencia', title: 'Asistencia', icon: '🕐' },
    { segment: 'reportes', title: 'Reportes', icon: '📈' },
  ],
  pages: [
    {
      id: 'dashboard', segment: 'dashboard', title: 'Dashboard', content: 'cards',
      cardsConfig: {
        columns: 4, variant: 'kpi',
        items: [
          { id: 'k1', title: 'Empleados Activos', value: '—' },
          { id: 'k2', title: 'Nuevos este Mes', value: '—' },
          { id: 'k3', title: 'Nomina Mensual', value: '—' },
          { id: 'k4', title: 'Vacaciones Pendientes', value: '—' },
        ],
      },
    },
    {
      id: 'empleados', segment: 'empleados', title: 'Empleados', content: 'datagrid',
      gridConfig: {
        columns: [
          { field: 'codigo', header: 'Codigo', width: 80 },
          { field: 'nombre', header: 'Nombre', width: 200 },
          { field: 'cedula', header: 'Cedula', width: 120 },
          { field: 'departamento', header: 'Departamento', width: 150 },
          { field: 'cargo', header: 'Cargo', width: 150 },
          { field: 'salario', header: 'Salario', width: 120, type: 'currency' },
          { field: 'estado', header: 'Estado', width: 100, type: 'status', statusColors: { Activo: '#27ae60', Liquidado: '#e74c3c', Vacaciones: '#3498db' } },
        ],
        dataSourceId: 'empleados',
        enableToolbar: true, enableSearch: true, enableExport: true,
        onRowClick: 'navigate', rowClickSegment: 'empleados',
      },
      actions: [{ id: 'nuevo', type: 'custom', label: 'Nuevo Empleado', variant: 'primary' }],
    },
    {
      id: 'nuevo-empleado', segment: 'nuevo-empleado', title: 'Nuevo Empleado', content: 'schema',
      schema: {
        id: 'employee-form', version: '1.0', title: '',
        layout: { type: 'grid', columns: 3, gap: 16 },
        sections: [
          {
            id: 'personal', title: 'Datos Personales',
            fields: [
              { id: 'nombre', type: 'text', field: 'nombre', label: 'Nombre', required: true },
              { id: 'apellido', type: 'text', field: 'apellido', label: 'Apellido', required: true },
              { id: 'cedula', type: 'text', field: 'cedula', label: 'Cedula', required: true },
              { id: 'fechaNac', type: 'date', field: 'fechaNacimiento', label: 'Fecha Nacimiento' },
              { id: 'genero', type: 'select', field: 'genero', label: 'Genero', props: { options: [{ value: 'M', label: 'Masculino' }, { value: 'F', label: 'Femenino' }] } },
              { id: 'email', type: 'email', field: 'email', label: 'Email' },
              { id: 'telefono', type: 'phone', field: 'telefono', label: 'Telefono' },
              { id: 'direccion', type: 'address', field: 'direccion', label: 'Direccion', colSpan: 2 },
            ],
          },
          {
            id: 'laboral', title: 'Datos Laborales',
            fields: [
              { id: 'fechaIngreso', type: 'date', field: 'fechaIngreso', label: 'Fecha Ingreso', required: true },
              { id: 'departamento', type: 'select', field: 'departamento', label: 'Departamento', required: true, props: { options: [] } },
              { id: 'cargo', type: 'text', field: 'cargo', label: 'Cargo', required: true },
              { id: 'salario', type: 'currency', field: 'salario', label: 'Salario', required: true },
              { id: 'tipoContrato', type: 'select', field: 'tipoContrato', label: 'Tipo Contrato', props: { options: [
                { value: 'indefinido', label: 'Indefinido' }, { value: 'temporal', label: 'Temporal' },
                { value: 'prueba', label: 'Periodo de Prueba' },
              ] } },
              { id: 'activo', type: 'switch', field: 'activo', label: 'Empleado Activo' },
            ],
          },
        ],
        actions: [
          { id: 'guardar', type: 'submit', label: 'Guardar Empleado', variant: 'primary' },
          { id: 'cancelar', type: 'reset', label: 'Cancelar', variant: 'secondary' },
        ],
      },
    },
    { id: 'departamentos', segment: 'departamentos', title: 'Departamentos', content: 'empty' },
    { id: 'nominas', segment: 'nominas', title: 'Nominas', content: 'empty' },
    { id: 'conceptos', segment: 'conceptos', title: 'Conceptos', content: 'empty' },
    { id: 'vacaciones', segment: 'vacaciones', title: 'Vacaciones', content: 'empty' },
    { id: 'asistencia', segment: 'asistencia', title: 'Asistencia', content: 'empty' },
    { id: 'reportes', segment: 'reportes', title: 'Reportes', content: 'empty' },
  ],
};

/** All available templates */
export const APP_TEMPLATES = {
  blank: TEMPLATE_BLANK,
  crm: TEMPLATE_CRM,
  ecommerce: TEMPLATE_ECOMMERCE,
  hr: TEMPLATE_HR,
} as const;

export type AppTemplateId = keyof typeof APP_TEMPLATES;

/** Get a template by ID (returns a deep clone) */
export function getAppTemplate(id: AppTemplateId): AppConfig {
  return structuredClone(APP_TEMPLATES[id]);
}

/** List available templates with metadata */
export function listAppTemplates(): { id: string; title: string; description: string; icon: string }[] {
  return [
    { id: 'blank', title: 'En Blanco', description: 'Aplicacion vacia para empezar desde cero', icon: '📄' },
    { id: 'crm', title: 'CRM', description: 'Gestion de contactos, empresas y oportunidades', icon: '🤝' },
    { id: 'ecommerce', title: 'E-Commerce Admin', description: 'Panel de administracion de tienda online', icon: '🛒' },
    { id: 'hr', title: 'Recursos Humanos', description: 'Gestion de empleados, nomina y asistencia', icon: '👥' },
  ];
}
