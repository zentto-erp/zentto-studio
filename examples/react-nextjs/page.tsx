// Example: Zentto Studio in React / Next.js (App Router)
// File: app/my-form/page.tsx
//
// This file contains two examples:
//   1. CustomerForm — Dynamic form from StudioSchema
//   2. LandingPage — Full landing page from a template
//
// Requirements:
//   npm install @zentto/studio @zentto/studio-core @zentto/studio-react
//   next.config.mjs: transpilePackages: ['@zentto/studio', '@zentto/studio-core', '@zentto/studio-react', 'lit']

"use client";

import { useEffect, useState, useRef } from "react";
import type { StudioSchema } from "@zentto/studio-core";

// JSX type declaration for the web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "zentto-studio-renderer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & Record<string, any>,
        HTMLElement
      >;
    }
  }
}

const schema: StudioSchema = {
  id: "react-demo",
  version: "1.0",
  title: "Customer Registration",
  layout: { type: "grid", columns: 2, gap: 16 },
  sections: [
    {
      id: "personal",
      title: "Personal Data",
      fields: [
        { id: "name", type: "text", field: "name", label: "Full Name", required: true },
        { id: "email", type: "email", field: "email", label: "Email", required: true },
        { id: "phone", type: "phone", field: "phone", label: "Phone" },
        { id: "dob", type: "date", field: "dateOfBirth", label: "Date of Birth" },
        { id: "country", type: "select", field: "country", label: "Country",
          props: { options: [
            { value: "US", label: "United States" },
            { value: "MX", label: "Mexico" },
            { value: "ES", label: "Spain" },
          ]}
        },
        { id: "active", type: "switch", field: "active", label: "Active Customer" },
      ],
    },
    {
      id: "address",
      title: "Address",
      fields: [
        { id: "addr", type: "address", field: "address", label: "Address", colSpan: 2 },
      ],
    },
  ],
  actions: [
    { id: "save", type: "submit", label: "Save Customer", variant: "primary" },
    { id: "cancel", type: "reset", label: "Cancel", variant: "secondary" },
  ],
  rules: [
    {
      id: "r1",
      condition: '{country} == "US"',
      actions: [{ type: "setRequired", target: "phone" }],
    },
  ],
};

export default function CustomerForm() {
  const [registered, setRegistered] = useState(false);
  const formRef = useRef<HTMLElement>(null);

  // Dynamic import to avoid SSR issues with Lit
  useEffect(() => {
    import("@zentto/studio").then(() => setRegistered(true));
  }, []);

  // Bind schema and listen to events
  useEffect(() => {
    if (!registered || !formRef.current) return;
    (formRef.current as any).schema = schema;

    const handleSubmit = (e: Event) => {
      const data = (e as CustomEvent).detail.data;
      console.log("Form submitted:", data);
      // POST to your API
    };

    formRef.current.addEventListener("studio-submit", handleSubmit);
    return () => formRef.current?.removeEventListener("studio-submit", handleSubmit);
  }, [registered]);

  if (!registered) return <div>Loading form...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <zentto-studio-renderer ref={formRef} />
    </div>
  );
}


// ─── Example 2: Landing Page from Template ──────────────────────────

// File: app/landing/page.tsx

// JSX type declaration for the app web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "zentto-studio-app": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & Record<string, any>,
        HTMLElement
      >;
    }
  }
}

import {
  getLandingTemplate,
  applyThemePresetToConfig,
  getThemePreset,
  loadGoogleFonts,
} from "@zentto/studio-core";

export function LandingPage() {
  const [ready, setReady] = useState(false);
  const appRef = useRef<any>(null);

  // Load web components (app shell + landing sections)
  useEffect(() => {
    Promise.all([
      import("@zentto/studio/app"),
      import("@zentto/studio/landing"),
    ]).then(() => setReady(true));
  }, []);

  // Set config once components are registered
  useEffect(() => {
    if (!ready || !appRef.current) return;

    // 1. Pick a template
    let config = getLandingTemplate("saas-startup");

    // 2. Optionally apply a theme preset
    const preset = getThemePreset("emerald");
    if (preset) {
      config = applyThemePresetToConfig(config, preset);
    }

    // 3. Load Google Fonts used by the template
    loadGoogleFonts(["Inter", "Poppins"]);

    // 4. Assign to the web component
    appRef.current.config = config;
  }, [ready]);

  if (!ready) return <div>Loading landing page...</div>;

  return <zentto-studio-app ref={appRef} style={{ display: "block", width: "100%" }} />;
}
