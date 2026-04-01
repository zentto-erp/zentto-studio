# Zentto Studio — Contexto para Agentes

## Que es esto

`@zentto/studio` es un **mini-framework web component** que genera aplicaciones completas desde JSON. Es como MUI Toolpad pero como web component Lit, publicado en npm bajo la org `@zentto`.

Un solo JSON (`AppConfig` o `StudioSchema`) → app completa con sidebar, header, routing, formularios, grids, charts, modales, toasts — todo renderizado dinámicamente dentro de una app React/Next.js en ejecución.

## Arquitectura

```
zentto-studio/                          ← D:\DatqBoxWorkspace\zentto-studio
├── packages/
│   ├── core/                           ← @zentto/studio-core (lógica pura, 0 deps UI)
│   │   └── src/
│   │       ├── types.ts                 Interfaces: StudioSchema, FieldConfig, etc.
│   │       ├── app-types.ts             Interfaces: AppConfig, NavItem, PageConfig, etc.
│   │       ├── providers.ts             StudioProvider: bridge con host app (iconos, fetch, auth)
│   │       ├── schema/studio-schema.ts  Validación Zod de schemas
│   │       ├── engine/
│   │       │   ├── expression.ts        Parser recursivo de expresiones ({precio} * {cantidad})
│   │       │   ├── data-binding.ts      Two-way binding con Proxy + dot-notation
│   │       │   ├── validation.ts        9 tipos de validación + custom expressions
│   │       │   ├── rule-engine.ts       show/hide/enable/disable/setValue condicional
│   │       │   └── action-engine.ts     submit, apiCall, navigate, reset
│   │       ├── data/data-source.ts      Fetch REST/GraphQL con dependencias + polling
│   │       ├── persistence/
│   │       │   ├── schema-store.ts      localStorage + remote @zentto/cache sync
│   │       │   └── flavor-manager.ts    Vistas por rol (SAP Personas)
│   │       ├── registry/field-registry.ts  38 tipos de campo registrados
│   │       ├── templates/
│   │       │   ├── app-templates.ts      Templates CRM, E-Commerce, HR
│   │       │   ├── landing-templates.ts  15 landing page templates (117 KB)
│   │       │   └── theme-presets.ts      8 color scheme presets
│   │       ├── utils/font-loader.ts     Google Fonts loader (loadGoogleFont, POPULAR_FONTS)
│   │       ├── events/event-bus.ts      Pub/sub tipado
│   │       └── i18n/                    es, en, pt
│   │
│   ├── web-component/                  ← @zentto/studio (Lit 3.x web components)
│   │   └── src/
│   │       ├── zentto-studio-renderer.ts   <zentto-studio-renderer> — renderiza StudioSchema
│   │       ├── zentto-studio-app.ts        <zentto-studio-app> — app completa desde AppConfig
│   │       ├── zentto-studio-designer.ts   <zentto-studio-designer> — placeholder
│   │       ├── fields/                     17 componentes de campo Lit:
│   │       │   ├── zs-field-text.ts         text, textarea, email, url, password, phone
│   │       │   ├── zs-field-number.ts       number, currency, percentage, slider, rating
│   │       │   ├── zs-field-select.ts       select, multiselect, tags
│   │       │   ├── zs-field-date.ts         date, time, datetime
│   │       │   ├── zs-field-checkbox.ts     checkbox, radio
│   │       │   ├── zs-field-switch.ts       toggle switch
│   │       │   ├── zs-field-file.ts         file upload con drag-drop + preview
│   │       │   ├── zs-field-lookup.ts       async search con debounce
│   │       │   ├── zs-field-signature.ts    canvas firma digital
│   │       │   ├── zs-field-address.ts      compuesto: calle, ciudad, estado, CP, pais
│   │       │   ├── zs-field-chart.ts        SVG bar, line, pie, donut
│   │       │   ├── zs-field-chips.ts        chips/tags con autocomplete + colores
│   │       │   ├── zs-field-treeview.ts     árbol recursivo con checkboxes + search
│   │       │   ├── zs-field-separator.ts    línea divisoria
│   │       │   ├── zs-field-heading.ts      H1-H4
│   │       │   ├── zs-field-html.ts         contenido HTML libre
│   │       │   ├── zs-field-media.ts        image, video, audio, iframe
│   │       │   ├── zs-modal.ts              modal genérico (sm/md/lg/fullscreen/side-panel)
│   │       │   ├── zs-toast.ts              toasts apilables con progress bar
│   │       │   └── zs-confirm-dialog.ts     confirm/alert/prompt/delete/decision (Promise)
│   │       ├── designer/
│   │       │   ├── zs-page-designer.ts      Designer visual Figma-style con:
│   │       │   │                             - Toolbox 3 columnas (drag to canvas)
│   │       │   │                             - Canvas con grid pattern + resize handles
│   │       │   │                             - Properties panel Figma-style
│   │       │   │                             - Undo/redo (50 items) + autosave
│   │       │   │                             - Tab API: login, fetch fields, accesos rápidos Zentto
│   │       │   │                             - 7 templates: blank, contacto, cliente, empleado, factura, producto, encuesta
│   │       │   │                             - Vistas: Diseño, Preview live, JSON
│   │       │   ├── zs-landing-designer.ts   Visual landing page editor con:
│   │       │   │                             - Section drag-drop + reorder
│   │       │   │                             - Property panel por sección
│   │       │   │                             - Live preview
│   │       │   │                             - Undo/redo
│   │       │   │                             - Template selector (15 templates)
│   │       │   │                             - Theme preset picker (8 presets)
│   │       │   └── zs-app-wizard.ts         Wizard 5 pasos para crear AppConfig
│   │       ├── landing/                     Landing page components (14 section types):
│   │       │   ├── zs-landing-page.ts        Orquesta navbar + sections + footer
│   │       │   ├── zs-landing-navbar.ts      Responsive navbar con links + CTA
│   │       │   ├── zs-landing-footer.ts      Multi-column footer
│   │       │   ├── zs-landing-styles.ts      CSS tokens --zl-*, reset, buttons
│   │       │   ├── zs-section-hero.ts        Hero con headline, CTA, imagen
│   │       │   ├── zs-section-features.ts    Feature cards grid
│   │       │   ├── zs-section-pricing.ts     Tabla de precios
│   │       │   ├── zs-section-testimonials.ts Testimonios grid/carousel
│   │       │   ├── zs-section-cta.ts         Call-to-action banner
│   │       │   ├── zs-section-stats.ts       Métricas / counters
│   │       │   ├── zs-section-faq.ts         FAQ accordion
│   │       │   ├── zs-section-team.ts        Team member cards
│   │       │   ├── zs-section-gallery.ts     Image gallery grid
│   │       │   ├── zs-section-logos.ts       Logo cloud
│   │       │   ├── zs-section-content.ts     Rich text content
│   │       │   ├── zs-section-video.ts       Embedded video
│   │       │   ├── zs-section-contact.ts     Contact form
│   │       │   └── zs-section-html.ts        Raw HTML
│   │       ├── blog/                        Blog engine:
│   │       │   ├── zs-blog-list.ts           Post list (grid/list/magazine layouts)
│   │       │   ├── zs-blog-card.ts           Single post card
│   │       │   └── zs-blog-post.ts           Full post view (Markdown parser, JSON-LD)
│   │       └── styles/tokens.ts             Design tokens --zs-* (light + dark)
│   │
│   └── react/                          ← @zentto/studio-react
│       └── src/index.ts                   createComponent wrapper + re-exports
│
├── .github/workflows/                  CI + publish npm + beta channel
├── turbo.json, tsconfig.base.json      Monorepo config (idéntico a zentto-datagrid/zentto-report)
└── package.json                        Workspaces: packages/*
```

