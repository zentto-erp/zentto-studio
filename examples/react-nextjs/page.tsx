// Example: Zentto Studio in React / Next.js (App Router)
// File: app/my-form/page.tsx
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
