// @zentto/studio-core — Zentto API endpoint catalog
// Complete list of available endpoints organized by module

export interface ApiEndpoint {
  path: string;
  label: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description?: string;
  module: string;
}

export interface ApiModule {
  id: string;
  label: string;
  icon: string;
  endpoints: ApiEndpoint[];
}

export const API_CATALOG: ApiModule[] = [
  {
    id: 'clientes', label: 'Clientes', icon: '👥',
    endpoints: [
      { path: '/v1/clientes', label: 'Listar Clientes', method: 'GET', module: 'clientes' },
      { path: '/v1/clientes/:id', label: 'Detalle Cliente', method: 'GET', module: 'clientes' },
      { path: '/v1/cxc/documentos', label: 'Cuentas por Cobrar', method: 'GET', module: 'clientes' },
      { path: '/v1/cxc/saldo/:codCliente', label: 'Saldo Cliente', method: 'GET', module: 'clientes' },
    ],
  },
  {
    id: 'proveedores', label: 'Proveedores', icon: '🏭',
    endpoints: [
      { path: '/v1/proveedores', label: 'Listar Proveedores', method: 'GET', module: 'proveedores' },
      { path: '/v1/cxp/documentos', label: 'Cuentas por Pagar', method: 'GET', module: 'proveedores' },
      { path: '/v1/cxp/saldo/:codProveedor', label: 'Saldo Proveedor', method: 'GET', module: 'proveedores' },
    ],
  },
  {
    id: 'inventario', label: 'Inventario', icon: '📦',
    endpoints: [
      { path: '/v1/articulos', label: 'Listar Articulos', method: 'GET', module: 'inventario' },
      { path: '/v1/inventario', label: 'Inventario', method: 'GET', module: 'inventario' },
      { path: '/v1/movinvent', label: 'Movimientos', method: 'GET', module: 'inventario' },
      { path: '/v1/inventario-avanzado', label: 'Inventario Avanzado', method: 'GET', module: 'inventario' },
      { path: '/v1/categorias', label: 'Categorias', method: 'GET', module: 'inventario' },
      { path: '/v1/marcas', label: 'Marcas', method: 'GET', module: 'inventario' },
      { path: '/v1/unidades', label: 'Unidades', method: 'GET', module: 'inventario' },
      { path: '/v1/lineas', label: 'Lineas', method: 'GET', module: 'inventario' },
      { path: '/v1/clases', label: 'Clases', method: 'GET', module: 'inventario' },
      { path: '/v1/grupos', label: 'Grupos', method: 'GET', module: 'inventario' },
    ],
  },
  {
    id: 'ventas', label: 'Ventas', icon: '💰',
    endpoints: [
      { path: '/v1/documentos-venta', label: 'Documentos de Venta', method: 'GET', module: 'ventas' },
      { path: '/v1/documentos-venta?tipoOperacion=FACT', label: 'Facturas', method: 'GET', module: 'ventas' },
      { path: '/v1/documentos-venta?tipoOperacion=PRESUP', label: 'Presupuestos', method: 'GET', module: 'ventas' },
      { path: '/v1/documentos-venta?tipoOperacion=PEDIDO', label: 'Pedidos', method: 'GET', module: 'ventas' },
      { path: '/v1/vendedores', label: 'Vendedores', method: 'GET', module: 'ventas' },
    ],
  },
  {
    id: 'compras', label: 'Compras', icon: '🛒',
    endpoints: [
      { path: '/v1/documentos-compra', label: 'Documentos de Compra', method: 'GET', module: 'compras' },
    ],
  },
  {
    id: 'bancos', label: 'Bancos', icon: '🏦',
    endpoints: [
      { path: '/v1/bancos', label: 'Listar Bancos', method: 'GET', module: 'bancos' },
    ],
  },
  {
    id: 'nomina', label: 'Nomina', icon: '👷',
    endpoints: [
      { path: '/v1/empleados', label: 'Empleados', method: 'GET', module: 'nomina' },
      { path: '/v1/nomina', label: 'Nomina', method: 'GET', module: 'nomina' },
    ],
  },
  {
    id: 'rrhh', label: 'RRHH', icon: '🏢',
    endpoints: [
      { path: '/v1/rrhh/utilidades', label: 'Utilidades', method: 'GET', module: 'rrhh' },
      { path: '/v1/rrhh/fideicomiso', label: 'Fideicomiso', method: 'GET', module: 'rrhh' },
      { path: '/v1/rrhh/caja-ahorro', label: 'Caja de Ahorro', method: 'GET', module: 'rrhh' },
      { path: '/v1/rrhh/salud-ocupacional', label: 'Salud Ocupacional', method: 'GET', module: 'rrhh' },
      { path: '/v1/rrhh/capacitacion', label: 'Capacitacion', method: 'GET', module: 'rrhh' },
      { path: '/v1/rrhh/comites', label: 'Comites', method: 'GET', module: 'rrhh' },
      { path: '/v1/rrhh/obligaciones', label: 'Obligaciones Legales', method: 'GET', module: 'rrhh' },
    ],
  },
  {
    id: 'contabilidad', label: 'Contabilidad', icon: '🏛',
    endpoints: [
      { path: '/v1/contabilidad', label: 'Contabilidad', method: 'GET', module: 'contabilidad' },
      { path: '/v1/cuentas', label: 'Plan de Cuentas', method: 'GET', module: 'contabilidad' },
      { path: '/v1/centro-costo', label: 'Centros de Costo', method: 'GET', module: 'contabilidad' },
    ],
  },
  {
    id: 'pos', label: 'POS', icon: '🖥',
    endpoints: [
      { path: '/v1/pos', label: 'Punto de Venta', method: 'GET', module: 'pos' },
    ],
  },
  {
    id: 'restaurante', label: 'Restaurante', icon: '🍽',
    endpoints: [
      { path: '/v1/restaurante', label: 'Restaurante', method: 'GET', module: 'restaurante' },
    ],
  },
  {
    id: 'logistica', label: 'Logistica', icon: '🚚',
    endpoints: [
      { path: '/v1/logistica', label: 'Logistica', method: 'GET', module: 'logistica' },
    ],
  },
  {
    id: 'crm', label: 'CRM', icon: '🤝',
    endpoints: [
      { path: '/v1/crm', label: 'CRM', method: 'GET', module: 'crm' },
    ],
  },
  {
    id: 'manufactura', label: 'Manufactura', icon: '🏭',
    endpoints: [
      { path: '/v1/manufactura', label: 'Manufactura', method: 'GET', module: 'manufactura' },
    ],
  },
  {
    id: 'flota', label: 'Flota', icon: '🚗',
    endpoints: [
      { path: '/v1/flota', label: 'Flota', method: 'GET', module: 'flota' },
    ],
  },
  {
    id: 'config', label: 'Configuracion', icon: '⚙',
    endpoints: [
      { path: '/v1/config/countries', label: 'Paises', method: 'GET', module: 'config' },
      { path: '/v1/config/states/:code', label: 'Estados/Provincias', method: 'GET', module: 'config' },
      { path: '/v1/config/lookups/:type', label: 'Lookups', method: 'GET', module: 'config' },
      { path: '/v1/tipos', label: 'Tipos', method: 'GET', module: 'config' },
      { path: '/v1/settings', label: 'Settings', method: 'GET', module: 'config' },
      { path: '/v1/empresa', label: 'Empresa', method: 'GET', module: 'config' },
      { path: '/v1/usuarios', label: 'Usuarios', method: 'GET', module: 'config' },
      { path: '/v1/almacen', label: 'Almacenes', method: 'GET', module: 'config' },
    ],
  },
  {
    id: 'reportes', label: 'Reportes', icon: '📊',
    endpoints: [
      { path: '/v1/reportes', label: 'Reportes', method: 'GET', module: 'reportes' },
    ],
  },
  {
    id: 'fiscal', label: 'Fiscal', icon: '📋',
    endpoints: [
      { path: '/v1/fiscal', label: 'Fiscal', method: 'GET', module: 'fiscal' },
      { path: '/v1/retenciones', label: 'Retenciones', method: 'GET', module: 'fiscal' },
    ],
  },
  {
    id: 'auditoria', label: 'Auditoria', icon: '✅',
    endpoints: [
      { path: '/v1/auditoria', label: 'Auditoria', method: 'GET', module: 'auditoria' },
      { path: '/v1/supervision', label: 'Supervision', method: 'GET', module: 'auditoria' },
    ],
  },
];

/** Get all endpoints flat */
export function getAllEndpoints(): ApiEndpoint[] {
  return API_CATALOG.flatMap(m => m.endpoints);
}

/** Search endpoints by label or path */
export function searchEndpoints(query: string): ApiEndpoint[] {
  const q = query.toLowerCase();
  return getAllEndpoints().filter(ep =>
    ep.label.toLowerCase().includes(q) || ep.path.toLowerCase().includes(q)
  );
}