## Versión actual: 0.7.0 en npm

```bash
npm install @zentto/studio-core@0.6.0 @zentto/studio@0.6.0 @zentto/studio-react@0.6.0
```

## Cómo se usa

### En React/Next.js (lab app):

```tsx
"use client";
import { useEffect, useState, useRef } from "react";

export default function Page() {
  const [ready, setReady] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    import("@zentto/studio").then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || !ref.current) return;
    ref.current.config = { /* AppConfig JSON */ };
    // o: ref.current.schema = { /* StudioSchema JSON */ };
  }, [ready]);

  return ready ? <zentto-studio-app ref={ref} /> : <div>Cargando...</div>;
}
```

### next.config.mjs requiere:
```js
transpilePackages: ['@zentto/studio', '@zentto/studio-core', '@zentto/studio-react', 'lit']
```

## Donde se prueba

```
D:\DatqBoxWorkspace\DatqBoxWeb\web\modular-frontend\apps\lab
Port: 3016
```

Páginas de demo:
- `/studio` — App completa (dashboard cards, grids, forms, charts)
- `/studio-wizard` — Wizard para crear apps
- `/studio-designer` — Designer visual con modales/toasts/API
- `/studio-landing` — Landing page preview (15 templates)
- `/studio-landing-designer` — Landing page visual editor
- `/studio-blog` — Blog engine demo

## Ecosistema relacionado

| Repo | Path | Que es |
|------|------|--------|
| zentto-datagrid | D:\DatqBoxWorkspace\zentto-datagrid | Web component grid (v1.2.8) — @zentto/datagrid |
| zentto-report | D:\DatqBoxWorkspace\zentto-report | Web component reportes (v1.9.2) — @zentto/report-* |
| zentto-cache | D:\DatqBoxWorkspace\zentto-cache | Microservicio Redis para layouts/templates — @zentto/cache |
| DatqBoxWeb | D:\DatqBoxWorkspace\DatqBoxWeb | Monorepo principal (API + modular-frontend) |

## Patrones clave

1. **Monorepo Turbo** — `npm workspaces` + `turbo build` (dependsOn: ^build)
2. **Lit 3.x** — web components con @customElement, @property, @state
3. **ESM only** — `"type": "module"`, target ES2022
4. **tsc directo** — sin bundler, TypeScript → dist/
5. **Zod** — validación de schemas
6. **Expression engine** — parser recursivo (fork de report-core), NO eval()
7. **Provider pattern** — host app inyecta: resolveIcon, fetchData, getAuthHeaders, navigate, customFields
8. **CSS custom properties** — --zs-* para theming
9. **Events** — CustomEvent con bubbles:true, composed:true

## Publicar nueva versión

```bash
cd d:/DatqBoxWorkspace/zentto-studio
npx turbo build --force
# Bump version en los 3 package.json
echo "//registry.npmjs.org/:_authToken=<NPM_TOKEN>" > .npmrc
cd packages/core && npm publish --access public
cd ../web-component && npm publish --access public
cd ../react && npm publish --access public
cd ../.. && rm .npmrc
```

## Actualizar en lab

```bash
cd d:/DatqBoxWorkspace/DatqBoxWeb/web/modular-frontend
npm install @zentto/studio-core@X.Y.Z @zentto/studio@X.Y.Z @zentto/studio-react@X.Y.Z -w apps/lab
rm -rf apps/lab/.next node_modules/.cache
```

## Completado (Fases 1–6)

- [x] **Landing page system** — `appMode: 'landing'` renderiza full-page sin sidebar/header
- [x] **14 section types** — hero, features, pricing, testimonials, cta, stats, faq, team, gallery, logos, content, video, contact, html
- [x] **15 landing templates** — saas-startup, saas-product, portfolio-minimal, portfolio-agency, restaurant-menu, event-conference, ecommerce-store, blog-standard, blog-magazine, consulting-firm, nonprofit-charity, fitness-gym, realestate-listing, education-course, app-download
- [x] **Blog engine** — `<zs-blog-list>`, `<zs-blog-card>`, `<zs-blog-post>` con Markdown parser, 3 layouts
- [x] **Landing designer** — `<zs-landing-designer>` visual editor con section drag-drop, property panel, live preview, undo/redo, template selector
- [x] **8 theme presets** — indigo, emerald, rose, amber, ocean, slate, midnight, sunset
- [x] **Dark mode** — via `theme="dark"` attribute
- [x] **Google Fonts loader** — `loadGoogleFont()`, `loadGoogleFonts()`, `POPULAR_FONTS`
- [x] **Scroll animations** — IntersectionObserver-based, staggered children
- [x] **Lazy-load sections** — Below-fold sections render placeholder until scrolled
- [x] **JSON-LD** — Auto-generation Article schema for blog posts
- [x] **SEO** — `SeoConfig` + `updateSeo()` provider method + `landing-seo` event

## Lo que falta (Fase siguiente)

1. **Persistencia en @zentto/cache** — Templates y schemas del designer se guardan/leen de cache.zentto.net en vez de hardcoded
2. **Drag-drop real con InteractJS** — Mover campos libremente en canvas (como report-designer)
3. **Integración zentto-grid dentro del designer** — Campo datagrid que embebe <zentto-grid> real con columns config
4. **Integración zentto-report-viewer** — Campo report que embebe el viewer real
5. **Provider completo con MUI icons** — resolveIcon que mapea nombres MUI a SVG
6. **Wizard amigable para usuarios finales** — Más pasos, preview en cada paso
7. **Exportar a código** — Generar componente React/Next.js desde el schema
8. **GitHub repo zentto-erp/zentto-studio** — Crear repo, push, configurar Actions

## Reglas del proyecto

- Toda salida en español
- Variables/funciones en inglés
- No exponer secretos de .env
- No git push sin confirmación
- No Co-Authored-By en commits
- Feature branch → PR (nunca main directo)
- Siempre build + test antes de publish
- npm token: stored in memory secrets (bypass 2FA, granular)
