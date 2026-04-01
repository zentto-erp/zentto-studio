// @zentto/studio-core — Pre-built Landing Page templates
// WordPress-inspired, JSON-driven, zero-code landing pages

import type { AppConfig } from '../app-types.js';

// ─── Template Metadata ───────────────────────────────────────────

export type LandingTemplateCategory =
  | 'saas' | 'portfolio' | 'agency' | 'restaurant' | 'blog'
  | 'ecommerce' | 'event' | 'professional' | 'nonprofit'
  | 'fitness' | 'realestate' | 'education' | 'mobile-app';

export interface LandingTemplateMeta {
  id: string;
  title: string;
  description: string;
  category: LandingTemplateCategory;
  icon: string;
  tags: string[];
}

// ─── Template: SaaS Startup ──────────────────────────────────────

const TEMPLATE_SAAS_STARTUP: AppConfig = {
  id: 'saas-startup',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'LaunchPad',
    subtitle: 'Ship faster, grow smarter',
    homeSegment: 'home',
    primaryColor: '#6366f1',
  },
  landingConfig: {
    navbar: {
      title: 'LaunchPad',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Testimonials', href: '#testimonials' },
        { label: 'FAQ', href: '#faq' },
      ],
      ctaButton: { label: 'Start Free Trial', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        {
          title: 'Product',
          links: [
            { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Integrations', href: '#' },
            { label: 'Changelog', href: '#' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Careers', href: '#' },
            { label: 'Contact', href: '#contact' },
          ],
        },
        {
          title: 'Resources',
          links: [
            { label: 'Documentation', href: '#' },
            { label: 'Help Center', href: '#' },
            { label: 'API Reference', href: '#' },
            { label: 'Status', href: '#' },
          ],
        },
        {
          title: 'Legal',
          links: [
            { label: 'Privacy', href: '#' },
            { label: 'Terms', href: '#' },
            { label: 'Cookie Policy', href: '#' },
          ],
        },
      ],
      copyright: '© 2026 LaunchPad. All rights reserved.',
      socialLinks: [
        { icon: '𝕏', url: '#' },
        { icon: '💼', url: '#' },
        { icon: '📺', url: '#' },
      ],
    },
    seo: {
      title: 'LaunchPad — Ship faster, grow smarter',
      description: 'The all-in-one platform to launch your SaaS product. Build, deploy, and scale with confidence.',
      ogType: 'website',
    },
  },
  navigation: [],
  pages: [
    {
      id: 'home',
      segment: 'home',
      title: 'Home',
      content: 'landing',
      landingSections: [
        {
          id: 'hero',
          type: 'hero',
          variant: 'centered',
          heroConfig: {
            headline: 'Build and launch your SaaS in record time',
            subheadline: 'The modern platform for ambitious teams',
            description: 'Everything you need to go from idea to production. Authentication, billing, analytics, and more — all out of the box.',
            primaryCta: { label: 'Start Free Trial', href: '#pricing' },
            secondaryCta: { label: 'Watch Demo', href: '#video' },
            alignment: 'center',
            minHeight: '85vh',
          },
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            overlay: 'rgba(0,0,0,0.15)',
          },
        },
        {
          id: 'logos',
          type: 'logos',
          padding: 'sm',
          logosConfig: {
            headline: 'Trusted by 500+ innovative companies',
            logos: [
              { src: '', alt: 'Acme Corp' },
              { src: '', alt: 'TechFlow' },
              { src: '', alt: 'CloudBase' },
              { src: '', alt: 'DataSync' },
              { src: '', alt: 'ScaleUp' },
            ],
            grayscale: true,
          },
        },
        {
          id: 'features',
          type: 'features',
          anchor: 'features',
          featuresConfig: {
            headline: 'Everything you need to succeed',
            subtitle: 'Powerful features that help you build, launch, and grow your product faster than ever.',
            items: [
              { icon: '🚀', title: 'Lightning Fast', description: 'Optimized for speed with edge deployments and smart caching. Your app loads in under 100ms.' },
              { icon: '🔒', title: 'Enterprise Security', description: 'SOC 2 compliant with end-to-end encryption, SSO, and role-based access control built in.' },
              { icon: '📊', title: 'Real-time Analytics', description: 'Track every metric that matters with beautiful dashboards and custom reports.' },
              { icon: '🔌', title: '100+ Integrations', description: 'Connect with Slack, Stripe, HubSpot, and hundreds more. Or build your own with our API.' },
              { icon: '🌍', title: 'Global Scale', description: 'Auto-scaling infrastructure across 24 regions. Handle millions of users without breaking a sweat.' },
              { icon: '🤖', title: 'AI-Powered', description: 'Smart recommendations, automated workflows, and predictive insights powered by AI.' },
            ],
            columns: 3,
            variant: 'cards',
          },
        },
        {
          id: 'stats',
          type: 'stats',
          background: { type: 'color', value: '#f8fafc' },
          statsConfig: {
            items: [
              { value: '10K', label: 'Active Users', suffix: '+' },
              { value: '99.9', label: 'Uptime', suffix: '%' },
              { value: '500', label: 'Companies', suffix: '+' },
              { value: '4.9', label: 'Rating', suffix: '/5' },
            ],
          },
        },
        {
          id: 'pricing',
          type: 'pricing',
          anchor: 'pricing',
          pricingConfig: {
            headline: 'Simple, transparent pricing',
            subtitle: 'No hidden fees. No surprises. Cancel anytime.',
            plans: [
              {
                name: 'Starter',
                price: '$29',
                period: '/mo',
                description: 'Perfect for small teams getting started.',
                features: ['Up to 5 team members', '10GB storage', 'Basic analytics', 'Email support', 'API access'],
                cta: { label: 'Start Free Trial', href: '#' },
              },
              {
                name: 'Pro',
                price: '$79',
                period: '/mo',
                description: 'For growing teams that need more power.',
                features: ['Up to 25 team members', '100GB storage', 'Advanced analytics', 'Priority support', 'API access', 'Custom integrations', 'SSO'],
                cta: { label: 'Start Free Trial', href: '#' },
                highlighted: true,
                badge: 'Most Popular',
              },
              {
                name: 'Enterprise',
                price: '$199',
                period: '/mo',
                description: 'For large organizations with custom needs.',
                features: ['Unlimited team members', '1TB storage', 'Custom analytics', '24/7 phone support', 'API access', 'Custom integrations', 'SSO', 'SLA guarantee', 'Dedicated manager'],
                cta: { label: 'Contact Sales', href: '#contact' },
              },
            ],
            billingToggle: true,
          },
        },
        {
          id: 'testimonials',
          type: 'testimonials',
          anchor: 'testimonials',
          background: { type: 'color', value: '#f8fafc' },
          testimonialsConfig: {
            headline: 'Loved by teams worldwide',
            items: [
              { quote: 'LaunchPad cut our development time in half. We shipped our MVP in just 3 weeks instead of the usual 3 months.', name: 'Sarah Chen', title: 'CTO', company: 'TechFlow', rating: 5 },
              { quote: 'The best developer experience I have ever had. Everything just works out of the box.', name: 'Marcus Johnson', title: 'Lead Developer', company: 'ScaleUp', rating: 5 },
              { quote: 'We migrated from three different tools to LaunchPad and our team productivity went through the roof.', name: 'Ana Rodriguez', title: 'VP Engineering', company: 'CloudBase', rating: 5 },
            ],
            variant: 'grid',
          },
        },
        {
          id: 'faq',
          type: 'faq',
          anchor: 'faq',
          faqConfig: {
            headline: 'Frequently asked questions',
            subtitle: 'Can\'t find what you\'re looking for? Contact our support team.',
            items: [
              { question: 'How does the free trial work?', answer: 'You get 14 days of full access to all Pro features. No credit card required. At the end of the trial, choose a plan or downgrade to the free tier.' },
              { question: 'Can I change plans later?', answer: 'Absolutely! You can upgrade or downgrade at any time. Changes take effect immediately and we prorate the billing.' },
              { question: 'What kind of support do you offer?', answer: 'All plans include email support. Pro plans get priority response times, and Enterprise plans include 24/7 phone support with a dedicated account manager.' },
              { question: 'Is my data secure?', answer: 'Yes. We are SOC 2 Type II certified, use end-to-end encryption, and never share your data. All data is stored in ISO 27001 certified data centers.' },
              { question: 'Do you offer a discount for annual billing?', answer: 'Yes! Annual plans save you 20% compared to monthly billing. Contact sales for custom enterprise pricing.' },
            ],
            variant: 'accordion',
          },
        },
        {
          id: 'cta',
          type: 'cta',
          anchor: 'cta',
          ctaConfig: {
            headline: 'Ready to launch your next big idea?',
            description: 'Join 10,000+ teams already building with LaunchPad. Start your free trial today.',
            primaryCta: { label: 'Start Free Trial', href: '#' },
            secondaryCta: { label: 'Book a Demo', href: '#' },
            variant: 'centered',
          },
        },
      ],
    },
  ],
};

// ─── Template: Portfolio Minimal ─────────────────────────────────

const TEMPLATE_PORTFOLIO_MINIMAL: AppConfig = {
  id: 'portfolio-minimal',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'Portfolio',
    homeSegment: 'home',
    primaryColor: '#1a1a1a',
  },
  landingConfig: {
    navbar: {
      title: 'Alex Rivera',
      links: [
        { label: 'Work', href: '#gallery' },
        { label: 'About', href: '#about' },
        { label: 'Stats', href: '#stats' },
        { label: 'Contact', href: '#contact' },
      ],
      ctaButton: { label: 'Hire Me', href: '#contact', variant: 'primary' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        {
          title: 'Navigation',
          links: [
            { label: 'Home', href: '#' },
            { label: 'Work', href: '#gallery' },
            { label: 'About', href: '#about' },
            { label: 'Contact', href: '#contact' },
          ],
        },
        {
          title: 'Social',
          links: [
            { label: 'Dribbble', href: '#', external: true },
            { label: 'Behance', href: '#', external: true },
            { label: 'Instagram', href: '#', external: true },
            { label: 'LinkedIn', href: '#', external: true },
          ],
        },
      ],
      copyright: '© 2026 Alex Rivera. Crafted with passion.',
    },
    seo: {
      title: 'Alex Rivera — Creative Designer & Developer',
      description: 'Portfolio of Alex Rivera. UI/UX design, branding, and web development for modern brands.',
    },
  },
  navigation: [],
  pages: [
    {
      id: 'home',
      segment: 'home',
      title: 'Home',
      content: 'landing',
      landingSections: [
        {
          id: 'hero',
          type: 'hero',
          variant: 'centered',
          heroConfig: {
            subheadline: 'Creative Designer & Developer',
            headline: 'I craft digital experiences that people love',
            description: 'Specializing in UI/UX design, branding, and full-stack web development. Turning complex problems into elegant, intuitive solutions.',
            primaryCta: { label: 'See My Work', href: '#gallery' },
            secondaryCta: { label: 'Get In Touch', href: '#contact' },
            alignment: 'center',
            minHeight: '90vh',
          },
        },
        {
          id: 'gallery',
          type: 'gallery',
          anchor: 'gallery',
          galleryConfig: {
            headline: 'Selected Work',
            images: [
              { src: 'https://placehold.co/600x400/e2e8f0/475569?text=Brand+Identity', alt: 'Brand Identity Project', caption: 'Brand Identity — Acme Corp' },
              { src: 'https://placehold.co/600x400/dbeafe/1e40af?text=Web+App', alt: 'Web Application', caption: 'Web App — FinanceFlow' },
              { src: 'https://placehold.co/600x400/fce7f3/be185d?text=Mobile+App', alt: 'Mobile Application', caption: 'Mobile App — FitTrack' },
              { src: 'https://placehold.co/600x400/dcfce7/166534?text=Dashboard', alt: 'Dashboard Design', caption: 'Dashboard — CloudMetrics' },
              { src: 'https://placehold.co/600x400/fef3c7/92400e?text=E-Commerce', alt: 'E-Commerce Design', caption: 'E-Commerce — StyleHub' },
              { src: 'https://placehold.co/600x400/ede9fe/5b21b6?text=Landing+Page', alt: 'Landing Page', caption: 'Landing — TechStart' },
            ],
            columns: 3,
            variant: 'grid',
          },
        },
        {
          id: 'about',
          type: 'content',
          anchor: 'about',
          contentConfig: {
            headline: 'About Me',
            body: '<p>I\'m a multidisciplinary designer and developer with over 8 years of experience creating digital products. I believe in the power of design to solve real problems and create meaningful connections.</p><p>My approach combines strategic thinking with meticulous attention to detail. Every pixel matters, every interaction counts.</p><p><strong>Skills:</strong> UI/UX Design, React, TypeScript, Node.js, Figma, Motion Design</p>',
            image: 'https://placehold.co/500x600/f1f5f9/334155?text=Alex+Rivera',
            imagePosition: 'right',
            bodyFormat: 'html',
          },
        },
        {
          id: 'stats',
          type: 'stats',
          anchor: 'stats',
          background: { type: 'color', value: '#1a1a1a' },
          statsConfig: {
            items: [
              { value: '8', label: 'Years Experience', suffix: '+' },
              { value: '150', label: 'Projects Completed', suffix: '+' },
              { value: '50', label: 'Happy Clients', suffix: '+' },
              { value: '12', label: 'Design Awards', suffix: '' },
            ],
          },
        },
        {
          id: 'contact',
          type: 'cta',
          anchor: 'contact',
          ctaConfig: {
            headline: 'Let\'s work together',
            description: 'Have a project in mind? I\'d love to hear about it. Drop me a line and let\'s create something amazing.',
            primaryCta: { label: 'Send me an email', href: 'mailto:hello@alexrivera.com' },
            secondaryCta: { label: 'Schedule a call', href: '#' },
            variant: 'centered',
          },
        },
      ],
    },
  ],
};

// ─── Template: Restaurant ────────────────────────────────────────

const TEMPLATE_RESTAURANT: AppConfig = {
  id: 'restaurant-menu',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'La Trattoria',
    homeSegment: 'home',
    primaryColor: '#b45309',
  },
  landingConfig: {
    navbar: {
      title: 'La Trattoria',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Menu', href: '#gallery' },
        { label: 'Hours', href: '#stats' },
        { label: 'Contact', href: '#contact' },
      ],
      ctaButton: { label: 'Reserve a Table', href: '#contact' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        {
          title: 'Hours',
          links: [
            { label: 'Mon-Fri: 11am - 10pm', href: '#' },
            { label: 'Sat: 10am - 11pm', href: '#' },
            { label: 'Sun: 10am - 9pm', href: '#' },
          ],
        },
        {
          title: 'Location',
          links: [
            { label: '123 Main Street', href: '#' },
            { label: 'New York, NY 10001', href: '#' },
            { label: '+1 (555) 123-4567', href: 'tel:+15551234567' },
          ],
        },
        {
          title: 'Follow Us',
          links: [
            { label: 'Instagram', href: '#', external: true },
            { label: 'Facebook', href: '#', external: true },
            { label: 'TripAdvisor', href: '#', external: true },
          ],
        },
      ],
      copyright: '© 2026 La Trattoria. Made with love and fresh ingredients.',
    },
    seo: {
      title: 'La Trattoria — Authentic Italian Cuisine',
      description: 'Experience authentic Italian dining in the heart of the city. Fresh pasta, wood-fired pizza, and handcrafted cocktails.',
    },
  },
  navigation: [],
  pages: [
    {
      id: 'home',
      segment: 'home',
      title: 'Home',
      content: 'landing',
      landingSections: [
        {
          id: 'hero',
          type: 'hero',
          variant: 'centered',
          heroConfig: {
            subheadline: 'Est. 1985',
            headline: 'Authentic Italian cuisine, crafted with passion',
            description: 'Fresh ingredients, time-honored recipes, and a warm atmosphere. Experience the taste of Italy in every bite.',
            primaryCta: { label: 'Reserve a Table', href: '#contact' },
            secondaryCta: { label: 'View Menu', href: '#gallery' },
            alignment: 'center',
            minHeight: '85vh',
          },
          background: {
            type: 'image',
            value: 'https://placehold.co/1920x1080/1c1917/fbbf24?text=Restaurant+Ambiance',
            overlay: 'rgba(0,0,0,0.55)',
          },
        },
        {
          id: 'about',
          type: 'content',
          anchor: 'about',
          contentConfig: {
            headline: 'Our Story',
            body: '<p>For over 40 years, La Trattoria has been serving authentic Italian cuisine made from the freshest ingredients. Our recipes have been passed down through generations, bringing the true flavors of Italy to your table.</p><p>Our chef, Marco Bellini, trained in Bologna and brings decades of experience to every dish. From our handmade pasta to our wood-fired pizzas, every plate tells a story of tradition and craftsmanship.</p>',
            image: 'https://placehold.co/500x600/fef3c7/92400e?text=Chef+Marco',
            imagePosition: 'left',
            bodyFormat: 'html',
          },
        },
        {
          id: 'features',
          type: 'features',
          featuresConfig: {
            headline: 'Why Guests Love Us',
            items: [
              { icon: '🍝', title: 'Handmade Pasta', description: 'Made fresh daily using traditional techniques and the finest semolina flour imported from Italy.' },
              { icon: '🔥', title: 'Wood-Fired Oven', description: 'Our Neapolitan pizza oven reaches 900°F, creating the perfect crust in just 90 seconds.' },
              { icon: '🍷', title: 'Curated Wine List', description: 'Over 200 wines from Italy\'s finest regions, hand-selected by our sommelier.' },
              { icon: '🌿', title: 'Farm to Table', description: 'We source herbs and vegetables from local organic farms to ensure peak freshness.' },
            ],
            columns: 4,
            variant: 'icons',
          },
          background: { type: 'color', value: '#fef3c7' },
        },
        {
          id: 'gallery',
          type: 'gallery',
          anchor: 'gallery',
          galleryConfig: {
            headline: 'Our Menu Highlights',
            images: [
              { src: 'https://placehold.co/600x400/fef3c7/92400e?text=Pasta+Carbonara', alt: 'Pasta Carbonara', caption: 'Pasta Carbonara — $18' },
              { src: 'https://placehold.co/600x400/fef3c7/92400e?text=Margherita+Pizza', alt: 'Margherita Pizza', caption: 'Pizza Margherita — $16' },
              { src: 'https://placehold.co/600x400/fef3c7/92400e?text=Tiramisu', alt: 'Tiramisu', caption: 'Tiramisu — $12' },
              { src: 'https://placehold.co/600x400/fef3c7/92400e?text=Risotto', alt: 'Risotto ai Funghi', caption: 'Risotto ai Funghi — $22' },
              { src: 'https://placehold.co/600x400/fef3c7/92400e?text=Bruschetta', alt: 'Bruschetta', caption: 'Bruschetta Trio — $14' },
              { src: 'https://placehold.co/600x400/fef3c7/92400e?text=Wine+Selection', alt: 'Wine Selection', caption: 'Wine Selection' },
            ],
            columns: 3,
            variant: 'grid',
          },
        },
        {
          id: 'stats',
          type: 'stats',
          anchor: 'stats',
          background: { type: 'color', value: '#1c1917' },
          statsConfig: {
            headline: 'La Trattoria in Numbers',
            items: [
              { value: '40', label: 'Years of Tradition', suffix: '+' },
              { value: '200', label: 'Wine Labels', suffix: '+' },
              { value: '50K', label: 'Happy Guests/Year', suffix: '' },
              { value: '4.8', label: 'Google Rating', suffix: '⭐' },
            ],
          },
        },
        {
          id: 'contact',
          type: 'cta',
          anchor: 'contact',
          ctaConfig: {
            headline: 'Reserve Your Table',
            description: 'Join us for an unforgettable dining experience. Walk-ins welcome, reservations recommended for weekends.',
            primaryCta: { label: 'Call to Reserve', href: 'tel:+15551234567' },
            secondaryCta: { label: 'View on Map', href: '#' },
            variant: 'split',
          },
          background: { type: 'color', value: '#fef3c7' },
        },
      ],
    },
  ],
};

// ─── Template: SaaS Product ─────────────────────────────────────

const TEMPLATE_SAAS_PRODUCT: AppConfig = {
  id: 'saas-product',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'FlowDesk',
    subtitle: 'The smarter way to manage projects',
    homeSegment: 'home',
    primaryColor: '#0ea5e9',
  },
  landingConfig: {
    navbar: {
      title: 'FlowDesk',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Demo', href: '#video' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Reviews', href: '#testimonials' },
      ],
      ctaButton: { label: 'Get Started Free', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        {
          title: 'Product',
          links: [
            { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Integrations', href: '#' },
            { label: 'Roadmap', href: '#' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About', href: '#' },
            { label: 'Careers', href: '#' },
            { label: 'Press', href: '#' },
            { label: 'Contact', href: '#' },
          ],
        },
        {
          title: 'Legal',
          links: [
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
            { label: 'Security', href: '#' },
          ],
        },
      ],
      copyright: '© 2026 FlowDesk, Inc. All rights reserved.',
      socialLinks: [
        { icon: '𝕏', url: '#' },
        { icon: '💼', url: '#' },
        { icon: '📺', url: '#' },
      ],
    },
    seo: {
      title: 'FlowDesk — The smarter way to manage projects',
      description: 'Project management software that adapts to your team. Track tasks, automate workflows, and ship products faster.',
      ogType: 'website',
    },
  },
  navigation: [],
  pages: [
    {
      id: 'home',
      segment: 'home',
      title: 'Home',
      content: 'landing',
      landingSections: [
        {
          id: 'hero',
          type: 'hero',
          variant: 'split',
          heroConfig: {
            headline: 'Project management that works the way your team does',
            subheadline: 'Meet FlowDesk',
            description: 'Stop fighting your tools. FlowDesk adapts to your workflow with smart automation, real-time collaboration, and insights that actually matter.',
            image: 'https://placehold.co/700x500/0ea5e9/ffffff?text=FlowDesk+Dashboard',
            primaryCta: { label: 'Start Free — No Card Required', href: '#pricing' },
            secondaryCta: { label: 'Watch 2-min Demo', href: '#video' },
            alignment: 'left',
            minHeight: '90vh',
          },
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          },
        },
        {
          id: 'logos',
          type: 'logos',
          padding: 'sm',
          logosConfig: {
            headline: 'Powering 2,000+ product teams worldwide',
            logos: [
              { src: '', alt: 'Stripe' },
              { src: '', alt: 'Notion' },
              { src: '', alt: 'Vercel' },
              { src: '', alt: 'Linear' },
              { src: '', alt: 'Figma' },
              { src: '', alt: 'Shopify' },
            ],
            grayscale: true,
          },
        },
        {
          id: 'features',
          type: 'features',
          anchor: 'features',
          featuresConfig: {
            headline: 'Built for modern product teams',
            subtitle: 'Every feature designed to eliminate busywork and keep your team focused on what matters.',
            items: [
              { icon: '📋', title: 'Smart Boards', description: 'Kanban, list, timeline, and calendar views that sync in real time. Switch views without losing context.' },
              { icon: '⚡', title: 'Workflow Automation', description: 'Set rules once and let FlowDesk handle the rest. Auto-assign, move, notify, and update without lifting a finger.' },
              { icon: '📈', title: 'Sprint Analytics', description: 'Velocity charts, burndown reports, and bottleneck detection. Know exactly where your team stands.' },
              { icon: '🔗', title: 'Deep Integrations', description: 'Connect GitHub, Slack, Figma, and 80+ tools. Two-way sync keeps everything up to date automatically.' },
              { icon: '🎯', title: 'Goal Tracking', description: 'Link tasks to company OKRs. See how daily work contributes to quarterly objectives at a glance.' },
              { icon: '🛡️', title: 'Enterprise Ready', description: 'SOC 2, SAML SSO, audit logs, and custom permissions. Built for teams that need serious security.' },
            ],
            columns: 3,
            variant: 'alternating',
          },
        },
        {
          id: 'video',
          type: 'video',
          anchor: 'video',
          background: { type: 'color', value: '#f0f9ff' },
          videoConfig: {
            headline: 'See FlowDesk in action',
            subtitle: 'Watch how a product team ships 40% faster with FlowDesk.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            provider: 'youtube',
            poster: 'https://placehold.co/1280x720/0ea5e9/ffffff?text=Play+Demo+Video',
          },
        },
        {
          id: 'pricing',
          type: 'pricing',
          anchor: 'pricing',
          pricingConfig: {
            headline: 'Plans that scale with your team',
            subtitle: 'Start free, upgrade when you need more. No contracts, cancel anytime.',
            plans: [
              {
                name: 'Free',
                price: '$0',
                period: '/mo',
                description: 'For individuals and small projects.',
                features: ['Up to 3 projects', '5 team members', 'Basic boards', 'Community support'],
                cta: { label: 'Get Started', href: '#' },
              },
              {
                name: 'Team',
                price: '$12',
                period: '/user/mo',
                description: 'For growing teams that need collaboration.',
                features: ['Unlimited projects', 'Unlimited members', 'Automation rules', 'Sprint analytics', 'Priority support', 'Integrations'],
                cta: { label: 'Start Free Trial', href: '#' },
                highlighted: true,
                badge: 'Best Value',
              },
              {
                name: 'Business',
                price: '$24',
                period: '/user/mo',
                description: 'For organizations that need advanced control.',
                features: ['Everything in Team', 'SSO & SAML', 'Audit logs', 'Custom fields', 'Advanced permissions', 'API access', 'Dedicated support'],
                cta: { label: 'Contact Sales', href: '#' },
              },
            ],
            billingToggle: true,
          },
        },
        {
          id: 'testimonials',
          type: 'testimonials',
          anchor: 'testimonials',
          background: { type: 'color', value: '#f0f9ff' },
          testimonialsConfig: {
            headline: 'Teams ship faster with FlowDesk',
            items: [
              { quote: 'We switched from Jira to FlowDesk and cut our sprint planning time by 60%. The automation alone pays for itself.', name: 'David Park', title: 'Engineering Manager', company: 'Vercel', rating: 5 },
              { quote: 'Finally, a project tool that designers and developers both love. The Figma integration is seamless.', name: 'Emily Torres', title: 'Head of Design', company: 'Pitch', rating: 5 },
              { quote: 'FlowDesk gave us visibility we never had. We can now predict release dates with 95% accuracy.', name: 'James Okonkwo', title: 'VP Product', company: 'Lattice', rating: 5 },
            ],
            variant: 'carousel',
          },
        },
        {
          id: 'cta',
          type: 'cta',
          anchor: 'cta',
          ctaConfig: {
            headline: 'Start building better products today',
            description: 'Join 2,000+ teams already using FlowDesk. Free forever for small teams.',
            primaryCta: { label: 'Get Started Free', href: '#' },
            secondaryCta: { label: 'Schedule a Demo', href: '#' },
            variant: 'centered',
          },
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          },
        },
      ],
    },
  ],
};

// ─── Template: Portfolio Agency ──────────────────────────────────

const TEMPLATE_PORTFOLIO_AGENCY: AppConfig = {
  id: 'portfolio-agency',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'Pixel & Code',
    subtitle: 'Digital agency for ambitious brands',
    homeSegment: 'home',
    primaryColor: '#8b5cf6',
  },
  landingConfig: {
    navbar: {
      title: 'Pixel & Code',
      links: [
        { label: 'Work', href: '#logos' },
        { label: 'Services', href: '#features' },
        { label: 'Team', href: '#team' },
        { label: 'Contact', href: '#contact' },
      ],
      ctaButton: { label: 'Start a Project', href: '#contact' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        {
          title: 'Services',
          links: [
            { label: 'Web Development', href: '#' },
            { label: 'Brand Strategy', href: '#' },
            { label: 'UI/UX Design', href: '#' },
            { label: 'Digital Marketing', href: '#' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About', href: '#' },
            { label: 'Careers', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Contact', href: '#contact' },
          ],
        },
        {
          title: 'Connect',
          links: [
            { label: 'Dribbble', href: '#', external: true },
            { label: 'Instagram', href: '#', external: true },
            { label: 'LinkedIn', href: '#', external: true },
            { label: 'Twitter', href: '#', external: true },
          ],
        },
      ],
      copyright: '© 2026 Pixel & Code. Crafting digital experiences since 2015.',
      socialLinks: [
        { icon: '🎨', url: '#' },
        { icon: '📸', url: '#' },
        { icon: '💼', url: '#' },
      ],
    },
    seo: {
      title: 'Pixel & Code — Digital Agency for Ambitious Brands',
      description: 'We design and build digital products that drive growth. Web development, branding, and UX for startups and enterprises.',
      ogType: 'website',
    },
  },
  navigation: [],
  pages: [
    {
      id: 'home',
      segment: 'home',
      title: 'Home',
      content: 'landing',
      landingSections: [
        {
          id: 'hero',
          type: 'hero',
          variant: 'centered',
          heroConfig: {
            subheadline: 'Digital Agency',
            headline: 'We build brands that people remember',
            description: 'Strategy, design, and development for companies that want to stand out. We have helped 200+ brands transform their digital presence.',
            primaryCta: { label: 'Start a Project', href: '#contact' },
            secondaryCta: { label: 'View Our Work', href: '#logos' },
            alignment: 'center',
            minHeight: '90vh',
          },
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 50%, #c4b5fd 100%)',
            overlay: 'rgba(0,0,0,0.1)',
          },
        },
        {
          id: 'logos',
          type: 'logos',
          anchor: 'logos',
          padding: 'sm',
          logosConfig: {
            headline: 'Trusted by leading brands',
            logos: [
              { src: '', alt: 'Nike' },
              { src: '', alt: 'Airbnb' },
              { src: '', alt: 'Spotify' },
              { src: '', alt: 'Slack' },
              { src: '', alt: 'Dropbox' },
              { src: '', alt: 'Square' },
            ],
            grayscale: true,
          },
        },
        {
          id: 'features',
          type: 'features',
          anchor: 'features',
          featuresConfig: {
            headline: 'What we do best',
            subtitle: 'End-to-end digital services that turn ideas into market-leading products.',
            items: [
              { icon: '🎨', title: 'Brand Identity', description: 'Logo, typography, color systems, and brand guidelines that capture your essence and resonate with your audience.' },
              { icon: '🖥️', title: 'Web Development', description: 'High-performance websites and web apps built with modern technology stacks. Fast, accessible, and scalable.' },
              { icon: '📱', title: 'Product Design', description: 'User research, wireframes, prototypes, and pixel-perfect UI design. We obsess over every interaction.' },
              { icon: '📊', title: 'Growth Marketing', description: 'SEO, content strategy, paid media, and analytics. Data-driven campaigns that deliver measurable ROI.' },
            ],
            columns: 4,
            variant: 'cards',
          },
        },
        {
          id: 'team',
          type: 'team',
          anchor: 'team',
          background: { type: 'color', value: '#faf5ff' },
          teamConfig: {
            headline: 'Meet the team',
            subtitle: 'A small, senior team that punches above its weight.',
            members: [
              { name: 'Sofia Martinez', role: 'Creative Director', avatar: 'https://placehold.co/300x300/8b5cf6/ffffff?text=SM', bio: '15 years leading design for Fortune 500 brands.' },
              { name: 'Liam Chen', role: 'Lead Developer', avatar: 'https://placehold.co/300x300/7c3aed/ffffff?text=LC', bio: 'Full-stack architect. Ex-Google, Ex-Stripe.' },
              { name: 'Amara Osei', role: 'Strategy Director', avatar: 'https://placehold.co/300x300/6d28d9/ffffff?text=AO', bio: 'Brand strategist who has launched 50+ products.' },
              { name: 'Jake Morrison', role: 'Head of Growth', avatar: 'https://placehold.co/300x300/5b21b6/ffffff?text=JM', bio: 'Growth marketer. Scaled 3 startups from 0 to 1M users.' },
            ],
            columns: 4,
          },
        },
        {
          id: 'testimonials',
          type: 'testimonials',
          anchor: 'testimonials',
          testimonialsConfig: {
            headline: 'What our clients say',
            items: [
              { quote: 'Pixel & Code completely transformed our brand. Our conversion rate doubled within three months of launching the new site.', name: 'Rachel Kim', title: 'CMO', company: 'Bloom Health', rating: 5 },
              { quote: 'They do not just build websites — they build experiences. Our customers constantly tell us how much they love the new design.', name: 'Tom Andersen', title: 'Founder', company: 'NordPay', rating: 5 },
              { quote: 'The most collaborative agency we have ever worked with. They felt like an extension of our own team.', name: 'Priya Sharma', title: 'Product Lead', company: 'Zenith AI', rating: 5 },
            ],
            variant: 'grid',
          },
        },
        {
          id: 'cta',
          type: 'cta',
          anchor: 'cta',
          ctaConfig: {
            headline: 'Ready to build something great?',
            description: 'Tell us about your project and we will get back to you within 24 hours with a free proposal.',
            primaryCta: { label: 'Start a Project', href: '#contact' },
            secondaryCta: { label: 'View Case Studies', href: '#' },
            variant: 'centered',
          },
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
          },
        },
        {
          id: 'contact',
          type: 'contact',
          anchor: 'contact',
          contactConfig: {
            headline: 'Get in touch',
            subtitle: 'Fill out the form and our team will respond within one business day.',
            successMessage: 'Thank you! We will be in touch shortly.',
          },
        },
      ],
    },
  ],
};

// ─── Template: Event Conference ─────────────────────────────────

const TEMPLATE_EVENT_CONFERENCE: AppConfig = {
  id: 'event-conference',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'DevSummit 2026',
    subtitle: 'The developer conference of the year',
    homeSegment: 'home',
    primaryColor: '#dc2626',
  },
  landingConfig: {
    navbar: {
      title: 'DevSummit 2026',
      links: [
        { label: 'Speakers', href: '#speakers' },
        { label: 'Schedule', href: '#stats' },
        { label: 'Tickets', href: '#pricing' },
        { label: 'FAQ', href: '#faq' },
      ],
      ctaButton: { label: 'Get Tickets', href: '#pricing' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        {
          title: 'Event',
          links: [
            { label: 'Speakers', href: '#speakers' },
            { label: 'Schedule', href: '#stats' },
            { label: 'Venue', href: '#' },
            { label: 'Code of Conduct', href: '#' },
          ],
        },
        {
          title: 'Past Events',
          links: [
            { label: 'DevSummit 2025', href: '#' },
            { label: 'DevSummit 2024', href: '#' },
            { label: 'Photo Gallery', href: '#' },
            { label: 'Videos', href: '#' },
          ],
        },
        {
          title: 'Connect',
          links: [
            { label: 'Twitter', href: '#', external: true },
            { label: 'Discord', href: '#', external: true },
            { label: 'YouTube', href: '#', external: true },
          ],
        },
      ],
      copyright: '© 2026 DevSummit. Organized by TechEvents Inc.',
      socialLinks: [
        { icon: '𝕏', url: '#' },
        { icon: '🎮', url: '#' },
        { icon: '📺', url: '#' },
      ],
    },
    seo: {
      title: 'DevSummit 2026 — The Developer Conference of the Year',
      description: 'Join 3,000+ developers in San Francisco for two days of talks, workshops, and networking. October 15-16, 2026.',
      ogType: 'website',
    },
  },
  navigation: [],
  pages: [
    {
      id: 'home',
      segment: 'home',
      title: 'Home',
      content: 'landing',
      landingSections: [
        {
          id: 'hero',
          type: 'hero',
          variant: 'centered',
          heroConfig: {
            subheadline: 'October 15-16, 2026 — San Francisco, CA',
            headline: 'The conference where developers shape the future',
            description: 'Two days, 40+ speakers, and 3,000 developers. Hands-on workshops, cutting-edge talks, and the best networking in tech.',
            primaryCta: { label: 'Get Your Ticket', href: '#pricing' },
            secondaryCta: { label: 'View Speakers', href: '#speakers' },
            alignment: 'center',
            minHeight: '90vh',
          },
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #dc2626 100%)',
            overlay: 'rgba(0,0,0,0.2)',
          },
        },
        {
          id: 'speakers',
          type: 'features',
          anchor: 'speakers',
          featuresConfig: {
            headline: 'Featured Speakers',
            subtitle: '40+ industry leaders sharing insights on AI, web, cloud, and open source.',
            items: [
              { icon: '👩‍💻', title: 'Dr. Maya Patel', description: 'VP of AI at DeepMind. Speaking on the next frontier of large language models and developer tooling.' },
              { icon: '👨‍💻', title: 'Carlos Mendez', description: 'Creator of Svelte. Keynote on rethinking frontend frameworks for the next decade.' },
              { icon: '👩‍🔬', title: 'Yuki Tanaka', description: 'Head of Platform at Cloudflare. Workshop on building globally distributed applications.' },
              { icon: '👨‍🏫', title: 'Andre Williams', description: 'Staff Engineer at Stripe. Deep dive into designing APIs that scale to millions of requests.' },
              { icon: '👩‍🎨', title: 'Lisa Nguyen', description: 'Design Systems Lead at Figma. Talk on bridging design and engineering with tokens.' },
              { icon: '👨‍🔧', title: 'Omar Hassan', description: 'Core maintainer of Rust. Session on memory safety and the future of systems programming.' },
            ],
            columns: 3,
            variant: 'cards',
          },
        },
        {
          id: 'stats',
          type: 'stats',
          anchor: 'stats',
          background: { type: 'color', value: '#1e1b4b' },
          statsConfig: {
            headline: 'DevSummit by the numbers',
            items: [
              { value: '3,000', label: 'Attendees', suffix: '+' },
              { value: '40', label: 'Speakers', suffix: '+' },
              { value: '2', label: 'Days', suffix: '' },
              { value: '15', label: 'Workshops', suffix: '' },
            ],
          },
        },
        {
          id: 'pricing',
          type: 'pricing',
          anchor: 'pricing',
          pricingConfig: {
            headline: 'Get your ticket',
            subtitle: 'Early bird pricing ends August 31. All tickets include full access, meals, and swag.',
            plans: [
              {
                name: 'Early Bird',
                price: '$299',
                description: 'Limited availability — first 500 tickets.',
                features: ['2-day conference access', 'Lunch & coffee included', 'Conference swag bag', 'Networking events', 'Recordings access'],
                cta: { label: 'Buy Early Bird', href: '#' },
                badge: 'Save 40%',
              },
              {
                name: 'Regular',
                price: '$499',
                description: 'Full conference experience.',
                features: ['2-day conference access', 'Lunch & coffee included', 'Conference swag bag', 'Networking events', 'Recordings access', 'Workshop access (1)'],
                cta: { label: 'Buy Regular', href: '#' },
                highlighted: true,
              },
              {
                name: 'VIP',
                price: '$899',
                description: 'Premium experience with exclusive perks.',
                features: ['2-day conference access', 'All meals included', 'Premium swag kit', 'Speaker dinner invite', 'All recordings', 'All workshops', 'Front-row seating', '1-on-1 mentoring slot'],
                cta: { label: 'Buy VIP', href: '#' },
              },
            ],
          },
        },
        {
          id: 'faq',
          type: 'faq',
          anchor: 'faq',
          background: { type: 'color', value: '#f8fafc' },
          faqConfig: {
            headline: 'Frequently asked questions',
            items: [
              { question: 'Where is the venue?', answer: 'DevSummit 2026 takes place at the Moscone Center in San Francisco, CA. The venue is easily accessible by BART and Muni.' },
              { question: 'Are there group discounts?', answer: 'Yes! Teams of 5+ get 15% off, and teams of 10+ get 25% off. Contact us at groups@devsummit.dev for a custom quote.' },
              { question: 'What is the refund policy?', answer: 'Full refunds are available up to 30 days before the event. After that, tickets can be transferred to another attendee at no charge.' },
              { question: 'Will talks be recorded?', answer: 'Yes, all main stage talks will be recorded and available to ticket holders within 48 hours after the event.' },
              { question: 'Is there a virtual option?', answer: 'We offer a livestream pass for $99 that includes all main stage talks in real time and recordings for 1 year.' },
            ],
            variant: 'accordion',
          },
        },
        {
          id: 'cta',
          type: 'cta',
          anchor: 'cta',
          ctaConfig: {
            headline: 'Do not miss out — early bird tickets are selling fast',
            description: 'Join 3,000+ developers in San Francisco this October. Secure your spot today.',
            primaryCta: { label: 'Get Tickets Now', href: '#pricing' },
            secondaryCta: { label: 'Become a Sponsor', href: '#' },
            variant: 'banner',
          },
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
          },
        },
      ],
    },
  ],
};

// ─── Template: E-Commerce Store ─────────────────────────────────

const TEMPLATE_ECOMMERCE_STORE: AppConfig = {
  id: 'ecommerce-store',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'Maison Noir',
    subtitle: 'Curated modern furniture',
    homeSegment: 'home',
    primaryColor: '#171717',
  },
  landingConfig: {
    navbar: {
      title: 'Maison Noir',
      links: [
        { label: 'Collections', href: '#categories' },
        { label: 'Products', href: '#gallery' },
        { label: 'Reviews', href: '#testimonials' },
        { label: 'About', href: '#about' },
      ],
      ctaButton: { label: 'Shop Now', href: '#gallery' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        {
          title: 'Shop',
          links: [
            { label: 'Living Room', href: '#' },
            { label: 'Bedroom', href: '#' },
            { label: 'Office', href: '#' },
            { label: 'Outdoor', href: '#' },
          ],
        },
        {
          title: 'Support',
          links: [
            { label: 'Shipping & Returns', href: '#' },
            { label: 'Care Guide', href: '#' },
            { label: 'FAQ', href: '#' },
            { label: 'Contact Us', href: '#' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'Our Story', href: '#about' },
            { label: 'Sustainability', href: '#' },
            { label: 'Press', href: '#' },
            { label: 'Careers', href: '#' },
          ],
        },
      ],
      copyright: '© 2026 Maison Noir. Handcrafted with care.',
      socialLinks: [
        { icon: '📸', url: '#' },
        { icon: '📌', url: '#' },
        { icon: '📺', url: '#' },
      ],
    },
    seo: {
      title: 'Maison Noir — Curated Modern Furniture',
      description: 'Discover handcrafted modern furniture designed for contemporary living. Free shipping on orders over $500.',
      ogType: 'website',
    },
  },
  navigation: [],
  pages: [
    {
      id: 'home',
      segment: 'home',
      title: 'Home',
      content: 'landing',
      landingSections: [
        {
          id: 'hero',
          type: 'hero',
          variant: 'centered',
          heroConfig: {
            subheadline: 'New Collection 2026',
            headline: 'Furniture that tells your story',
            description: 'Handcrafted pieces designed by independent artisans. Each item is made to order with sustainably sourced materials.',
            primaryCta: { label: 'Shop the Collection', href: '#gallery' },
            secondaryCta: { label: 'Our Story', href: '#about' },
            alignment: 'center',
            minHeight: '85vh',
          },
          background: {
            type: 'image',
            value: 'https://placehold.co/1920x1080/171717/f5f5f4?text=Modern+Living+Room',
            overlay: 'rgba(0,0,0,0.45)',
          },
        },
        {
          id: 'categories',
          type: 'features',
          anchor: 'categories',
          featuresConfig: {
            headline: 'Shop by Room',
            subtitle: 'Find the perfect piece for every space in your home.',
            items: [
              { icon: '🛋️', title: 'Living Room', description: 'Sofas, armchairs, coffee tables, and shelving units crafted for comfort and style.' },
              { icon: '🛏️', title: 'Bedroom', description: 'Beds, nightstands, dressers, and wardrobes designed for peaceful retreats.' },
              { icon: '💻', title: 'Home Office', description: 'Desks, ergonomic chairs, and storage solutions for productive workspaces.' },
              { icon: '🌿', title: 'Outdoor', description: 'Weather-resistant tables, loungers, and planters for elegant outdoor living.' },
            ],
            columns: 4,
            variant: 'cards',
          },
        },
        {
          id: 'gallery',
          type: 'gallery',
          anchor: 'gallery',
          galleryConfig: {
            headline: 'Best Sellers',
            images: [
              { src: 'https://placehold.co/600x400/e7e5e4/171717?text=Walnut+Sofa', alt: 'Walnut Sofa', caption: 'Oslo Sofa — $1,890' },
              { src: 'https://placehold.co/600x400/d6d3d1/171717?text=Oak+Desk', alt: 'Oak Desk', caption: 'Copenhagen Desk — $1,250' },
              { src: 'https://placehold.co/600x400/e7e5e4/171717?text=Marble+Table', alt: 'Marble Table', caption: 'Carrara Coffee Table — $980' },
              { src: 'https://placehold.co/600x400/d6d3d1/171717?text=Linen+Chair', alt: 'Linen Chair', caption: 'Bergen Armchair — $750' },
              { src: 'https://placehold.co/600x400/e7e5e4/171717?text=Pendant+Lamp', alt: 'Pendant Lamp', caption: 'Aura Pendant — $340' },
              { src: 'https://placehold.co/600x400/d6d3d1/171717?text=Bookshelf', alt: 'Bookshelf', caption: 'Fjord Bookshelf — $1,120' },
            ],
            columns: 3,
            variant: 'grid',
          },
        },
        {
          id: 'testimonials',
          type: 'testimonials',
          anchor: 'testimonials',
          background: { type: 'color', value: '#fafaf9' },
          testimonialsConfig: {
            headline: 'What our customers say',
            items: [
              { quote: 'The quality is exceptional. Our Oslo Sofa has been the centerpiece of our living room for two years and still looks brand new.', name: 'Catherine Dupont', title: 'Interior Designer', company: 'Paris', rating: 5 },
              { quote: 'Ordering was seamless and delivery was right on schedule. The Copenhagen Desk is even more beautiful in person.', name: 'Michael Torres', title: 'Architect', company: 'New York', rating: 5 },
              { quote: 'Sustainable, beautiful, and built to last. Maison Noir is the only furniture brand I recommend to my clients.', name: 'Hannah Berg', title: 'Homeowner', company: 'Stockholm', rating: 5 },
            ],
            variant: 'carousel',
          },
        },
        {
          id: 'about',
          type: 'content',
          anchor: 'about',
          contentConfig: {
            headline: 'Crafted with Purpose',
            body: '<p>Every Maison Noir piece begins with sustainably sourced wood, stone, and textiles. Our network of 30+ independent artisans across Europe and Japan brings decades of craftsmanship to every joint, stitch, and finish.</p><p>We believe furniture should outlast trends. That is why we design with timeless proportions and build with materials that age gracefully. No particle board, no fast furniture — just honest materials and expert hands.</p>',
            image: 'https://placehold.co/500x600/171717/f5f5f4?text=Workshop+Artisan',
            imagePosition: 'right',
            bodyFormat: 'html',
          },
        },
        {
          id: 'cta',
          type: 'cta',
          anchor: 'cta',
          ctaConfig: {
            headline: 'Free shipping on your first order over $500',
            description: 'Use code WELCOME at checkout. Handcrafted pieces delivered to your door in 4-6 weeks.',
            primaryCta: { label: 'Shop Now', href: '#gallery' },
            secondaryCta: { label: 'Request a Catalog', href: '#' },
            variant: 'banner',
          },
          background: { type: 'color', value: '#171717' },
        },
      ],
    },
  ],
};

// ─── Template: Blog Standard ────────────────────────────────────

const TEMPLATE_BLOG_STANDARD: AppConfig = {
  id: 'blog-standard',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'The Craft',
    subtitle: 'Stories on design, code, and creativity',
    homeSegment: 'home',
    primaryColor: '#059669',
  },
  landingConfig: {
    navbar: {
      title: 'The Craft',
      links: [
        { label: 'Articles', href: '/blog' },
        { label: 'About', href: '#about' },
        { label: 'Newsletter', href: '#cta' },
      ],
      ctaButton: { label: 'Subscribe', href: '#cta' },
      sticky: true,
      transparent: false,
    },
    footer: {
      columns: [
        {
          title: 'Categories',
          links: [
            { label: 'Design', href: '#' },
            { label: 'Engineering', href: '#' },
            { label: 'Product', href: '#' },
            { label: 'Career', href: '#' },
          ],
        },
        {
          title: 'Follow',
          links: [
            { label: 'Twitter', href: '#', external: true },
            { label: 'RSS Feed', href: '#', external: true },
            { label: 'Newsletter', href: '#cta' },
          ],
        },
      ],
      copyright: '© 2026 The Craft. All rights reserved.',
      socialLinks: [
        { icon: '𝕏', url: '#' },
        { icon: '📡', url: '#' },
      ],
    },
    seo: {
      title: 'The Craft — Stories on Design, Code, and Creativity',
      description: 'A blog about the intersection of design, engineering, and product thinking. Written by practitioners, for practitioners.',
      ogType: 'website',
    },
  },
  navigation: [],
  pages: [
    {
      id: 'home',
      segment: 'home',
      title: 'Home',
      content: 'landing',
      landingSections: [
        {
          id: 'hero',
          type: 'hero',
          variant: 'centered',
          heroConfig: {
            headline: 'Ideas worth building',
            description: 'Thoughtful articles on design systems, frontend architecture, product strategy, and the craft of making great software.',
            primaryCta: { label: 'Read the Latest', href: '/blog' },
            secondaryCta: { label: 'Subscribe', href: '#cta' },
            alignment: 'center',
            minHeight: '50vh',
          },
          background: { type: 'color', value: '#ecfdf5' },
        },
        {
          id: 'about',
          type: 'content',
          anchor: 'about',
          contentConfig: {
            headline: 'About The Craft',
            body: '<p>The Craft is a publication for people who build digital products. We cover the full spectrum — from pixel-level design decisions to system architecture, from user research to team culture.</p><p>Written by a community of designers, engineers, and product managers who believe in sharing what they learn.</p>',
            imagePosition: 'right',
            bodyFormat: 'html',
          },
        },
        {
          id: 'cta',
          type: 'cta',
          anchor: 'cta',
          ctaConfig: {
            headline: 'Get the best articles in your inbox',
            description: 'Join 12,000+ readers who get our weekly digest of the best writing on design and engineering.',
            primaryCta: { label: 'Subscribe Free', href: '#' },
            variant: 'centered',
          },
          background: { type: 'color', value: '#059669' },
        },
      ],
    },
    {
      id: 'blog',
      segment: 'blog',
      title: 'Articles',
      content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'posts',
        layout: 'grid',
        columns: 3,
        showCategories: true,
        showSearch: true,
        showPagination: true,
        pageSize: 12,
        postSegment: 'blog',
        cardFields: {
          title: 'title',
          excerpt: 'excerpt',
          image: 'coverImage',
          date: 'publishedAt',
          author: 'author',
          category: 'category',
          slug: 'slug',
        },
      },
    },
  ],
};

// ─── Template: Blog Magazine ────────────────────────────────────

const TEMPLATE_BLOG_MAGAZINE: AppConfig = {
  id: 'blog-magazine',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'Meridian',
    subtitle: 'Culture, tech, and ideas',
    homeSegment: 'home',
    primaryColor: '#be185d',
  },
  landingConfig: {
    navbar: {
      title: 'Meridian',
      links: [
        { label: 'Latest', href: '/magazine' },
        { label: 'Culture', href: '#' },
        { label: 'Technology', href: '#' },
        { label: 'Business', href: '#' },
        { label: 'Opinion', href: '#' },
      ],
      ctaButton: { label: 'Subscribe', href: '#cta' },
      sticky: true,
      transparent: false,
    },
    footer: {
      columns: [
        {
          title: 'Sections',
          links: [
            { label: 'Culture', href: '#' },
            { label: 'Technology', href: '#' },
            { label: 'Business', href: '#' },
            { label: 'Opinion', href: '#' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About', href: '#' },
            { label: 'Masthead', href: '#' },
            { label: 'Advertise', href: '#' },
            { label: 'Contact', href: '#' },
          ],
        },
        {
          title: 'Follow Us',
          links: [
            { label: 'Twitter', href: '#', external: true },
            { label: 'Instagram', href: '#', external: true },
            { label: 'LinkedIn', href: '#', external: true },
            { label: 'RSS', href: '#', external: true },
          ],
        },
      ],
      copyright: '© 2026 Meridian Media, LLC. All rights reserved.',
      socialLinks: [
        { icon: '𝕏', url: '#' },
        { icon: '📸', url: '#' },
        { icon: '💼', url: '#' },
      ],
      newsletter: {
        placeholder: 'Your email address',
        buttonLabel: 'Subscribe',
      },
    },
    seo: {
      title: 'Meridian — Culture, Tech, and Ideas',
      description: 'Meridian is an online magazine covering the intersection of culture, technology, and business. Insightful reporting and bold opinions.',
      ogType: 'website',
    },
  },
  navigation: [],
  pages: [
    {
      id: 'home',
      segment: 'home',
      title: 'Home',
      content: 'landing',
      landingSections: [
        {
          id: 'hero',
          type: 'hero',
          variant: 'split',
          heroConfig: {
            subheadline: 'Featured Story',
            headline: 'The rise of sovereign AI: why every nation wants its own language model',
            description: 'From Paris to Riyadh, governments are investing billions in homegrown AI. We investigate what it means for the global tech landscape.',
            image: 'https://placehold.co/700x500/be185d/ffffff?text=Featured+Article',
            primaryCta: { label: 'Read the Story', href: '#' },
            alignment: 'left',
            minHeight: '70vh',
          },
          background: { type: 'color', value: '#fdf2f8' },
        },
        {
          id: 'cta',
          type: 'cta',
          anchor: 'cta',
          ctaConfig: {
            headline: 'Never miss a story',
            description: 'Get our editors\' picks delivered to your inbox every morning. Free, no spam, unsubscribe anytime.',
            primaryCta: { label: 'Subscribe Free', href: '#' },
            variant: 'banner',
          },
          background: { type: 'color', value: '#be185d' },
        },
      ],
    },
    {
      id: 'magazine',
      segment: 'magazine',
      title: 'Latest',
      content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'articles',
        layout: 'magazine',
        columns: 3,
        showCategories: true,
        showSearch: true,
        showPagination: true,
        pageSize: 15,
        featuredCount: 3,
        postSegment: 'magazine',
        cardFields: {
          title: 'title',
          excerpt: 'excerpt',
          image: 'coverImage',
          date: 'publishedAt',
          author: 'author',
          category: 'section',
          tags: 'tags',
          slug: 'slug',
        },
      },
    },
  ],
};

// ─── Template: Consulting Firm ──────────────────────────────────

const TEMPLATE_CONSULTING_FIRM: AppConfig = {
  id: 'consulting-firm',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'Apex Advisory',
    subtitle: 'Strategic consulting for growth',
    homeSegment: 'home',
    primaryColor: '#1e40af',
  },
  landingConfig: {
    navbar: {
      title: 'Apex Advisory',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Services', href: '#services' },
        { label: 'Team', href: '#team' },
        { label: 'Results', href: '#stats' },
        { label: 'Contact', href: '#contact' },
      ],
      ctaButton: { label: 'Book a Consultation', href: '#contact' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        {
          title: 'Services',
          links: [
            { label: 'Strategy Consulting', href: '#' },
            { label: 'Digital Transformation', href: '#' },
            { label: 'M&A Advisory', href: '#' },
            { label: 'Operations', href: '#' },
          ],
        },
        {
          title: 'Industries',
          links: [
            { label: 'Financial Services', href: '#' },
            { label: 'Healthcare', href: '#' },
            { label: 'Technology', href: '#' },
            { label: 'Manufacturing', href: '#' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About Us', href: '#about' },
            { label: 'Leadership', href: '#team' },
            { label: 'Careers', href: '#' },
            { label: 'Insights', href: '#' },
          ],
        },
      ],
      copyright: '© 2026 Apex Advisory Group, LLC. All rights reserved.',
      socialLinks: [
        { icon: '💼', url: '#' },
        { icon: '𝕏', url: '#' },
      ],
    },
    seo: {
      title: 'Apex Advisory — Strategic Consulting for Growth',
      description: 'We help companies navigate complexity and accelerate growth. Strategy, digital transformation, and M&A advisory for the Fortune 500.',
      ogType: 'website',
    },
  },
  navigation: [],
  pages: [
    {
      id: 'home',
      segment: 'home',
      title: 'Home',
      content: 'landing',
      landingSections: [
        {
          id: 'hero',
          type: 'hero',
          variant: 'centered',
          heroConfig: {
            subheadline: 'Strategic Advisory',
            headline: 'Navigate complexity. Accelerate growth.',
            description: 'For over 20 years, Apex Advisory has helped Fortune 500 companies and high-growth startups make their most critical decisions with confidence.',
            primaryCta: { label: 'Book a Consultation', href: '#contact' },
            secondaryCta: { label: 'Our Services', href: '#services' },
            alignment: 'center',
            minHeight: '85vh',
          },
          background: {
            type: 'image',
            value: 'https://placehold.co/1920x1080/1e3a5f/ffffff?text=Skyline+Cityscape',
            overlay: 'rgba(0,0,0,0.55)',
          },
        },
        {
          id: 'about',
          type: 'content',
          anchor: 'about',
          contentConfig: {
            headline: 'Who We Are',
            body: '<p>Apex Advisory is a management consulting firm that partners with executives to solve their toughest challenges. Our team combines deep industry expertise with rigorous analytical frameworks to deliver results that last.</p><p>We do not just advise — we embed with your team, roll up our sleeves, and stay until the impact is measurable. Our clients see an average 35% improvement in operational efficiency within the first year.</p>',
            image: 'https://placehold.co/500x400/1e40af/ffffff?text=Team+Meeting',
            imagePosition: 'right',
            bodyFormat: 'html',
          },
        },
        {
          id: 'services',
          type: 'features',
          anchor: 'services',
          background: { type: 'color', value: '#eff6ff' },
          featuresConfig: {
            headline: 'Our Services',
            subtitle: 'Comprehensive consulting across strategy, operations, and technology.',
            items: [
              { icon: '🧭', title: 'Corporate Strategy', description: 'Market entry, competitive positioning, portfolio optimization, and long-range planning for sustainable growth.' },
              { icon: '🔄', title: 'Digital Transformation', description: 'End-to-end digital strategy and implementation. Cloud migration, process automation, and data-driven decision making.' },
              { icon: '🤝', title: 'M&A Advisory', description: 'Due diligence, valuation, integration planning, and post-merger optimization to maximize deal value.' },
              { icon: '⚙️', title: 'Operations Excellence', description: 'Supply chain optimization, lean process design, and performance management systems that drive bottom-line results.' },
              { icon: '📈', title: 'Revenue Growth', description: 'Pricing strategy, sales force effectiveness, and go-to-market optimization to unlock new revenue streams.' },
              { icon: '🏛️', title: 'Risk & Compliance', description: 'Regulatory readiness, risk frameworks, and governance structures that protect value and build trust.' },
            ],
            columns: 3,
            variant: 'cards',
          },
        },
        {
          id: 'team',
          type: 'team',
          anchor: 'team',
          teamConfig: {
            headline: 'Leadership Team',
            subtitle: 'Senior partners with decades of experience across industries.',
            members: [
              { name: 'Victoria Harrington', role: 'Managing Partner', avatar: 'https://placehold.co/300x300/1e40af/ffffff?text=VH', bio: 'Former McKinsey partner with 25 years in strategy consulting.' },
              { name: 'Robert Nakamura', role: 'Partner, Digital', avatar: 'https://placehold.co/300x300/1d4ed8/ffffff?text=RN', bio: 'Led digital transformations for 3 Fortune 100 companies.' },
              { name: 'Isabelle Moreau', role: 'Partner, M&A', avatar: 'https://placehold.co/300x300/2563eb/ffffff?text=IM', bio: 'Advised on $40B+ in transactions across 15 countries.' },
            ],
            columns: 3,
          },
        },
        {
          id: 'testimonials',
          type: 'testimonials',
          anchor: 'testimonials',
          background: { type: 'color', value: '#eff6ff' },
          testimonialsConfig: {
            headline: 'Client Results',
            items: [
              { quote: 'Apex helped us identify $120M in cost savings during our post-merger integration. Their team was exceptional.', name: 'James Whitfield', title: 'CFO', company: 'Meridian Health Systems', rating: 5 },
              { quote: 'The digital transformation roadmap they built became the foundation of our 5-year technology strategy.', name: 'Dr. Sarah Lin', title: 'CEO', company: 'Pacific Financial Group', rating: 5 },
              { quote: 'They brought a level of rigor and insight that our internal team simply could not match. Worth every penny.', name: 'Michael O\'Brien', title: 'COO', company: 'Atlas Manufacturing', rating: 5 },
            ],
            variant: 'grid',
          },
        },
        {
          id: 'stats',
          type: 'stats',
          anchor: 'stats',
          background: { type: 'color', value: '#1e3a5f' },
          statsConfig: {
            items: [
              { value: '20', label: 'Years in Business', suffix: '+' },
              { value: '500', label: 'Engagements Completed', suffix: '+' },
              { value: '35', label: 'Avg. Efficiency Gain', suffix: '%' },
              { value: '95', label: 'Client Retention Rate', suffix: '%' },
            ],
          },
        },
        {
          id: 'contact',
          type: 'contact',
          anchor: 'contact',
          contactConfig: {
            headline: 'Schedule a Consultation',
            subtitle: 'Tell us about your challenge and a senior partner will reach out within 24 hours.',
            successMessage: 'Thank you. A partner will contact you shortly.',
          },
        },
      ],
    },
  ],
};

// ─── Template: Nonprofit Charity ────────────────────────────────

const TEMPLATE_NONPROFIT_CHARITY: AppConfig = {
  id: 'nonprofit-charity',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'Bright Futures',
    subtitle: 'Education for every child',
    homeSegment: 'home',
    primaryColor: '#f59e0b',
  },
  landingConfig: {
    navbar: {
      title: 'Bright Futures',
      links: [
        { label: 'Our Mission', href: '#mission' },
        { label: 'Impact', href: '#stats' },
        { label: 'Team', href: '#team' },
        { label: 'Gallery', href: '#gallery' },
      ],
      ctaButton: { label: 'Donate Now', href: '#donate', variant: 'primary' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        {
          title: 'Organization',
          links: [
            { label: 'Our Mission', href: '#mission' },
            { label: 'Programs', href: '#' },
            { label: 'Annual Report', href: '#' },
            { label: 'Financials', href: '#' },
          ],
        },
        {
          title: 'Get Involved',
          links: [
            { label: 'Donate', href: '#donate' },
            { label: 'Volunteer', href: '#' },
            { label: 'Partner With Us', href: '#' },
            { label: 'Fundraise', href: '#' },
          ],
        },
        {
          title: 'Contact',
          links: [
            { label: 'Email Us', href: 'mailto:hello@brightfutures.org' },
            { label: 'Call: +1 (800) 555-0199', href: 'tel:+18005550199' },
            { label: 'Newsletter', href: '#' },
          ],
        },
      ],
      copyright: '© 2026 Bright Futures Foundation. 501(c)(3) nonprofit organization.',
      socialLinks: [
        { icon: '📸', url: '#' },
        { icon: '📘', url: '#' },
        { icon: '𝕏', url: '#' },
      ],
    },
    seo: {
      title: 'Bright Futures — Education for Every Child',
      description: 'Bright Futures provides educational resources, scholarships, and mentorship to underserved children in 12 countries.',
      ogType: 'website',
    },
  },
  navigation: [],
  pages: [
    {
      id: 'home',
      segment: 'home',
      title: 'Home',
      content: 'landing',
      landingSections: [
        {
          id: 'hero',
          type: 'hero',
          variant: 'centered',
          heroConfig: {
            subheadline: 'Every Child Deserves a Chance',
            headline: 'Education changes everything',
            description: 'We provide scholarships, school supplies, and mentors to children in underserved communities across 12 countries. Together, we have helped 50,000 kids stay in school.',
            primaryCta: { label: 'Donate Now', href: '#donate' },
            secondaryCta: { label: 'See Our Impact', href: '#stats' },
            alignment: 'center',
            minHeight: '85vh',
          },
          background: {
            type: 'image',
            value: 'https://placehold.co/1920x1080/f59e0b/ffffff?text=Children+Learning',
            overlay: 'rgba(0,0,0,0.45)',
          },
        },
        {
          id: 'stats',
          type: 'stats',
          anchor: 'stats',
          background: { type: 'color', value: '#fffbeb' },
          statsConfig: {
            headline: 'Our Impact So Far',
            items: [
              { value: '50,000', label: 'Children Supported', suffix: '+' },
              { value: '12', label: 'Countries', suffix: '' },
              { value: '200', label: 'Schools Built', suffix: '+' },
              { value: '98', label: 'Graduation Rate', suffix: '%' },
            ],
          },
        },
        {
          id: 'mission',
          type: 'content',
          anchor: 'mission',
          contentConfig: {
            headline: 'Our Mission',
            body: '<p>Bright Futures believes that education is the most powerful tool for breaking the cycle of poverty. Since 2008, we have worked in rural and urban communities to ensure that every child has access to quality education, regardless of their circumstances.</p><p>Our programs provide full scholarships, school supplies, nutritious meals, and trained mentors. We do not just enroll children in school — we make sure they thrive, graduate, and build the future they deserve.</p>',
            image: 'https://placehold.co/500x600/f59e0b/ffffff?text=Classroom',
            imagePosition: 'left',
            bodyFormat: 'html',
          },
        },
        {
          id: 'team',
          type: 'team',
          anchor: 'team',
          background: { type: 'color', value: '#fffbeb' },
          teamConfig: {
            headline: 'Our Leadership',
            subtitle: 'Dedicated professionals committed to making education accessible.',
            members: [
              { name: 'Grace Adeyemi', role: 'Executive Director', avatar: 'https://placehold.co/300x300/f59e0b/ffffff?text=GA', bio: 'Former UNICEF advisor. 20 years in global education.' },
              { name: 'Daniel Reyes', role: 'Director of Programs', avatar: 'https://placehold.co/300x300/d97706/ffffff?text=DR', bio: 'Built and scaled programs across Latin America and Africa.' },
              { name: 'Aisha Khan', role: 'Director of Development', avatar: 'https://placehold.co/300x300/b45309/ffffff?text=AK', bio: 'Raised $50M+ for global education nonprofits.' },
            ],
            columns: 3,
          },
        },
        {
          id: 'gallery',
          type: 'gallery',
          anchor: 'gallery',
          galleryConfig: {
            headline: 'Stories from the Field',
            images: [
              { src: 'https://placehold.co/600x400/fef3c7/92400e?text=Classroom+Kenya', alt: 'Classroom in Kenya', caption: 'New classroom in Nairobi, Kenya' },
              { src: 'https://placehold.co/600x400/fde68a/92400e?text=Students+India', alt: 'Students in India', caption: 'Scholarship students in Mumbai' },
              { src: 'https://placehold.co/600x400/fef3c7/92400e?text=Library+Colombia', alt: 'Library in Colombia', caption: 'Community library in Bogota' },
              { src: 'https://placehold.co/600x400/fde68a/92400e?text=Graduation+Ghana', alt: 'Graduation in Ghana', caption: 'First graduating class in Accra' },
            ],
            columns: 2,
            variant: 'grid',
          },
        },
        {
          id: 'donate',
          type: 'cta',
          anchor: 'donate',
          ctaConfig: {
            headline: 'Give the gift of education',
            description: '$25 provides school supplies for one child for an entire year. $100 funds a full scholarship. Every dollar goes directly to programs.',
            primaryCta: { label: 'Donate Now', href: '#' },
            secondaryCta: { label: 'Become a Monthly Donor', href: '#' },
            variant: 'centered',
          },
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          },
        },
      ],
    },
  ],
};

// ─── Template: Fitness Gym ──────────────────────────────────────

const TEMPLATE_FITNESS_GYM: AppConfig = {
  id: 'fitness-gym',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'IronForge',
    subtitle: 'Strength starts here',
    homeSegment: 'home',
    primaryColor: '#ef4444',
  },
  landingConfig: {
    navbar: {
      title: 'IronForge',
      links: [
        { label: 'Classes', href: '#classes' },
        { label: 'Memberships', href: '#pricing' },
        { label: 'Results', href: '#testimonials' },
        { label: 'Gallery', href: '#gallery' },
      ],
      ctaButton: { label: 'Join Now', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        {
          title: 'Programs',
          links: [
            { label: 'CrossFit', href: '#' },
            { label: 'HIIT', href: '#' },
            { label: 'Yoga', href: '#' },
            { label: 'Personal Training', href: '#' },
          ],
        },
        {
          title: 'Info',
          links: [
            { label: 'Schedule', href: '#' },
            { label: 'Trainers', href: '#' },
            { label: 'Nutrition Plans', href: '#' },
            { label: 'Blog', href: '#' },
          ],
        },
        {
          title: 'Location',
          links: [
            { label: '456 Fitness Blvd', href: '#' },
            { label: 'Austin, TX 78701', href: '#' },
            { label: 'Open 5AM - 11PM Daily', href: '#' },
            { label: '+1 (512) 555-0123', href: 'tel:+15125550123' },
          ],
        },
      ],
      copyright: '© 2026 IronForge Fitness. All rights reserved.',
      socialLinks: [
        { icon: '📸', url: '#' },
        { icon: '📺', url: '#' },
        { icon: '🏋️', url: '#' },
      ],
    },
    seo: {
      title: 'IronForge — Strength Starts Here',
      description: 'Austin\'s premier fitness facility. CrossFit, HIIT, yoga, and personal training with world-class coaches. First week free.',
      ogType: 'website',
    },
  },
  navigation: [],
  pages: [
    {
      id: 'home',
      segment: 'home',
      title: 'Home',
      content: 'landing',
      landingSections: [
        {
          id: 'hero',
          type: 'hero',
          variant: 'centered',
          heroConfig: {
            subheadline: 'Austin\'s #1 Rated Gym',
            headline: 'Your strongest chapter starts today',
            description: 'World-class coaching, cutting-edge equipment, and a community that pushes you further. First week on us — no strings attached.',
            video: 'https://placehold.co/1920x1080/171717/ef4444?text=Gym+Video+Background',
            primaryCta: { label: 'Start Your Free Week', href: '#cta' },
            secondaryCta: { label: 'View Classes', href: '#classes' },
            alignment: 'center',
            minHeight: '90vh',
          },
          background: {
            type: 'image',
            value: 'https://placehold.co/1920x1080/171717/ef4444?text=Gym+Interior',
            overlay: 'rgba(0,0,0,0.6)',
          },
        },
        {
          id: 'classes',
          type: 'features',
          anchor: 'classes',
          featuresConfig: {
            headline: 'Find Your Fit',
            subtitle: '30+ classes per week, 6 disciplines, all fitness levels welcome.',
            items: [
              { icon: '🏋️', title: 'CrossFit', description: 'High-intensity functional training in a supportive group setting. Build strength, endurance, and grit.' },
              { icon: '⚡', title: 'HIIT', description: '45-minute metabolic conditioning sessions designed to torch calories and build lean muscle fast.' },
              { icon: '🧘', title: 'Yoga & Mobility', description: 'Vinyasa, power yoga, and dedicated mobility classes to keep you flexible and injury-free.' },
              { icon: '🥊', title: 'Boxing', description: 'Bag work, pad drills, and conditioning. Get fighting fit with our certified boxing coaches.' },
              { icon: '🎯', title: 'Personal Training', description: 'One-on-one coaching with certified trainers who create custom programs tailored to your goals.' },
              { icon: '🏃', title: 'Endurance', description: 'Running clinics, rowing intervals, and cardio conditioning for athletes and weekend warriors alike.' },
            ],
            columns: 3,
            variant: 'cards',
          },
        },
        {
          id: 'pricing',
          type: 'pricing',
          anchor: 'pricing',
          background: { type: 'color', value: '#1a1a1a' },
          pricingConfig: {
            headline: 'Membership Plans',
            subtitle: 'No contracts. No hidden fees. Cancel anytime.',
            plans: [
              {
                name: 'Essential',
                price: '$59',
                period: '/mo',
                description: 'Everything you need to get started.',
                features: ['Unlimited gym access', 'Locker room & showers', 'Free WiFi', 'Mobile app access'],
                cta: { label: 'Start Free Week', href: '#' },
              },
              {
                name: 'Performance',
                price: '$99',
                period: '/mo',
                description: 'For serious athletes.',
                features: ['Unlimited gym access', 'All group classes', 'InBody composition scans', 'Nutrition consultation', 'Guest passes (2/mo)'],
                cta: { label: 'Start Free Week', href: '#' },
                highlighted: true,
                badge: 'Most Popular',
              },
              {
                name: 'Elite',
                price: '$179',
                period: '/mo',
                description: 'The complete training experience.',
                features: ['Unlimited gym access', 'All group classes', 'Monthly PT session', 'Recovery suite access', 'Custom meal plan', 'Priority booking', 'Unlimited guests'],
                cta: { label: 'Start Free Week', href: '#' },
              },
            ],
          },
        },
        {
          id: 'testimonials',
          type: 'testimonials',
          anchor: 'testimonials',
          testimonialsConfig: {
            headline: 'Real Results',
            items: [
              { quote: 'I lost 30 pounds in 6 months and gained muscle I never thought possible. The coaches at IronForge changed my life.', name: 'Kevin Brooks', title: 'Member since 2024', rating: 5 },
              { quote: 'Best gym community in Austin. The 6AM CrossFit crew keeps me accountable and makes every morning count.', name: 'Amanda Liu', title: 'Member since 2023', rating: 5 },
              { quote: 'As a former D1 athlete, I am picky about training facilities. IronForge is the real deal — equipment, coaching, everything.', name: 'Marcus Green', title: 'Member since 2025', rating: 5 },
            ],
            variant: 'carousel',
          },
        },
        {
          id: 'gallery',
          type: 'gallery',
          anchor: 'gallery',
          background: { type: 'color', value: '#f5f5f4' },
          galleryConfig: {
            headline: 'Inside IronForge',
            images: [
              { src: 'https://placehold.co/600x400/171717/ef4444?text=Weight+Floor', alt: 'Weight Floor', caption: '10,000 sq ft weight floor' },
              { src: 'https://placehold.co/600x400/171717/ef4444?text=CrossFit+Box', alt: 'CrossFit Box', caption: 'Dedicated CrossFit box' },
              { src: 'https://placehold.co/600x400/171717/ef4444?text=Yoga+Studio', alt: 'Yoga Studio', caption: 'Heated yoga studio' },
              { src: 'https://placehold.co/600x400/171717/ef4444?text=Recovery+Suite', alt: 'Recovery Suite', caption: 'Recovery suite with sauna' },
            ],
            columns: 2,
            variant: 'grid',
          },
        },
        {
          id: 'cta',
          type: 'cta',
          anchor: 'cta',
          ctaConfig: {
            headline: 'Your first week is free',
            description: 'No credit card required. Walk in, work out, and see why IronForge is Austin\'s top-rated gym.',
            primaryCta: { label: 'Claim Your Free Week', href: '#' },
            secondaryCta: { label: 'Take a Virtual Tour', href: '#' },
            variant: 'centered',
          },
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
          },
        },
      ],
    },
  ],
};

// ─── Template: Real Estate Listing ──────────────────────────────

const TEMPLATE_REALESTATE_LISTING: AppConfig = {
  id: 'realestate-listing',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'Prestige Realty',
    subtitle: 'Luxury homes, exceptional service',
    homeSegment: 'home',
    primaryColor: '#0f766e',
  },
  landingConfig: {
    navbar: {
      title: 'Prestige Realty',
      links: [
        { label: 'Properties', href: '#gallery' },
        { label: 'Features', href: '#features' },
        { label: 'Market Data', href: '#stats' },
        { label: 'Reviews', href: '#testimonials' },
        { label: 'Contact', href: '#contact' },
      ],
      ctaButton: { label: 'Schedule Viewing', href: '#contact' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        {
          title: 'Properties',
          links: [
            { label: 'For Sale', href: '#' },
            { label: 'For Rent', href: '#' },
            { label: 'New Developments', href: '#' },
            { label: 'Commercial', href: '#' },
          ],
        },
        {
          title: 'Services',
          links: [
            { label: 'Property Valuation', href: '#' },
            { label: 'Mortgage Calculator', href: '#' },
            { label: 'Investment Advisory', href: '#' },
            { label: 'Property Management', href: '#' },
          ],
        },
        {
          title: 'Contact',
          links: [
            { label: '789 Park Avenue', href: '#' },
            { label: 'Miami, FL 33101', href: '#' },
            { label: '+1 (305) 555-0456', href: 'tel:+13055550456' },
            { label: 'info@prestigerealty.com', href: 'mailto:info@prestigerealty.com' },
          ],
        },
      ],
      copyright: '© 2026 Prestige Realty Group. Licensed in FL, NY, CA.',
      socialLinks: [
        { icon: '📸', url: '#' },
        { icon: '💼', url: '#' },
        { icon: '📺', url: '#' },
      ],
    },
    seo: {
      title: 'Prestige Realty — Luxury Homes & Exceptional Service',
      description: 'Miami\'s premier luxury real estate agency. Browse exclusive properties, get expert market insights, and find your dream home.',
      ogType: 'website',
    },
  },
  navigation: [],
  pages: [
    {
      id: 'home',
      segment: 'home',
      title: 'Home',
      content: 'landing',
      landingSections: [
        {
          id: 'hero',
          type: 'hero',
          variant: 'centered',
          heroConfig: {
            subheadline: 'Luxury Real Estate',
            headline: 'Find the home you have always dreamed of',
            description: 'Exclusive listings in Miami\'s most sought-after neighborhoods. Waterfront estates, penthouses, and architectural masterpieces.',
            primaryCta: { label: 'Browse Properties', href: '#gallery' },
            secondaryCta: { label: 'Schedule a Viewing', href: '#contact' },
            alignment: 'center',
            minHeight: '90vh',
          },
          background: {
            type: 'image',
            value: 'https://placehold.co/1920x1080/0f766e/ffffff?text=Luxury+Waterfront+Home',
            overlay: 'rgba(0,0,0,0.4)',
          },
        },
        {
          id: 'gallery',
          type: 'gallery',
          anchor: 'gallery',
          galleryConfig: {
            headline: 'Featured Properties',
            images: [
              { src: 'https://placehold.co/600x400/e0f2f1/0f766e?text=Waterfront+Villa', alt: 'Waterfront Villa', caption: 'Waterfront Villa — $4.2M — 5 BD / 4 BA' },
              { src: 'https://placehold.co/600x400/ccfbf1/0f766e?text=Modern+Penthouse', alt: 'Modern Penthouse', caption: 'Sky Penthouse — $3.8M — 4 BD / 3 BA' },
              { src: 'https://placehold.co/600x400/e0f2f1/0f766e?text=Garden+Estate', alt: 'Garden Estate', caption: 'Coral Gables Estate — $5.1M — 6 BD / 5 BA' },
              { src: 'https://placehold.co/600x400/ccfbf1/0f766e?text=Beach+Condo', alt: 'Beach Condo', caption: 'South Beach Condo — $1.9M — 3 BD / 2 BA' },
              { src: 'https://placehold.co/600x400/e0f2f1/0f766e?text=Art+Deco+Home', alt: 'Art Deco Home', caption: 'Art Deco Residence — $2.7M — 4 BD / 3 BA' },
              { src: 'https://placehold.co/600x400/ccfbf1/0f766e?text=Luxury+Townhouse', alt: 'Luxury Townhouse', caption: 'Brickell Townhouse — $1.5M — 3 BD / 2 BA' },
            ],
            columns: 3,
            variant: 'grid',
          },
        },
        {
          id: 'features',
          type: 'features',
          anchor: 'features',
          background: { type: 'color', value: '#f0fdfa' },
          featuresConfig: {
            headline: 'Why Choose Prestige',
            subtitle: 'A full-service luxury real estate experience from first showing to closing day.',
            items: [
              { icon: '🏠', title: 'Exclusive Listings', description: 'Access to off-market properties and pre-construction opportunities not available on public platforms.' },
              { icon: '📊', title: 'Market Intelligence', description: 'Data-driven pricing analysis, neighborhood trends, and investment projections to help you make confident decisions.' },
              { icon: '🤝', title: 'White-Glove Service', description: 'A dedicated agent, property stylist, and transaction coordinator handle every detail from tour to closing.' },
              { icon: '🌍', title: 'Global Network', description: 'Connected to 500+ luxury agencies worldwide. We help international buyers find their perfect Miami home.' },
            ],
            columns: 4,
            variant: 'icons',
          },
        },
        {
          id: 'stats',
          type: 'stats',
          anchor: 'stats',
          background: { type: 'color', value: '#134e4a' },
          statsConfig: {
            items: [
              { value: '$2.1B', label: 'Total Sales Volume', suffix: '' },
              { value: '850', label: 'Homes Sold', suffix: '+' },
              { value: '15', label: 'Years in Business', suffix: '' },
              { value: '28', label: 'Avg. Days to Close', suffix: '' },
            ],
          },
        },
        {
          id: 'testimonials',
          type: 'testimonials',
          anchor: 'testimonials',
          testimonialsConfig: {
            headline: 'What Our Clients Say',
            items: [
              { quote: 'Prestige found us our dream waterfront home in under 30 days. Their knowledge of the Miami market is unmatched.', name: 'Sofia & Martin Kruger', title: 'Homeowners', company: 'Key Biscayne', rating: 5 },
              { quote: 'As an overseas buyer, I needed an agency I could trust completely. Prestige handled everything flawlessly, from virtual tours to closing.', name: 'Alexandre Fournier', title: 'Investor', company: 'Paris / Miami', rating: 5 },
              { quote: 'They sold our condo above asking price in just 12 days. The staging and marketing were absolutely first-class.', name: 'Jennifer Walsh', title: 'Seller', company: 'Brickell', rating: 5 },
            ],
            variant: 'grid',
          },
        },
        {
          id: 'contact',
          type: 'contact',
          anchor: 'contact',
          contactConfig: {
            headline: 'Schedule a Private Viewing',
            subtitle: 'Tell us what you are looking for and we will arrange private tours of matching properties.',
            successMessage: 'Thank you! An agent will contact you within 2 hours.',
          },
        },
      ],
    },
  ],
};

// ─── Template: Education Course ─────────────────────────────────

const TEMPLATE_EDUCATION_COURSE: AppConfig = {
  id: 'education-course',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'CodeCraft Academy',
    subtitle: 'Master full-stack development',
    homeSegment: 'home',
    primaryColor: '#7c3aed',
  },
  landingConfig: {
    navbar: {
      title: 'CodeCraft Academy',
      links: [
        { label: 'Curriculum', href: '#curriculum' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Reviews', href: '#testimonials' },
        { label: 'FAQ', href: '#faq' },
      ],
      ctaButton: { label: 'Enroll Now', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        {
          title: 'Courses',
          links: [
            { label: 'Full-Stack Bootcamp', href: '#' },
            { label: 'React Masterclass', href: '#' },
            { label: 'Node.js & APIs', href: '#' },
            { label: 'DevOps Essentials', href: '#' },
          ],
        },
        {
          title: 'Resources',
          links: [
            { label: 'Free Tutorials', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Student Projects', href: '#' },
            { label: 'Career Guide', href: '#' },
          ],
        },
        {
          title: 'Support',
          links: [
            { label: 'Help Center', href: '#' },
            { label: 'Community Forum', href: '#' },
            { label: 'Contact Us', href: '#' },
            { label: 'Refund Policy', href: '#' },
          ],
        },
      ],
      copyright: '© 2026 CodeCraft Academy. Learn. Build. Ship.',
      socialLinks: [
        { icon: '📺', url: '#' },
        { icon: '𝕏', url: '#' },
        { icon: '🎮', url: '#' },
      ],
    },
    seo: {
      title: 'CodeCraft Academy — Master Full-Stack Development',
      description: 'Learn to build production-ready web applications. Project-based curriculum, 1-on-1 mentoring, and career support. Join 8,000+ graduates.',
      ogType: 'website',
    },
  },
  navigation: [],
  pages: [
    {
      id: 'home',
      segment: 'home',
      title: 'Home',
      content: 'landing',
      landingSections: [
        {
          id: 'hero',
          type: 'hero',
          variant: 'centered',
          heroConfig: {
            subheadline: 'Online Bootcamp — Next Cohort Starts May 15',
            headline: 'Become a full-stack developer in 16 weeks',
            description: 'A project-based program where you build 6 real-world applications. Live instruction, code reviews, 1-on-1 mentoring, and career coaching included.',
            primaryCta: { label: 'Enroll Now — Save $200', href: '#pricing' },
            secondaryCta: { label: 'Download Syllabus', href: '#' },
            alignment: 'center',
            minHeight: '85vh',
          },
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)',
            overlay: 'rgba(0,0,0,0.1)',
          },
        },
        {
          id: 'curriculum',
          type: 'features',
          anchor: 'curriculum',
          featuresConfig: {
            headline: 'What You Will Learn',
            subtitle: '16 weeks of intensive, hands-on training covering the complete modern web stack.',
            items: [
              { icon: '🌐', title: 'HTML, CSS & JavaScript', description: 'Weeks 1-3: Build responsive websites from scratch. Master Flexbox, Grid, ES6+, and DOM manipulation.' },
              { icon: '⚛️', title: 'React & TypeScript', description: 'Weeks 4-7: Component architecture, hooks, state management, testing, and TypeScript integration.' },
              { icon: '🖥️', title: 'Node.js & Databases', description: 'Weeks 8-11: REST APIs, authentication, PostgreSQL, MongoDB, and server-side architecture.' },
              { icon: '☁️', title: 'DevOps & Deployment', description: 'Weeks 12-13: Docker, CI/CD, cloud deployment, monitoring, and production best practices.' },
              { icon: '🚀', title: 'Capstone Project', description: 'Weeks 14-16: Build and launch a full-stack application. Code reviews by senior engineers.' },
              { icon: '💼', title: 'Career Prep', description: 'Resume building, portfolio reviews, mock interviews, and direct introductions to hiring partners.' },
            ],
            columns: 3,
            variant: 'cards',
          },
        },
        {
          id: 'pricing',
          type: 'pricing',
          anchor: 'pricing',
          background: { type: 'color', value: '#f5f3ff' },
          pricingConfig: {
            headline: 'Investment in Your Future',
            subtitle: 'Pay upfront and save, or split into monthly installments. 30-day money-back guarantee.',
            plans: [
              {
                name: 'Self-Paced',
                price: '$1,499',
                description: 'Learn at your own speed with recorded content.',
                features: ['Full video curriculum', 'Project starter repos', 'Community Discord access', 'Certificate of completion', '6 months access'],
                cta: { label: 'Enroll Self-Paced', href: '#' },
              },
              {
                name: 'Live Cohort',
                price: '$2,999',
                description: 'Real-time instruction with your cohort.',
                features: ['Live sessions 3x/week', 'Weekly code reviews', '1-on-1 mentoring (bi-weekly)', 'All self-paced content', 'Career coaching', 'Lifetime access', 'Slack channel access'],
                cta: { label: 'Enroll in Cohort', href: '#' },
                highlighted: true,
                badge: 'Most Popular',
              },
              {
                name: 'Premium',
                price: '$4,999',
                description: 'White-glove experience with guaranteed outcomes.',
                features: ['Everything in Live Cohort', 'Weekly 1-on-1 mentoring', 'Resume & portfolio review', 'Mock interviews (3)', 'Job placement support', 'Salary negotiation coaching', 'Lifetime alumni network'],
                cta: { label: 'Apply for Premium', href: '#' },
              },
            ],
          },
        },
        {
          id: 'testimonials',
          type: 'testimonials',
          anchor: 'testimonials',
          testimonialsConfig: {
            headline: 'Graduate Success Stories',
            items: [
              { quote: 'I went from zero coding experience to a $95K developer role in 5 months. CodeCraft\'s project-based approach made all the difference.', name: 'Tyler Reed', title: 'Software Engineer', company: 'Shopify', rating: 5 },
              { quote: 'The mentors are actual senior engineers, not teaching assistants. That quality of feedback is what sets this program apart.', name: 'Nina Kowalski', title: 'Frontend Developer', company: 'Stripe', rating: 5 },
              { quote: 'I already knew some JavaScript but CodeCraft took me from hobby coder to confident professional. Best investment I have made.', name: 'Jordan Hayes', title: 'Full-Stack Developer', company: 'Notion', rating: 5 },
            ],
            variant: 'grid',
          },
        },
        {
          id: 'faq',
          type: 'faq',
          anchor: 'faq',
          background: { type: 'color', value: '#f5f3ff' },
          faqConfig: {
            headline: 'Frequently Asked Questions',
            items: [
              { question: 'Do I need prior coding experience?', answer: 'No. Our bootcamp starts from the fundamentals. If you can use a computer and are willing to put in 20+ hours per week, you will succeed.' },
              { question: 'What is the time commitment?', answer: 'The live cohort requires 20-25 hours per week. Live sessions are Mon/Wed/Fri evenings (7-9 PM ET), and the rest is project work and study.' },
              { question: 'Is there a money-back guarantee?', answer: 'Yes. If you are not satisfied within the first 30 days, we will refund your full tuition — no questions asked.' },
              { question: 'Do you help with job placement?', answer: 'Our Premium plan includes active job placement support. All plans include career coaching, resume reviews, and access to our hiring partner network of 200+ companies.' },
              { question: 'Can I pay in installments?', answer: 'Yes. We offer 3-month and 6-month payment plans at 0% interest. Income Share Agreements are also available for qualifying students.' },
            ],
            variant: 'accordion',
          },
        },
        {
          id: 'cta',
          type: 'cta',
          anchor: 'cta',
          ctaConfig: {
            headline: 'Next cohort starts May 15 — seats are limited',
            description: 'Join 8,000+ graduates who launched their tech careers with CodeCraft. Early enrollment saves you $200.',
            primaryCta: { label: 'Enroll Now', href: '#pricing' },
            secondaryCta: { label: 'Talk to an Advisor', href: '#' },
            variant: 'centered',
          },
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
          },
        },
      ],
    },
  ],
};

// ─── Template: App Download ─────────────────────────────────────

const TEMPLATE_APP_DOWNLOAD: AppConfig = {
  id: 'app-download',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'Pulse',
    subtitle: 'Your health, in your pocket',
    homeSegment: 'home',
    primaryColor: '#10b981',
  },
  landingConfig: {
    navbar: {
      title: 'Pulse',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#stats' },
        { label: 'Reviews', href: '#testimonials' },
      ],
      ctaButton: { label: 'Download Free', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        {
          title: 'Product',
          links: [
            { label: 'Features', href: '#features' },
            { label: 'Pricing', href: '#' },
            { label: 'Integrations', href: '#' },
            { label: 'What\'s New', href: '#' },
          ],
        },
        {
          title: 'Support',
          links: [
            { label: 'Help Center', href: '#' },
            { label: 'Community', href: '#' },
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Use', href: '#' },
          ],
        },
        {
          title: 'Download',
          links: [
            { label: 'iOS App Store', href: '#', external: true },
            { label: 'Google Play', href: '#', external: true },
          ],
        },
      ],
      copyright: '© 2026 Pulse Health Inc. All rights reserved.',
      socialLinks: [
        { icon: '📸', url: '#' },
        { icon: '𝕏', url: '#' },
        { icon: '📺', url: '#' },
      ],
    },
    seo: {
      title: 'Pulse — Your Health, In Your Pocket',
      description: 'Track sleep, nutrition, workouts, and vitals in one beautiful app. Syncs with Apple Watch, Fitbit, and Garmin. Free to download.',
      ogType: 'website',
    },
  },
  navigation: [],
  pages: [
    {
      id: 'home',
      segment: 'home',
      title: 'Home',
      content: 'landing',
      landingSections: [
        {
          id: 'hero',
          type: 'hero',
          variant: 'split',
          heroConfig: {
            subheadline: 'Health & Wellness App',
            headline: 'The smartest way to track your health',
            description: 'Sleep, nutrition, workouts, and vitals — all in one app. Powered by AI to give you personalized insights that actually help you feel better.',
            image: 'https://placehold.co/400x700/10b981/ffffff?text=Phone+Mockup',
            primaryCta: { label: 'Download for iOS', href: '#' },
            secondaryCta: { label: 'Download for Android', href: '#' },
            alignment: 'left',
            minHeight: '90vh',
          },
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          },
        },
        {
          id: 'features',
          type: 'features',
          anchor: 'features',
          featuresConfig: {
            headline: 'Everything you need, nothing you do not',
            subtitle: 'Built with simplicity in mind. Powerful insights without the complexity.',
            items: [
              { icon: '😴', title: 'Smart Sleep Tracking', description: 'Auto-detects sleep stages and gives you a daily sleep score. Wake up to insights, not just alarms.' },
              { icon: '🍎', title: 'Nutrition Log', description: 'Scan barcodes or snap photos of meals. AI estimates macros and tracks your daily intake effortlessly.' },
              { icon: '🏃', title: 'Workout Tracking', description: '200+ exercises with auto-rep counting. Syncs with your wearable for heart rate zones and calorie burn.' },
              { icon: '❤️', title: 'Heart & Vitals', description: 'Monitor resting heart rate, HRV, blood oxygen, and stress levels. Get alerts when something is off.' },
              { icon: '🤖', title: 'AI Health Coach', description: 'Personalized daily tips based on your data. The more you use Pulse, the smarter it gets.' },
              { icon: '⌚', title: 'Device Sync', description: 'Connects to Apple Watch, Fitbit, Garmin, Oura Ring, and Whoop. All your data in one place.' },
            ],
            columns: 3,
            variant: 'icons',
          },
        },
        {
          id: 'stats',
          type: 'stats',
          anchor: 'stats',
          background: { type: 'color', value: '#064e3b' },
          statsConfig: {
            headline: 'Trusted by health-conscious people everywhere',
            items: [
              { value: '2M', label: 'Active Users', suffix: '+' },
              { value: '4.8', label: 'App Store Rating', suffix: '⭐' },
              { value: '50M', label: 'Workouts Logged', suffix: '+' },
              { value: '30', label: 'Wearables Supported', suffix: '+' },
            ],
          },
        },
        {
          id: 'testimonials',
          type: 'testimonials',
          anchor: 'testimonials',
          testimonialsConfig: {
            headline: 'What users are saying',
            items: [
              { quote: 'Pulse replaced three different health apps for me. The sleep tracking alone is worth it — I finally understand my sleep patterns.', name: 'Rachel Moore', title: 'Marathon Runner', rating: 5 },
              { quote: 'The AI coach noticed my HRV dropping and suggested I take a rest day. Turns out I was coming down with something. Incredible.', name: 'Dev Patel', title: 'CrossFit Athlete', rating: 5 },
              { quote: 'I have tried every health app on the market. Pulse is the first one that made tracking nutrition feel effortless with the photo feature.', name: 'Sarah Kim', title: 'Nutritionist', rating: 5 },
            ],
            variant: 'carousel',
          },
        },
        {
          id: 'cta',
          type: 'cta',
          anchor: 'cta',
          ctaConfig: {
            headline: 'Start your health journey today',
            description: 'Download Pulse for free on iOS and Android. Premium features unlock for $4.99/month after your 14-day free trial.',
            primaryCta: { label: 'Download for iOS', href: '#' },
            secondaryCta: { label: 'Download for Android', href: '#' },
            variant: 'centered',
          },
          background: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          },
        },
      ],
    },
  ],
};

// ─── Template: Blog Masonry ─────────────────────────────────────

const TEMPLATE_BLOG_MASONRY: AppConfig = {
  id: 'blog-masonry',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'Mosaic',
    subtitle: 'A mosaic of stories and ideas',
    homeSegment: 'home',
    primaryColor: '#8b5cf6',
  },
  landingConfig: {
    navbar: {
      title: 'Mosaic',
      links: [
        { label: 'Stories', href: '/stories' },
        { label: 'Featured', href: '#hero' },
        { label: 'Subscribe', href: '#cta' },
      ],
      ctaButton: { label: 'Subscribe', href: '#cta' },
      sticky: true,
      transparent: false,
    },
    footer: {
      columns: [
        { title: 'Explore', links: [{ label: 'Latest', href: '#' }, { label: 'Popular', href: '#' }, { label: 'Featured', href: '#' }] },
        { title: 'About', links: [{ label: 'Our Story', href: '#' }, { label: 'Contributors', href: '#' }, { label: 'Contact', href: '#' }] },
      ],
      copyright: '© 2026 Mosaic. All rights reserved.',
      socialLinks: [{ icon: '📌', url: '#' }, { icon: '📸', url: '#' }],
    },
    seo: { title: 'Mosaic — A Mosaic of Stories and Ideas', description: 'Discover beautifully curated stories in a Pinterest-style layout. Art, design, culture, and more.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'split',
          heroConfig: {
            subheadline: 'Featured Post',
            headline: 'The art of visual storytelling in the digital age',
            description: 'How modern creators are blending photography, illustration, and data visualization to tell compelling stories.',
            image: 'https://placehold.co/700x500/8b5cf6/ffffff?text=Featured+Post',
            primaryCta: { label: 'Read Now', href: '#' },
            alignment: 'left', minHeight: '65vh',
          },
          background: { type: 'color', value: '#f5f3ff' },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Never miss a story', description: 'Get weekly curated stories delivered to your inbox. No spam, just inspiration.', primaryCta: { label: 'Subscribe Free', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#8b5cf6' },
        },
      ],
    },
    {
      id: 'stories', segment: 'stories', title: 'Stories', content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'posts', layout: 'grid', columns: 3, showCategories: true, showSearch: true, showPagination: true, pageSize: 12, postSegment: 'stories',
        cardFields: { title: 'title', excerpt: 'excerpt', image: 'coverImage', date: 'publishedAt', author: 'author', category: 'category', slug: 'slug' },
      },
    },
  ],
};

// ─── Template: Blog Clean ───────────────────────────────────────

const TEMPLATE_BLOG_CLEAN: AppConfig = {
  id: 'blog-clean',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'Longform',
    subtitle: 'Thoughtful writing, no distractions',
    homeSegment: 'home',
    primaryColor: '#374151',
  },
  landingConfig: {
    navbar: {
      title: 'Longform',
      links: [
        { label: 'Essays', href: '/essays' },
        { label: 'About', href: '#about' },
      ],
      ctaButton: { label: 'Subscribe', href: '#cta' },
      sticky: true,
      transparent: false,
    },
    footer: {
      columns: [
        { title: 'Navigate', links: [{ label: 'Essays', href: '/essays' }, { label: 'About', href: '#about' }, { label: 'Archive', href: '#' }] },
        { title: 'Connect', links: [{ label: 'Twitter', href: '#', external: true }, { label: 'RSS', href: '#', external: true }] },
      ],
      copyright: '© 2026 Longform. All rights reserved.',
      socialLinks: [{ icon: '𝕏', url: '#' }, { icon: '📡', url: '#' }],
    },
    seo: { title: 'Longform — Thoughtful Writing, No Distractions', description: 'A clean, focused blog for long-form essays on technology, culture, and the human experience.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'centered',
          heroConfig: { headline: 'Writing that deserves your full attention', description: 'Long-form essays on technology, culture, and what it means to build things that matter.', primaryCta: { label: 'Start Reading', href: '/essays' }, alignment: 'center', minHeight: '45vh' },
          background: { type: 'color', value: '#f9fafb' },
        },
        {
          id: 'about', type: 'content', anchor: 'about',
          contentConfig: { headline: 'About Longform', body: '<p>Longform is a space for writing that takes its time. No listicles, no hot takes — just carefully considered essays that explore ideas in depth.</p><p>Founded by writers who believe the internet still has room for thoughtful, well-crafted prose.</p>', imagePosition: 'right', bodyFormat: 'html' },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Join the reading list', description: 'One essay per week, delivered Sunday morning. No noise.', primaryCta: { label: 'Subscribe', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#374151' },
        },
      ],
    },
    {
      id: 'essays', segment: 'essays', title: 'Essays', content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'posts', layout: 'list', columns: 2, showCategories: false, showSearch: true, showPagination: true, pageSize: 10, postSegment: 'essays',
        cardFields: { title: 'title', excerpt: 'excerpt', date: 'publishedAt', author: 'author', slug: 'slug' },
      },
    },
  ],
};

// ─── Template: Blog Tech ────────────────────────────────────────

const TEMPLATE_BLOG_TECH: AppConfig = {
  id: 'blog-tech',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'DevPulse',
    subtitle: 'Code, cloud, and everything in between',
    homeSegment: 'home',
    primaryColor: '#06b6d4',
  },
  landingConfig: {
    navbar: {
      title: 'DevPulse',
      links: [
        { label: 'Articles', href: '/articles' },
        { label: 'Topics', href: '#topics' },
        { label: 'Newsletter', href: '#cta' },
      ],
      ctaButton: { label: 'Subscribe', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Topics', links: [{ label: 'Frontend', href: '#' }, { label: 'Backend', href: '#' }, { label: 'DevOps', href: '#' }, { label: 'AI/ML', href: '#' }] },
        { title: 'Community', links: [{ label: 'Discord', href: '#', external: true }, { label: 'GitHub', href: '#', external: true }, { label: 'RSS', href: '#', external: true }] },
      ],
      copyright: '© 2026 DevPulse. All rights reserved.',
      socialLinks: [{ icon: '🐙', url: '#' }, { icon: '💬', url: '#' }],
    },
    seo: { title: 'DevPulse — Code, Cloud, and Everything In Between', description: 'A developer blog covering frontend, backend, DevOps, and AI. Tutorials, deep dives, and industry analysis.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'centered',
          heroConfig: { headline: 'Stay ahead of the stack', subheadline: '> devpulse --latest', description: 'Deep technical articles on modern web development, cloud infrastructure, and emerging technologies. Written by engineers, for engineers.', primaryCta: { label: 'Browse Articles', href: '/articles' }, secondaryCta: { label: 'Subscribe', href: '#cta' }, alignment: 'center', minHeight: '60vh' },
          background: { type: 'gradient', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
        },
        {
          id: 'topics', type: 'features', anchor: 'topics',
          featuresConfig: {
            headline: 'Topics We Cover', subtitle: 'From frontend frameworks to distributed systems.',
            items: [
              { icon: '⚛️', title: 'Frontend', description: 'React, Vue, Svelte, and the modern UI landscape.' },
              { icon: '🔧', title: 'Backend', description: 'Node.js, Go, Rust, APIs, and server architecture.' },
              { icon: '☁️', title: 'Cloud & DevOps', description: 'AWS, Kubernetes, CI/CD, and infrastructure as code.' },
              { icon: '🤖', title: 'AI & ML', description: 'LLMs, computer vision, MLOps, and applied AI.' },
            ],
          },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Get the weekly dev digest', description: 'Curated technical articles, tools, and resources. Every Tuesday.', primaryCta: { label: 'Subscribe Free', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#06b6d4' },
        },
      ],
    },
    {
      id: 'articles', segment: 'articles', title: 'Articles', content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'posts', layout: 'grid', columns: 3, showCategories: true, showSearch: true, showPagination: true, pageSize: 12, postSegment: 'articles',
        cardFields: { title: 'title', excerpt: 'excerpt', image: 'coverImage', date: 'publishedAt', author: 'author', category: 'category', slug: 'slug' },
      },
    },
  ],
};

// ─── Template: Blog Lifestyle ───────────────────────────────────

const TEMPLATE_BLOG_LIFESTYLE: AppConfig = {
  id: 'blog-lifestyle',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'Bloom',
    subtitle: 'Wellness, style, and mindful living',
    homeSegment: 'home',
    primaryColor: '#f43f5e',
  },
  landingConfig: {
    navbar: {
      title: 'Bloom',
      links: [
        { label: 'Journal', href: '/journal' },
        { label: 'Wellness', href: '#' },
        { label: 'Style', href: '#' },
        { label: 'Mindfulness', href: '#' },
      ],
      ctaButton: { label: 'Subscribe', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Sections', links: [{ label: 'Wellness', href: '#' }, { label: 'Style', href: '#' }, { label: 'Mindfulness', href: '#' }, { label: 'Recipes', href: '#' }] },
        { title: 'Follow', links: [{ label: 'Instagram', href: '#', external: true }, { label: 'Pinterest', href: '#', external: true }, { label: 'YouTube', href: '#', external: true }] },
      ],
      copyright: '© 2026 Bloom. All rights reserved.',
      socialLinks: [{ icon: '📸', url: '#' }, { icon: '📌', url: '#' }, { icon: '📺', url: '#' }],
    },
    seo: { title: 'Bloom — Wellness, Style, and Mindful Living', description: 'A lifestyle blog dedicated to wellness, personal style, and living with intention. Inspiring content for modern women.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'split',
          heroConfig: { headline: 'Live beautifully, live intentionally', description: 'Discover articles on wellness, personal style, healthy recipes, and mindful living. Your daily dose of inspiration.', image: 'https://placehold.co/700x500/f43f5e/ffffff?text=Lifestyle+Blog', primaryCta: { label: 'Explore the Journal', href: '/journal' }, alignment: 'left', minHeight: '70vh' },
          background: { type: 'color', value: '#fff1f2' },
        },
        {
          id: 'gallery', type: 'gallery',
          galleryConfig: { headline: 'On Instagram', images: [
            { src: 'https://placehold.co/400x400/fda4af/ffffff?text=Yoga', alt: 'Yoga' },
            { src: 'https://placehold.co/400x400/fecdd3/ffffff?text=Smoothie', alt: 'Smoothie' },
            { src: 'https://placehold.co/400x400/ffe4e6/ffffff?text=Journal', alt: 'Journal' },
            { src: 'https://placehold.co/400x400/fda4af/ffffff?text=Nature', alt: 'Nature' },
          ], columns: 4 },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Join the Bloom community', description: 'Weekly inspiration for living well. Wellness tips, style guides, and recipes.', primaryCta: { label: 'Subscribe Free', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#f43f5e' },
        },
      ],
    },
    {
      id: 'journal', segment: 'journal', title: 'Journal', content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'posts', layout: 'magazine', columns: 3, showCategories: true, showSearch: true, showPagination: true, pageSize: 12, postSegment: 'journal',
        cardFields: { title: 'title', excerpt: 'excerpt', image: 'coverImage', date: 'publishedAt', author: 'author', category: 'category', slug: 'slug' },
      },
    },
  ],
};

// ─── Template: Blog News ────────────────────────────────────────

const TEMPLATE_BLOG_NEWS: AppConfig = {
  id: 'blog-news',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'The Dispatch',
    subtitle: 'Breaking news and in-depth analysis',
    homeSegment: 'home',
    primaryColor: '#dc2626',
  },
  landingConfig: {
    navbar: {
      title: 'The Dispatch',
      links: [
        { label: 'Latest', href: '/latest' },
        { label: 'World', href: '#' },
        { label: 'Business', href: '#' },
        { label: 'Tech', href: '#' },
        { label: 'Opinion', href: '#' },
      ],
      ctaButton: { label: 'Subscribe', href: '#cta' },
      sticky: true,
      transparent: false,
    },
    footer: {
      columns: [
        { title: 'Sections', links: [{ label: 'World', href: '#' }, { label: 'Business', href: '#' }, { label: 'Tech', href: '#' }, { label: 'Opinion', href: '#' }, { label: 'Sports', href: '#' }] },
        { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Masthead', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Advertise', href: '#' }] },
        { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }, { label: 'Cookie Policy', href: '#' }] },
      ],
      copyright: '© 2026 The Dispatch Media Group. All rights reserved.',
      socialLinks: [{ icon: '𝕏', url: '#' }, { icon: '📺', url: '#' }, { icon: '💼', url: '#' }],
    },
    seo: { title: 'The Dispatch — Breaking News and In-Depth Analysis', description: 'Your trusted source for breaking news, investigative journalism, and expert analysis from around the world.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'split',
          heroConfig: { subheadline: 'Breaking', headline: 'Global markets rally as central banks signal coordinated rate cuts', description: 'In a historic move, the Federal Reserve, ECB, and Bank of England announce synchronized monetary policy easing amid cooling inflation.', image: 'https://placehold.co/700x500/dc2626/ffffff?text=Breaking+News', primaryCta: { label: 'Full Coverage', href: '#' }, alignment: 'left', minHeight: '70vh' },
          background: { type: 'color', value: '#fef2f2' },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Stay informed', description: 'Breaking news alerts and daily briefings delivered to your inbox.', primaryCta: { label: 'Subscribe Free', href: '#' }, variant: 'banner' },
          background: { type: 'color', value: '#dc2626' },
        },
      ],
    },
    {
      id: 'latest', segment: 'latest', title: 'Latest', content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'articles', layout: 'magazine', columns: 3, showCategories: true, showSearch: true, showPagination: true, pageSize: 20, featuredCount: 3, postSegment: 'latest',
        cardFields: { title: 'title', excerpt: 'excerpt', image: 'coverImage', date: 'publishedAt', author: 'author', category: 'section', tags: 'tags', slug: 'slug' },
      },
    },
  ],
};

// ─── Template: Blog Personal ────────────────────────────────────

const TEMPLATE_BLOG_PERSONAL: AppConfig = {
  id: 'blog-personal',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'Alex Writes',
    subtitle: 'Personal reflections and creative explorations',
    homeSegment: 'home',
    primaryColor: '#7c3aed',
  },
  landingConfig: {
    navbar: {
      title: 'Alex Writes',
      links: [
        { label: 'Blog', href: '/blog' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' },
      ],
      ctaButton: { label: 'Say Hello', href: '#contact' },
      sticky: true,
      transparent: false,
    },
    footer: {
      columns: [
        { title: 'Pages', links: [{ label: 'Blog', href: '/blog' }, { label: 'About', href: '#about' }, { label: 'Contact', href: '#contact' }] },
        { title: 'Elsewhere', links: [{ label: 'Twitter', href: '#', external: true }, { label: 'Medium', href: '#', external: true }, { label: 'GitHub', href: '#', external: true }] },
      ],
      copyright: '© 2026 Alex Writes.',
      socialLinks: [{ icon: '𝕏', url: '#' }, { icon: '✍️', url: '#' }],
    },
    seo: { title: 'Alex Writes — Personal Blog', description: 'Personal reflections on life, creativity, technology, and the pursuit of meaningful work. A journal by Alex.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'centered',
          heroConfig: { headline: 'Hi, I\'m Alex', description: 'I write about life, creativity, and building things on the internet. Welcome to my corner of the web.', primaryCta: { label: 'Read the Blog', href: '/blog' }, alignment: 'center', minHeight: '50vh' },
          background: { type: 'color', value: '#f5f3ff' },
        },
        {
          id: 'about', type: 'content', anchor: 'about',
          contentConfig: { headline: 'About Me', body: '<p>I\'m a designer and writer based in Portland. By day I work on product design at a startup; by night I write about the things I learn along the way.</p><p>This blog is my public notebook — a place to think out loud about design, technology, creativity, and the messy process of figuring things out.</p>', image: 'https://placehold.co/400x400/7c3aed/ffffff?text=Alex', imagePosition: 'left', bodyFormat: 'html' },
        },
        {
          id: 'contact', type: 'cta', anchor: 'contact',
          ctaConfig: { headline: 'Let\'s connect', description: 'Have a question, idea, or just want to say hello? I\'d love to hear from you.', primaryCta: { label: 'Email Me', href: 'mailto:hello@alexwrites.com' }, variant: 'centered' },
          background: { type: 'color', value: '#7c3aed' },
        },
      ],
    },
    {
      id: 'blog', segment: 'blog', title: 'Blog', content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'posts', layout: 'list', columns: 2, showCategories: false, showSearch: true, showPagination: true, pageSize: 10, postSegment: 'blog',
        cardFields: { title: 'title', excerpt: 'excerpt', date: 'publishedAt', author: 'author', slug: 'slug' },
      },
    },
  ],
};

// ─── Template: Blog Food ────────────────────────────────────────

const TEMPLATE_BLOG_FOOD: AppConfig = {
  id: 'blog-food',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'The Saffron Table',
    subtitle: 'Recipes, stories, and the joy of cooking',
    homeSegment: 'home',
    primaryColor: '#d97706',
  },
  landingConfig: {
    navbar: {
      title: 'The Saffron Table',
      links: [
        { label: 'Recipes', href: '/recipes' },
        { label: 'About', href: '#' },
        { label: 'Newsletter', href: '#cta' },
      ],
      ctaButton: { label: 'Subscribe', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Categories', links: [{ label: 'Quick Meals', href: '#' }, { label: 'Baking', href: '#' }, { label: 'Vegetarian', href: '#' }, { label: 'Seasonal', href: '#' }] },
        { title: 'Connect', links: [{ label: 'Instagram', href: '#', external: true }, { label: 'Pinterest', href: '#', external: true }, { label: 'YouTube', href: '#', external: true }] },
      ],
      copyright: '© 2026 The Saffron Table. All rights reserved.',
      socialLinks: [{ icon: '📸', url: '#' }, { icon: '📌', url: '#' }, { icon: '📺', url: '#' }],
    },
    seo: { title: 'The Saffron Table — Recipes, Stories, and the Joy of Cooking', description: 'A food blog with tested recipes, cooking tips, and stories from the kitchen. Simple, seasonal, and full of flavor.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'split',
          heroConfig: { headline: 'Simple recipes, big flavors', description: 'Tested recipes for busy weeknights, lazy weekends, and everything in between. Real food, no fuss.', image: 'https://placehold.co/700x500/d97706/ffffff?text=Fresh+Cooking', primaryCta: { label: 'Browse Recipes', href: '/recipes' }, alignment: 'left', minHeight: '70vh' },
          background: { type: 'color', value: '#fffbeb' },
        },
        {
          id: 'gallery', type: 'gallery',
          galleryConfig: { headline: 'From the Kitchen', images: [
            { src: 'https://placehold.co/400x400/fbbf24/ffffff?text=Pasta', alt: 'Pasta' },
            { src: 'https://placehold.co/400x400/f59e0b/ffffff?text=Bread', alt: 'Bread' },
            { src: 'https://placehold.co/400x400/d97706/ffffff?text=Salad', alt: 'Salad' },
            { src: 'https://placehold.co/400x400/b45309/ffffff?text=Dessert', alt: 'Dessert' },
          ], columns: 4 },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Get recipes in your inbox', description: 'New recipes every week plus seasonal meal planning tips. Join 8,000+ home cooks.', primaryCta: { label: 'Subscribe Free', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#d97706' },
        },
      ],
    },
    {
      id: 'recipes', segment: 'recipes', title: 'Recipes', content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'posts', layout: 'grid', columns: 3, showCategories: true, showSearch: true, showPagination: true, pageSize: 12, postSegment: 'recipes',
        cardFields: { title: 'title', excerpt: 'excerpt', image: 'coverImage', date: 'publishedAt', author: 'author', category: 'category', slug: 'slug' },
      },
    },
  ],
};

// ─── Template: Blog Travel ──────────────────────────────────────

const TEMPLATE_BLOG_TRAVEL: AppConfig = {
  id: 'blog-travel',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'Wayfarer',
    subtitle: 'Stories from the road less traveled',
    homeSegment: 'home',
    primaryColor: '#0d9488',
  },
  landingConfig: {
    navbar: {
      title: 'Wayfarer',
      links: [
        { label: 'Stories', href: '/stories' },
        { label: 'Destinations', href: '#' },
        { label: 'About', href: '#' },
      ],
      ctaButton: { label: 'Subscribe', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Destinations', links: [{ label: 'Asia', href: '#' }, { label: 'Europe', href: '#' }, { label: 'Americas', href: '#' }, { label: 'Africa', href: '#' }] },
        { title: 'Follow', links: [{ label: 'Instagram', href: '#', external: true }, { label: 'YouTube', href: '#', external: true }, { label: 'Newsletter', href: '#cta' }] },
      ],
      copyright: '© 2026 Wayfarer. All rights reserved.',
      socialLinks: [{ icon: '📸', url: '#' }, { icon: '📺', url: '#' }, { icon: '🌍', url: '#' }],
    },
    seo: { title: 'Wayfarer — Stories from the Road Less Traveled', description: 'A travel blog with immersive stories, destination guides, and photography from around the world.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'fullscreen',
          heroConfig: { headline: 'Explore the world, one story at a time', description: 'Travel guides, photo essays, and honest stories from 50+ countries. Adventure starts here.', image: 'https://placehold.co/1920x1080/0d9488/ffffff?text=Explore+the+World', primaryCta: { label: 'Read Stories', href: '/stories' }, secondaryCta: { label: 'Subscribe', href: '#cta' }, alignment: 'center', minHeight: '100vh' },
          background: { type: 'image', value: 'https://placehold.co/1920x1080/0d9488/ffffff?text=Travel+Hero', overlay: 'rgba(0,0,0,0.4)' },
        },
        {
          id: 'stats', type: 'stats',
          statsConfig: { headline: 'The Journey So Far', items: [
            { value: '52', label: 'Countries Visited' },
            { value: '340+', label: 'Stories Published' },
            { value: '180K', label: 'Monthly Readers' },
            { value: '6', label: 'Continents' },
          ] },
        },
        {
          id: 'gallery', type: 'gallery',
          galleryConfig: { headline: 'Recent Adventures', images: [
            { src: 'https://placehold.co/500x400/0d9488/ffffff?text=Kyoto', alt: 'Kyoto, Japan' },
            { src: 'https://placehold.co/500x400/14b8a6/ffffff?text=Patagonia', alt: 'Patagonia' },
            { src: 'https://placehold.co/500x400/2dd4bf/ffffff?text=Morocco', alt: 'Morocco' },
          ], columns: 3 },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Get travel stories in your inbox', description: 'New stories, destination guides, and photography every Friday.', primaryCta: { label: 'Subscribe Free', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#0d9488' },
        },
      ],
    },
    {
      id: 'stories', segment: 'stories', title: 'Stories', content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'posts', layout: 'magazine', columns: 3, showCategories: true, showSearch: true, showPagination: true, pageSize: 12, postSegment: 'stories',
        cardFields: { title: 'title', excerpt: 'excerpt', image: 'coverImage', date: 'publishedAt', author: 'author', category: 'category', slug: 'slug' },
      },
    },
  ],
};

// ─── Template: Blog Photography ─────────────────────────────────

const TEMPLATE_BLOG_PHOTOGRAPHY: AppConfig = {
  id: 'blog-photography',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'Aperture',
    subtitle: 'Through the lens',
    homeSegment: 'home',
    primaryColor: '#a3a3a3',
  },
  landingConfig: {
    navbar: {
      title: 'Aperture',
      links: [
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'Journal', href: '#' },
        { label: 'About', href: '#' },
      ],
      ctaButton: { label: 'Contact', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Galleries', links: [{ label: 'Street', href: '#' }, { label: 'Landscape', href: '#' }, { label: 'Portrait', href: '#' }, { label: 'Abstract', href: '#' }] },
        { title: 'Connect', links: [{ label: 'Instagram', href: '#', external: true }, { label: '500px', href: '#', external: true }, { label: 'Contact', href: '#cta' }] },
      ],
      copyright: '© 2026 Aperture. All rights reserved.',
      socialLinks: [{ icon: '📸', url: '#' }, { icon: '📷', url: '#' }],
    },
    seo: { title: 'Aperture — Through the Lens', description: 'A photography blog showcasing street, landscape, and portrait photography with stories behind each image.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'centered',
          heroConfig: { headline: 'Every frame tells a story', description: 'Photography journal exploring light, shadow, and the moments in between.', primaryCta: { label: 'View Portfolio', href: '/portfolio' }, alignment: 'center', minHeight: '50vh' },
          background: { type: 'gradient', value: 'linear-gradient(135deg, #171717 0%, #262626 100%)' },
        },
        {
          id: 'gallery', type: 'gallery',
          galleryConfig: { headline: 'Selected Works', images: [
            { src: 'https://placehold.co/800x600/404040/ffffff?text=Street+Photography', alt: 'Street Photography' },
            { src: 'https://placehold.co/800x600/525252/ffffff?text=Golden+Hour', alt: 'Golden Hour' },
            { src: 'https://placehold.co/800x600/737373/ffffff?text=Urban+Lines', alt: 'Urban Lines' },
            { src: 'https://placehold.co/800x600/404040/ffffff?text=Misty+Mountains', alt: 'Misty Mountains' },
            { src: 'https://placehold.co/800x600/525252/ffffff?text=Night+City', alt: 'Night City' },
            { src: 'https://placehold.co/800x600/737373/ffffff?text=Portraits', alt: 'Portraits' },
          ], columns: 3 },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Work with me', description: 'Available for commercial, editorial, and portrait photography. Let\'s create something together.', primaryCta: { label: 'Get in Touch', href: 'mailto:hello@aperture.photo' }, variant: 'centered' },
          background: { type: 'color', value: '#262626' },
        },
      ],
    },
    {
      id: 'portfolio', segment: 'portfolio', title: 'Portfolio', content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'posts', layout: 'grid', columns: 2, showCategories: true, showSearch: false, showPagination: true, pageSize: 8, postSegment: 'portfolio',
        cardFields: { title: 'title', excerpt: 'excerpt', image: 'coverImage', date: 'publishedAt', category: 'category', slug: 'slug' },
      },
    },
  ],
};

// ─── Template: Blog Podcast ─────────────────────────────────────

const TEMPLATE_BLOG_PODCAST: AppConfig = {
  id: 'blog-podcast',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'SoundWave',
    subtitle: 'Conversations that matter',
    homeSegment: 'home',
    primaryColor: '#ea580c',
  },
  landingConfig: {
    navbar: {
      title: 'SoundWave',
      links: [
        { label: 'Episodes', href: '/episodes' },
        { label: 'About', href: '#' },
        { label: 'Subscribe', href: '#cta' },
      ],
      ctaButton: { label: 'Listen Now', href: '/episodes' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Listen On', links: [{ label: 'Apple Podcasts', href: '#', external: true }, { label: 'Spotify', href: '#', external: true }, { label: 'Google Podcasts', href: '#', external: true }, { label: 'RSS Feed', href: '#', external: true }] },
        { title: 'About', links: [{ label: 'Host', href: '#' }, { label: 'Sponsors', href: '#' }, { label: 'Contact', href: '#' }] },
      ],
      copyright: '© 2026 SoundWave Podcast. All rights reserved.',
      socialLinks: [{ icon: '🎧', url: '#' }, { icon: '𝕏', url: '#' }, { icon: '📺', url: '#' }],
    },
    seo: { title: 'SoundWave — Conversations That Matter', description: 'A weekly podcast featuring in-depth conversations with founders, creators, and thinkers shaping the future.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'centered',
          heroConfig: { subheadline: 'A Weekly Podcast', headline: 'Conversations that move ideas forward', description: 'In-depth interviews with founders, creators, and thinkers. New episodes every Wednesday.', primaryCta: { label: 'Latest Episode', href: '/episodes' }, secondaryCta: { label: 'Subscribe on Spotify', href: '#' }, alignment: 'center', minHeight: '65vh' },
          background: { type: 'gradient', value: 'linear-gradient(135deg, #431407 0%, #7c2d12 100%)' },
        },
        {
          id: 'features', type: 'features',
          featuresConfig: {
            headline: 'Recent Episodes', subtitle: 'Catch up on the latest conversations.',
            items: [
              { icon: '🎙️', title: 'Ep. 142: The Future of Remote Work', description: 'Sarah Chen, CEO of DistributedCo, on building culture without an office.' },
              { icon: '🎙️', title: 'Ep. 141: Design Systems at Scale', description: 'Marco Rivera on how Figma changed how we think about design collaboration.' },
              { icon: '🎙️', title: 'Ep. 140: From Side Project to IPO', description: 'Lisa Park shares the 8-year journey from weekend hack to public company.' },
            ],
          },
        },
        {
          id: 'stats', type: 'stats',
          statsConfig: { items: [
            { value: '142', label: 'Episodes' },
            { value: '2M+', label: 'Total Downloads' },
            { value: '4.8', label: 'Apple Rating' },
            { value: '50K', label: 'Subscribers' },
          ] },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Never miss an episode', description: 'Subscribe on your favorite platform and get notified when new episodes drop.', primaryCta: { label: 'Subscribe Now', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#ea580c' },
        },
      ],
    },
    {
      id: 'episodes', segment: 'episodes', title: 'Episodes', content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'posts', layout: 'grid', columns: 3, showCategories: true, showSearch: true, showPagination: true, pageSize: 12, postSegment: 'episodes',
        cardFields: { title: 'title', excerpt: 'excerpt', image: 'coverImage', date: 'publishedAt', author: 'author', category: 'category', slug: 'slug' },
      },
    },
  ],
};

// ─── Template: Blog Review ──────────────────────────────────────

const TEMPLATE_BLOG_REVIEW: AppConfig = {
  id: 'blog-review',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'GearCheck',
    subtitle: 'Honest reviews for smart buyers',
    homeSegment: 'home',
    primaryColor: '#2563eb',
  },
  landingConfig: {
    navbar: {
      title: 'GearCheck',
      links: [
        { label: 'Reviews', href: '/reviews' },
        { label: 'Categories', href: '#categories' },
        { label: 'About', href: '#' },
      ],
      ctaButton: { label: 'Subscribe', href: '#cta' },
      sticky: true,
      transparent: false,
    },
    footer: {
      columns: [
        { title: 'Categories', links: [{ label: 'Laptops', href: '#' }, { label: 'Phones', href: '#' }, { label: 'Audio', href: '#' }, { label: 'Smart Home', href: '#' }] },
        { title: 'About', links: [{ label: 'Our Testing', href: '#' }, { label: 'Editorial Policy', href: '#' }, { label: 'Contact', href: '#' }] },
      ],
      copyright: '© 2026 GearCheck. All rights reserved.',
      socialLinks: [{ icon: '📺', url: '#' }, { icon: '𝕏', url: '#' }],
    },
    seo: { title: 'GearCheck — Honest Reviews for Smart Buyers', description: 'In-depth product reviews with real testing data. No sponsored content, no bias — just honest assessments to help you buy smarter.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'centered',
          heroConfig: { headline: 'Reviews you can trust', description: 'We test every product ourselves. No sponsored reviews, no affiliate bias. Just honest, data-driven assessments.', primaryCta: { label: 'Read Reviews', href: '/reviews' }, alignment: 'center', minHeight: '55vh' },
          background: { type: 'color', value: '#eff6ff' },
        },
        {
          id: 'categories', type: 'features', anchor: 'categories',
          featuresConfig: {
            headline: 'What We Review', subtitle: 'Our areas of expertise.',
            items: [
              { icon: '💻', title: 'Laptops & PCs', description: 'Performance benchmarks, build quality, and real-world usage tests.' },
              { icon: '📱', title: 'Smartphones', description: 'Camera comparisons, battery life, and daily driver potential.' },
              { icon: '🎧', title: 'Audio', description: 'Headphones, speakers, and microphones tested with calibrated equipment.' },
              { icon: '🏠', title: 'Smart Home', description: 'Reliability, ecosystem compatibility, and privacy analysis.' },
            ],
          },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Get review alerts', description: 'Be the first to read our latest reviews. No spam, just gear.', primaryCta: { label: 'Subscribe Free', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#2563eb' },
        },
      ],
    },
    {
      id: 'reviews', segment: 'reviews', title: 'Reviews', content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'posts', layout: 'grid', columns: 3, showCategories: true, showSearch: true, showPagination: true, pageSize: 12, postSegment: 'reviews',
        cardFields: { title: 'title', excerpt: 'excerpt', image: 'coverImage', date: 'publishedAt', author: 'author', category: 'category', slug: 'slug' },
      },
    },
  ],
};

// ─── Template: Blog Tutorial ────────────────────────────────────

const TEMPLATE_BLOG_TUTORIAL: AppConfig = {
  id: 'blog-tutorial',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'CodePath',
    subtitle: 'Learn to build, step by step',
    homeSegment: 'home',
    primaryColor: '#16a34a',
  },
  landingConfig: {
    navbar: {
      title: 'CodePath',
      links: [
        { label: 'Tutorials', href: '/tutorials' },
        { label: 'Courses', href: '#courses' },
        { label: 'About', href: '#' },
      ],
      ctaButton: { label: 'Start Learning', href: '/tutorials' },
      sticky: true,
      transparent: false,
    },
    footer: {
      columns: [
        { title: 'Topics', links: [{ label: 'React', href: '#' }, { label: 'TypeScript', href: '#' }, { label: 'Node.js', href: '#' }, { label: 'Python', href: '#' }] },
        { title: 'Resources', links: [{ label: 'GitHub', href: '#', external: true }, { label: 'Discord', href: '#', external: true }, { label: 'Newsletter', href: '#' }] },
      ],
      copyright: '© 2026 CodePath. All rights reserved.',
      socialLinks: [{ icon: '🐙', url: '#' }, { icon: '💬', url: '#' }, { icon: '📺', url: '#' }],
    },
    seo: { title: 'CodePath — Learn to Build, Step by Step', description: 'Free programming tutorials with real-world projects. From beginner to advanced, learn at your own pace.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'centered',
          heroConfig: { headline: 'Master modern development', description: 'Free, project-based tutorials that teach you to build real applications. Written by senior engineers at top companies.', primaryCta: { label: 'Browse Tutorials', href: '/tutorials' }, secondaryCta: { label: 'Join Discord', href: '#' }, alignment: 'center', minHeight: '55vh' },
          background: { type: 'color', value: '#f0fdf4' },
        },
        {
          id: 'courses', type: 'features', anchor: 'courses',
          featuresConfig: {
            headline: 'Learning Paths', subtitle: 'Structured courses to take you from zero to production.',
            items: [
              { icon: '⚛️', title: 'Full-Stack React', description: 'Build a complete SaaS app with React, Next.js, and Prisma. 24 lessons.' },
              { icon: '🐍', title: 'Python for Data', description: 'Data analysis, visualization, and machine learning fundamentals. 18 lessons.' },
              { icon: '🔧', title: 'DevOps Essentials', description: 'Docker, CI/CD, cloud deployment, and monitoring. 16 lessons.' },
              { icon: '📱', title: 'Mobile with React Native', description: 'Cross-platform mobile apps with Expo and React Native. 20 lessons.' },
            ],
          },
        },
        {
          id: 'stats', type: 'stats',
          statsConfig: { items: [
            { value: '200+', label: 'Tutorials' },
            { value: '45K', label: 'Students' },
            { value: '12', label: 'Learning Paths' },
            { value: '4.9', label: 'Avg Rating' },
          ] },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Start learning today', description: 'All tutorials are free. No signup required to start reading.', primaryCta: { label: 'Browse Tutorials', href: '/tutorials' }, variant: 'centered' },
          background: { type: 'color', value: '#16a34a' },
        },
      ],
    },
    {
      id: 'tutorials', segment: 'tutorials', title: 'Tutorials', content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'posts', layout: 'grid', columns: 3, showCategories: true, showSearch: true, showPagination: true, pageSize: 12, postSegment: 'tutorials',
        cardFields: { title: 'title', excerpt: 'excerpt', image: 'coverImage', date: 'publishedAt', author: 'author', category: 'category', slug: 'slug' },
      },
    },
  ],
};

// ─── Template: Blog Newsletter ──────────────────────────────────

const TEMPLATE_BLOG_NEWSLETTER: AppConfig = {
  id: 'blog-newsletter',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'The Signal',
    subtitle: 'Cutting through the noise',
    homeSegment: 'home',
    primaryColor: '#0f172a',
  },
  landingConfig: {
    navbar: {
      title: 'The Signal',
      links: [
        { label: 'Archive', href: '/archive' },
        { label: 'About', href: '#about' },
        { label: 'Testimonials', href: '#testimonials' },
      ],
      ctaButton: { label: 'Subscribe Free', href: '#cta' },
      sticky: true,
      transparent: false,
    },
    footer: {
      columns: [
        { title: 'Newsletter', links: [{ label: 'Latest Issue', href: '#' }, { label: 'Archive', href: '/archive' }, { label: 'About', href: '#about' }] },
        { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }, { label: 'Unsubscribe', href: '#' }] },
      ],
      copyright: '© 2026 The Signal. All rights reserved.',
      socialLinks: [{ icon: '𝕏', url: '#' }, { icon: '💼', url: '#' }],
    },
    seo: { title: 'The Signal — Cutting Through the Noise', description: 'A weekly newsletter that distills the most important trends in tech, business, and culture into a 5-minute read.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'cta-hero', type: 'hero', variant: 'centered',
          heroConfig: { headline: 'The weekly newsletter for busy professionals', subheadline: 'Free Newsletter', description: 'Every Monday, we distill the most important trends in technology, business, and culture into a crisp 5-minute read. Trusted by 35,000+ subscribers.', primaryCta: { label: 'Subscribe — It\'s Free', href: '#cta' }, alignment: 'center', minHeight: '70vh' },
          background: { type: 'gradient', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
        },
        {
          id: 'about', type: 'content', anchor: 'about',
          contentConfig: { headline: 'Why The Signal?', body: '<p>In a world drowning in information, The Signal is your filter. We read hundreds of articles, reports, and papers each week so you don\'t have to.</p><p>Our editorial team curates and contextualizes the stories that actually matter for your career, your investments, and your understanding of the world.</p>', imagePosition: 'right', bodyFormat: 'html' },
        },
        {
          id: 'testimonials', type: 'testimonials', anchor: 'testimonials',
          testimonialsConfig: {
            headline: 'What readers say',
            items: [
              { quote: 'The Signal is the only newsletter I read start to finish every week. It\'s become essential to how I stay informed.', name: 'Jamie Chen', title: 'VP Product, TechCo' },
              { quote: 'Concise, insightful, and always relevant. This is what newsletters should be.', name: 'Marcus Wright', title: 'Founder, StartupXYZ' },
              { quote: 'I\'ve tried dozens of newsletters. The Signal is the one that stuck.', name: 'Priya Sharma', title: 'Investor, Capital Partners' },
            ],
          },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Join 35,000+ readers', description: 'Free. Weekly. No spam. Unsubscribe anytime.', primaryCta: { label: 'Subscribe Free', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#0f172a' },
        },
      ],
    },
    {
      id: 'archive', segment: 'archive', title: 'Archive', content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'posts', layout: 'list', columns: 2, showCategories: false, showSearch: true, showPagination: true, pageSize: 15, postSegment: 'archive',
        cardFields: { title: 'title', excerpt: 'excerpt', date: 'publishedAt', author: 'author', slug: 'slug' },
      },
    },
  ],
};

// ─── Template: Blog Corporate ───────────────────────────────────

const TEMPLATE_BLOG_CORPORATE: AppConfig = {
  id: 'blog-corporate',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'Nexus Insights',
    subtitle: 'Industry knowledge from Nexus Group',
    homeSegment: 'home',
    primaryColor: '#1e40af',
  },
  landingConfig: {
    navbar: {
      title: 'Nexus Insights',
      links: [
        { label: 'Articles', href: '/articles' },
        { label: 'Team', href: '#team' },
        { label: 'Partners', href: '#partners' },
      ],
      ctaButton: { label: 'Subscribe', href: '#cta' },
      sticky: true,
      transparent: false,
    },
    footer: {
      columns: [
        { title: 'Topics', links: [{ label: 'Industry Trends', href: '#' }, { label: 'Leadership', href: '#' }, { label: 'Innovation', href: '#' }, { label: 'Sustainability', href: '#' }] },
        { title: 'Nexus Group', links: [{ label: 'About Us', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Contact', href: '#' }] },
        { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }] },
      ],
      copyright: '© 2026 Nexus Group, Inc. All rights reserved.',
      socialLinks: [{ icon: '💼', url: '#' }, { icon: '𝕏', url: '#' }],
    },
    seo: { title: 'Nexus Insights — Industry Knowledge from Nexus Group', description: 'Expert analysis and thought leadership on industry trends, digital transformation, and corporate innovation.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'centered',
          heroConfig: { headline: 'Insights that drive decisions', subheadline: 'Nexus Insights', description: 'Expert analysis on digital transformation, industry trends, and corporate strategy from the Nexus Group leadership team.', primaryCta: { label: 'Read Latest', href: '/articles' }, alignment: 'center', minHeight: '55vh' },
          background: { type: 'color', value: '#eff6ff' },
        },
        {
          id: 'partners', type: 'logos', anchor: 'partners', padding: 'sm',
          logosConfig: { headline: 'Trusted by industry leaders', logos: [
            { src: '', alt: 'Deloitte' }, { src: '', alt: 'McKinsey' }, { src: '', alt: 'Accenture' }, { src: '', alt: 'BCG' }, { src: '', alt: 'Bain' },
          ], grayscale: true },
        },
        {
          id: 'team', type: 'team', anchor: 'team',
          teamConfig: {
            headline: 'Our Contributors',
            members: [
              { name: 'Katherine Park', role: 'CEO', avatar: 'https://placehold.co/200x200/1e40af/ffffff?text=KP' },
              { name: 'David Chen', role: 'CTO', avatar: 'https://placehold.co/200x200/1e40af/ffffff?text=DC' },
              { name: 'Maria Santos', role: 'VP Strategy', avatar: 'https://placehold.co/200x200/1e40af/ffffff?text=MS' },
              { name: 'James Wilson', role: 'Head of Innovation', avatar: 'https://placehold.co/200x200/1e40af/ffffff?text=JW' },
            ],
          },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Get insights delivered', description: 'Monthly thought leadership from our executive team. For decision-makers.', primaryCta: { label: 'Subscribe', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#1e40af' },
        },
      ],
    },
    {
      id: 'articles', segment: 'articles', title: 'Articles', content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'posts', layout: 'grid', columns: 3, showCategories: true, showSearch: true, showPagination: true, pageSize: 12, postSegment: 'articles',
        cardFields: { title: 'title', excerpt: 'excerpt', image: 'coverImage', date: 'publishedAt', author: 'author', category: 'category', slug: 'slug' },
      },
    },
  ],
};

// ─── Template: Blog Multilang ───────────────────────────────────

const TEMPLATE_BLOG_MULTILANG: AppConfig = {
  id: 'blog-multilang',
  version: '1.0.0',
  appMode: 'blog',
  branding: {
    title: 'Polyglot',
    subtitle: 'One world, many voices',
    homeSegment: 'home',
    primaryColor: '#9333ea',
  },
  landingConfig: {
    navbar: {
      title: 'Polyglot',
      links: [
        { label: 'Articles', href: '/articles' },
        { label: 'Topics', href: '#topics' },
        { label: 'FAQ', href: '#faq' },
      ],
      ctaButton: { label: 'EN | ES | FR', href: '#' },
      sticky: true,
      transparent: false,
    },
    footer: {
      columns: [
        { title: 'Explore', links: [{ label: 'Articles', href: '/articles' }, { label: 'Topics', href: '#topics' }, { label: 'About', href: '#' }] },
        { title: 'Languages', links: [{ label: 'English', href: '#' }, { label: 'Espanol', href: '#' }, { label: 'Francais', href: '#' }, { label: 'Deutsch', href: '#' }] },
      ],
      copyright: '© 2026 Polyglot. All rights reserved.',
      socialLinks: [{ icon: '🌍', url: '#' }, { icon: '𝕏', url: '#' }],
    },
    seo: { title: 'Polyglot — One World, Many Voices', description: 'A multilingual blog exploring culture, language, and global perspectives. Available in English, Spanish, French, and German.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'centered',
          heroConfig: { headline: 'Stories without borders', description: 'Read articles in your language. Culture, travel, and global perspectives from writers around the world.', primaryCta: { label: 'Start Reading', href: '/articles' }, secondaryCta: { label: 'Choose Language', href: '#' }, alignment: 'center', minHeight: '60vh' },
          background: { type: 'gradient', value: 'linear-gradient(135deg, #581c87 0%, #7e22ce 100%)' },
        },
        {
          id: 'topics', type: 'features', anchor: 'topics',
          featuresConfig: {
            headline: 'What We Write About', subtitle: 'Global perspectives on the topics that connect us.',
            items: [
              { icon: '🌍', title: 'Culture', description: 'Art, music, film, and traditions from every corner of the globe.' },
              { icon: '✈️', title: 'Travel', description: 'Destination guides and stories from local voices, not tourists.' },
              { icon: '🗣️', title: 'Language', description: 'Linguistics, language learning tips, and the beauty of multilingualism.' },
              { icon: '📖', title: 'Literature', description: 'Book reviews and essays on translated works and world literature.' },
            ],
          },
        },
        {
          id: 'faq', type: 'faq', anchor: 'faq',
          faqConfig: {
            headline: 'Frequently Asked Questions',
            items: [
              { question: 'What languages are available?', answer: 'Currently English, Spanish, French, and German. We are adding Portuguese and Japanese soon.' },
              { question: 'Can I contribute?', answer: 'Yes! We welcome submissions in any of our supported languages. Contact us for contributor guidelines.' },
              { question: 'Is it free?', answer: 'Absolutely. All content is free to read. We are supported by our community of donors.' },
            ],
          },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Read the world', description: 'Weekly articles from global writers, in the language you choose.', primaryCta: { label: 'Subscribe Free', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#9333ea' },
        },
      ],
    },
    {
      id: 'articles', segment: 'articles', title: 'Articles', content: 'blog-list',
      blogListConfig: {
        dataSourceId: 'posts', layout: 'grid', columns: 3, showCategories: true, showSearch: true, showPagination: true, pageSize: 12, postSegment: 'articles',
        cardFields: { title: 'title', excerpt: 'excerpt', image: 'coverImage', date: 'publishedAt', author: 'author', category: 'category', slug: 'slug' },
      },
    },
  ],
};

// ─── Template: Agency Creative ──────────────────────────────────

const TEMPLATE_AGENCY_CREATIVE: AppConfig = {
  id: 'agency-creative',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'Flynt Studio',
    subtitle: 'We make brands unforgettable',
    homeSegment: 'home',
    primaryColor: '#e11d48',
  },
  landingConfig: {
    navbar: {
      title: 'Flynt Studio',
      links: [
        { label: 'Work', href: '#gallery' },
        { label: 'Services', href: '#services' },
        { label: 'Team', href: '#team' },
        { label: 'Contact', href: '#contact' },
      ],
      ctaButton: { label: 'Start a Project', href: '#contact' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Services', links: [{ label: 'Branding', href: '#' }, { label: 'Web Design', href: '#' }, { label: 'Video Production', href: '#' }, { label: 'Strategy', href: '#' }] },
        { title: 'Studio', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Contact', href: '#contact' }] },
      ],
      copyright: '© 2026 Flynt Studio. All rights reserved.',
      socialLinks: [{ icon: '📸', url: '#' }, { icon: '🎬', url: '#' }, { icon: '💼', url: '#' }],
    },
    seo: { title: 'Flynt Studio — We Make Brands Unforgettable', description: 'Award-winning creative agency specializing in branding, web design, and video production for ambitious brands.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'fullscreen',
          heroConfig: { headline: 'We make brands people remember', description: 'Award-winning creative agency specializing in brand strategy, visual identity, and digital experiences.', primaryCta: { label: 'See Our Work', href: '#gallery' }, secondaryCta: { label: 'Start a Project', href: '#contact' }, alignment: 'center', minHeight: '100vh' },
          background: { type: 'image', value: 'https://placehold.co/1920x1080/e11d48/ffffff?text=Showreel', overlay: 'rgba(0,0,0,0.5)' },
        },
        {
          id: 'gallery', type: 'gallery', anchor: 'gallery',
          galleryConfig: { headline: 'Selected Work', images: [
            { src: 'https://placehold.co/600x450/e11d48/ffffff?text=Brand+Redesign', alt: 'Brand Redesign — Nova' },
            { src: 'https://placehold.co/600x450/be123c/ffffff?text=Website+Launch', alt: 'Website — Meridian' },
            { src: 'https://placehold.co/600x450/9f1239/ffffff?text=Campaign', alt: 'Campaign — Pulse' },
            { src: 'https://placehold.co/600x450/881337/ffffff?text=Video+Spot', alt: 'Video — Aether' },
            { src: 'https://placehold.co/600x450/e11d48/ffffff?text=Packaging', alt: 'Packaging — Craft' },
            { src: 'https://placehold.co/600x450/be123c/ffffff?text=Identity', alt: 'Identity — Signal' },
          ], columns: 3 },
        },
        {
          id: 'services', type: 'features', anchor: 'services',
          featuresConfig: {
            headline: 'What We Do', subtitle: 'End-to-end creative services for brands that want to stand out.',
            items: [
              { icon: '🎨', title: 'Brand Strategy', description: 'Positioning, messaging, and visual identity that resonates with your audience.' },
              { icon: '🖥️', title: 'Web & Digital', description: 'Websites, apps, and digital experiences that convert visitors into customers.' },
              { icon: '🎬', title: 'Video & Motion', description: 'Commercials, social content, and motion graphics that tell your story.' },
              { icon: '📦', title: 'Packaging', description: 'Product packaging that stands out on shelves and in unboxing videos.' },
            ],
          },
        },
        {
          id: 'team', type: 'team', anchor: 'team',
          teamConfig: {
            headline: 'The Studio',
            members: [
              { name: 'Elena Voss', role: 'Creative Director', avatar: 'https://placehold.co/200x200/e11d48/ffffff?text=EV' },
              { name: 'Marcus Lin', role: 'Design Lead', avatar: 'https://placehold.co/200x200/e11d48/ffffff?text=ML' },
              { name: 'Ava Torres', role: 'Producer', avatar: 'https://placehold.co/200x200/e11d48/ffffff?text=AT' },
              { name: 'Noah Patel', role: 'Developer', avatar: 'https://placehold.co/200x200/e11d48/ffffff?text=NP' },
            ],
          },
        },
        {
          id: 'testimonials', type: 'testimonials',
          testimonialsConfig: {
            headline: 'Client Love',
            items: [
              { quote: 'Flynt transformed our brand from forgettable to iconic. Our conversion rate doubled within three months.', name: 'Sarah Kim', title: 'CEO, Nova Health' },
              { quote: 'The most talented and responsive creative team we have ever worked with. Period.', name: 'Tom Baker', title: 'CMO, Meridian Tech' },
            ],
          },
        },
        {
          id: 'contact', type: 'contact', anchor: 'contact',
          contactConfig: { headline: 'Start a Project', subtitle: 'Tell us about your brand and goals. We\'ll get back to you within 24 hours.', successMessage: 'Thank you! We\'ll be in touch within 24 hours.' },
        },
      ],
    },
  ],
};

// ─── Template: Agency Digital ───────────────────────────────────

const TEMPLATE_AGENCY_DIGITAL: AppConfig = {
  id: 'agency-digital',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'Orbit Digital',
    subtitle: 'Growth-driven digital marketing',
    homeSegment: 'home',
    primaryColor: '#7c3aed',
  },
  landingConfig: {
    navbar: {
      title: 'Orbit Digital',
      links: [
        { label: 'Services', href: '#services' },
        { label: 'Results', href: '#stats' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Testimonials', href: '#testimonials' },
      ],
      ctaButton: { label: 'Free Audit', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Services', links: [{ label: 'SEO', href: '#' }, { label: 'PPC', href: '#' }, { label: 'Social Media', href: '#' }, { label: 'Content', href: '#' }] },
        { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Case Studies', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Careers', href: '#' }] },
        { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }] },
      ],
      copyright: '© 2026 Orbit Digital. All rights reserved.',
      socialLinks: [{ icon: '💼', url: '#' }, { icon: '𝕏', url: '#' }, { icon: '📸', url: '#' }],
    },
    seo: { title: 'Orbit Digital — Growth-Driven Digital Marketing', description: 'Results-focused digital marketing agency. SEO, PPC, social media, and content marketing that drives real growth.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'split',
          heroConfig: { headline: 'We grow brands that grow businesses', subheadline: 'Digital Marketing Agency', description: 'Data-driven digital marketing that delivers measurable ROI. From SEO to paid media, we help brands scale with confidence.', image: 'https://placehold.co/700x500/7c3aed/ffffff?text=Growth+Dashboard', primaryCta: { label: 'Get a Free Audit', href: '#cta' }, secondaryCta: { label: 'See Results', href: '#stats' }, alignment: 'left', minHeight: '85vh' },
          background: { type: 'gradient', value: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)' },
        },
        {
          id: 'stats', type: 'stats', anchor: 'stats',
          statsConfig: { headline: 'Our Track Record', items: [
            { value: '340%', label: 'Avg ROI Increase' },
            { value: '150+', label: 'Clients Served' },
            { value: '$2.4B', label: 'Revenue Generated' },
            { value: '96%', label: 'Client Retention' },
          ] },
        },
        {
          id: 'services', type: 'features', anchor: 'services',
          featuresConfig: {
            headline: 'Our Services', subtitle: 'Full-stack digital marketing for modern brands.',
            items: [
              { icon: '🔍', title: 'SEO & Content', description: 'Organic growth through strategic content, technical SEO, and link building.' },
              { icon: '📊', title: 'Paid Media', description: 'Google Ads, Meta, LinkedIn — performance campaigns that maximize ROAS.' },
              { icon: '📱', title: 'Social Media', description: 'Community management, content creation, and influencer partnerships.' },
              { icon: '📧', title: 'Email Marketing', description: 'Lifecycle campaigns, automation, and list growth strategies that convert.' },
            ],
          },
        },
        {
          id: 'logos', type: 'logos', padding: 'sm',
          logosConfig: { headline: 'Trusted by growing brands', logos: [
            { src: '', alt: 'ScaleUp' }, { src: '', alt: 'GrowthCo' }, { src: '', alt: 'BrandLab' }, { src: '', alt: 'VelocityHQ' },
          ], grayscale: true },
        },
        {
          id: 'testimonials', type: 'testimonials', anchor: 'testimonials',
          testimonialsConfig: {
            headline: 'What Our Clients Say',
            items: [
              { quote: 'Orbit doubled our organic traffic in 6 months and cut our CPA by 40%. The ROI speaks for itself.', name: 'Rachel Torres', title: 'Head of Marketing, ScaleUp' },
              { quote: 'Finally, an agency that treats our budget like their own. Transparent, data-driven, and relentless.', name: 'Kevin Nguyen', title: 'CEO, GrowthCo' },
            ],
          },
        },
        {
          id: 'pricing', type: 'pricing', anchor: 'pricing',
          pricingConfig: {
            headline: 'Simple, Transparent Pricing',
            plans: [
              { name: 'Starter', price: '$2,500/mo', features: ['SEO audit & strategy', 'Content calendar', 'Monthly reporting', 'Dedicated account manager'], cta: { label: 'Get Started', href: '#cta' } },
              { name: 'Growth', price: '$5,000/mo', features: ['Everything in Starter', 'Paid media management', 'Social media management', 'Bi-weekly strategy calls', 'A/B testing'], cta: { label: 'Get Started', href: '#cta' }, highlighted: true },
              { name: 'Enterprise', price: 'Custom', features: ['Everything in Growth', 'Multi-channel campaigns', 'Dedicated team', 'Custom reporting', 'Priority support'], cta: { label: 'Contact Us', href: '#cta' } },
            ],
          },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Ready to grow?', description: 'Get a free marketing audit and see how we can accelerate your growth.', primaryCta: { label: 'Get Free Audit', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#7c3aed' },
        },
      ],
    },
  ],
};

// ─── Template: SaaS AI ──────────────────────────────────────────

const TEMPLATE_SAAS_AI: AppConfig = {
  id: 'saas-ai',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'NeuralFlow',
    subtitle: 'AI that works for your business',
    homeSegment: 'home',
    primaryColor: '#8b5cf6',
  },
  landingConfig: {
    navbar: {
      title: 'NeuralFlow',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Demo', href: '#video' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'FAQ', href: '#faq' },
      ],
      ctaButton: { label: 'Try Free', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'API Docs', href: '#' }, { label: 'Changelog', href: '#' }] },
        { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Contact', href: '#' }] },
        { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }, { label: 'Security', href: '#' }] },
      ],
      copyright: '© 2026 NeuralFlow, Inc. All rights reserved.',
      socialLinks: [{ icon: '🐙', url: '#' }, { icon: '𝕏', url: '#' }, { icon: '💼', url: '#' }],
    },
    seo: { title: 'NeuralFlow — AI That Works for Your Business', description: 'Enterprise AI platform for automating workflows, analyzing data, and generating insights. No ML expertise required.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'centered',
          heroConfig: { headline: 'Unlock the power of AI — no PhD required', subheadline: 'Enterprise AI Platform', description: 'Automate repetitive tasks, extract insights from unstructured data, and build custom AI workflows in minutes. Trusted by 500+ enterprises.', primaryCta: { label: 'Start Free Trial', href: '#pricing' }, secondaryCta: { label: 'Watch Demo', href: '#video' }, alignment: 'center', minHeight: '85vh' },
          background: { type: 'gradient', value: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)' },
        },
        {
          id: 'features', type: 'features', anchor: 'features',
          featuresConfig: {
            headline: 'AI Capabilities', subtitle: 'From automation to prediction, NeuralFlow does it all.',
            items: [
              { icon: '🤖', title: 'Intelligent Automation', description: 'Automate document processing, data entry, and routine decisions with custom AI agents.' },
              { icon: '📊', title: 'Predictive Analytics', description: 'Forecast revenue, churn, and demand with pre-built ML models tuned to your data.' },
              { icon: '💬', title: 'Natural Language AI', description: 'Deploy custom chatbots, summarize documents, and analyze sentiment at scale.' },
              { icon: '🔗', title: 'API & Integrations', description: 'Connect to 200+ tools via REST API. Salesforce, Slack, Notion, and more.' },
            ],
          },
        },
        {
          id: 'video', type: 'video', anchor: 'video',
          videoConfig: { headline: 'See NeuralFlow in Action', videoUrl: 'https://placehold.co/960x540/8b5cf6/ffffff?text=Product+Demo', poster: 'https://placehold.co/960x540/8b5cf6/ffffff?text=Product+Demo' },
        },
        {
          id: 'stats', type: 'stats',
          statsConfig: { items: [
            { value: '500+', label: 'Enterprise Customers' },
            { value: '10M+', label: 'Tasks Automated Daily' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '40%', label: 'Avg Cost Reduction' },
          ] },
        },
        {
          id: 'pricing', type: 'pricing', anchor: 'pricing',
          pricingConfig: {
            headline: 'Plans for Every Team',
            plans: [
              { name: 'Starter', price: '$49/mo', features: ['5 AI workflows', '10K API calls/mo', 'Email support', 'Community access'], cta: { label: 'Start Free', href: '#' } },
              { name: 'Pro', price: '$199/mo', features: ['Unlimited workflows', '100K API calls/mo', 'Priority support', 'Custom models', 'SSO'], cta: { label: 'Start Free', href: '#' }, highlighted: true },
              { name: 'Enterprise', price: 'Custom', features: ['Unlimited everything', 'Dedicated infrastructure', 'SLA guarantee', 'On-premise option', '24/7 support'], cta: { label: 'Contact Sales', href: '#' } },
            ],
          },
        },
        {
          id: 'faq', type: 'faq', anchor: 'faq',
          faqConfig: {
            headline: 'Frequently Asked Questions',
            items: [
              { question: 'Do I need ML experience?', answer: 'Not at all. NeuralFlow is designed for business users. Our no-code builder lets you create AI workflows without writing a single line of code.' },
              { question: 'Is my data secure?', answer: 'Yes. We are SOC 2 Type II certified, GDPR compliant, and offer end-to-end encryption. Your data never leaves your VPC on Enterprise plans.' },
              { question: 'Can I try it for free?', answer: 'Absolutely. Start with our free Starter plan — no credit card required. Upgrade anytime as you grow.' },
            ],
          },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Start automating with AI today', description: 'Free plan available. No credit card required.', primaryCta: { label: 'Get Started Free', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#8b5cf6' },
        },
      ],
    },
  ],
};

// ─── Template: SaaS DevTools ────────────────────────────────────

const TEMPLATE_SAAS_DEVTOOLS: AppConfig = {
  id: 'saas-devtools',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'ShipKit',
    subtitle: 'Developer tools that just work',
    homeSegment: 'home',
    primaryColor: '#22d3ee',
  },
  landingConfig: {
    navbar: {
      title: 'ShipKit',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Docs', href: '#' },
        { label: 'FAQ', href: '#faq' },
      ],
      ctaButton: { label: 'Start Building', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'Docs', href: '#' }, { label: 'Status', href: '#' }] },
        { title: 'Developers', links: [{ label: 'API Reference', href: '#' }, { label: 'SDKs', href: '#' }, { label: 'GitHub', href: '#', external: true }, { label: 'Discord', href: '#', external: true }] },
        { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }] },
      ],
      copyright: '© 2026 ShipKit. All rights reserved.',
      socialLinks: [{ icon: '🐙', url: '#' }, { icon: '💬', url: '#' }, { icon: '𝕏', url: '#' }],
    },
    seo: { title: 'ShipKit — Developer Tools That Just Work', description: 'The modern developer toolkit: auth, payments, email, analytics — all in one SDK. Ship faster with less boilerplate.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'centered',
          heroConfig: { headline: 'Ship products, not boilerplate', subheadline: '$ npm install @shipkit/core', description: 'Authentication, payments, email, file storage, and analytics — all from one SDK. Focus on your product, we handle the infrastructure.', primaryCta: { label: 'Get Started Free', href: '#pricing' }, secondaryCta: { label: 'Read the Docs', href: '#' }, alignment: 'center', minHeight: '80vh' },
          background: { type: 'gradient', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
        },
        {
          id: 'features', type: 'features', anchor: 'features',
          featuresConfig: {
            headline: 'Everything You Need', subtitle: 'Stop gluing services together. ShipKit does it all.',
            items: [
              { icon: '🔐', title: 'Auth', description: 'Social login, magic links, MFA, and session management. 5 lines of code.' },
              { icon: '💳', title: 'Payments', description: 'Stripe integration with subscriptions, invoicing, and usage billing built in.' },
              { icon: '📧', title: 'Email', description: 'Transactional and marketing email with templates, tracking, and deliverability monitoring.' },
              { icon: '📁', title: 'Storage', description: 'File uploads with CDN, image optimization, and virus scanning. S3-compatible API.' },
              { icon: '📊', title: 'Analytics', description: 'Privacy-first product analytics. Funnels, cohorts, and custom events without cookies.' },
              { icon: '🚀', title: 'Deploy', description: 'One-click deploy to edge. Preview environments for every PR. Zero-config CI/CD.' },
            ],
          },
        },
        {
          id: 'pricing', type: 'pricing', anchor: 'pricing',
          pricingConfig: {
            headline: 'Pricing That Scales With You',
            plans: [
              { name: 'Hobby', price: 'Free', features: ['1,000 MAU', '10K API calls', 'Community support', 'All SDKs'], cta: { label: 'Start Free', href: '#' } },
              { name: 'Pro', price: '$29/mo', features: ['10K MAU', '1M API calls', 'Priority support', 'Custom domain', 'Team collaboration'], cta: { label: 'Start Pro', href: '#' }, highlighted: true },
              { name: 'Scale', price: '$99/mo', features: ['100K MAU', 'Unlimited API calls', '24/7 support', 'SLA', 'SOC 2', 'Custom integrations'], cta: { label: 'Contact Sales', href: '#' } },
            ],
          },
        },
        {
          id: 'faq', type: 'faq', anchor: 'faq',
          faqConfig: {
            headline: 'FAQ',
            items: [
              { question: 'What frameworks do you support?', answer: 'Next.js, Remix, SvelteKit, Nuxt, and Astro. We also have vanilla JS and REST APIs for everything else.' },
              { question: 'Can I self-host?', answer: 'Yes. Our Pro and Scale plans include Docker images for self-hosting. Community edition is open source.' },
              { question: 'How does the free tier work?', answer: 'The Hobby plan is free forever with generous limits. No credit card required. Upgrade when you need more.' },
            ],
          },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Start shipping today', description: 'Free tier available. No credit card required.', primaryCta: { label: 'npm install @shipkit/core', href: '#' }, variant: 'centered' },
          background: { type: 'gradient', value: 'linear-gradient(135deg, #164e63 0%, #155e75 100%)' },
        },
      ],
    },
  ],
};

// ─── Template: SaaS Analytics ───────────────────────────────────

const TEMPLATE_SAAS_ANALYTICS: AppConfig = {
  id: 'saas-analytics',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'InsightBoard',
    subtitle: 'Analytics that tell the whole story',
    homeSegment: 'home',
    primaryColor: '#0891b2',
  },
  landingConfig: {
    navbar: {
      title: 'InsightBoard',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Testimonials', href: '#testimonials' },
      ],
      ctaButton: { label: 'Start Free', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'Integrations', href: '#' }, { label: 'API', href: '#' }] },
        { title: 'Resources', links: [{ label: 'Documentation', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Community', href: '#' }] },
        { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }, { label: 'GDPR', href: '#' }] },
      ],
      copyright: '© 2026 InsightBoard. All rights reserved.',
      socialLinks: [{ icon: '𝕏', url: '#' }, { icon: '💼', url: '#' }],
    },
    seo: { title: 'InsightBoard — Analytics That Tell the Whole Story', description: 'Privacy-first analytics platform with real-time dashboards, funnel analysis, and custom reports. GDPR compliant, cookie-free.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'split',
          heroConfig: { headline: 'Understand your users without compromising their privacy', subheadline: 'Privacy-First Analytics', description: 'Real-time dashboards, funnel analysis, and custom reports — all without cookies or personal data collection. GDPR compliant by design.', image: 'https://placehold.co/700x500/0891b2/ffffff?text=Analytics+Dashboard', primaryCta: { label: 'Start Free Trial', href: '#pricing' }, secondaryCta: { label: 'Live Demo', href: '#' }, alignment: 'left', minHeight: '85vh' },
          background: { type: 'color', value: '#ecfeff' },
        },
        {
          id: 'features', type: 'features', anchor: 'features',
          featuresConfig: {
            headline: 'Powerful Features', subtitle: 'Everything you need to understand your audience.',
            items: [
              { icon: '📈', title: 'Real-Time Dashboard', description: 'See what is happening on your site right now. Live visitor count, active pages, and conversion events.' },
              { icon: '🔄', title: 'Funnel Analysis', description: 'Build multi-step funnels to understand where users drop off and optimize your conversion flow.' },
              { icon: '👥', title: 'Cohort Analysis', description: 'Group users by behavior and track retention, engagement, and revenue over time.' },
              { icon: '🔒', title: 'Privacy First', description: 'No cookies, no personal data. Fully GDPR, CCPA, and PECR compliant out of the box.' },
            ],
          },
        },
        {
          id: 'stats', type: 'stats',
          statsConfig: { items: [
            { value: '10K+', label: 'Websites Tracked' },
            { value: '2B+', label: 'Events/Month' },
            { value: '<1KB', label: 'Script Size' },
            { value: '99.99%', label: 'Uptime' },
          ] },
        },
        {
          id: 'testimonials', type: 'testimonials', anchor: 'testimonials',
          testimonialsConfig: {
            headline: 'Loved by Product Teams',
            items: [
              { quote: 'We ditched Google Analytics for InsightBoard and never looked back. Faster, simpler, and our users appreciate the privacy focus.', name: 'Julia Foster', title: 'Head of Product, SaaSify' },
              { quote: 'The funnel analysis alone paid for our annual subscription within the first month.', name: 'Daniel Kim', title: 'Growth Lead, LaunchPad' },
            ],
          },
        },
        {
          id: 'pricing', type: 'pricing', anchor: 'pricing',
          pricingConfig: {
            headline: 'Simple Pricing',
            plans: [
              { name: 'Free', price: '$0', features: ['10K pageviews/mo', '1 website', '30-day data retention', 'Real-time dashboard'], cta: { label: 'Get Started', href: '#' } },
              { name: 'Pro', price: '$19/mo', features: ['100K pageviews/mo', '10 websites', '1 year retention', 'Funnels & cohorts', 'API access'], cta: { label: 'Start Pro', href: '#' }, highlighted: true },
              { name: 'Business', price: '$49/mo', features: ['1M pageviews/mo', 'Unlimited websites', 'Unlimited retention', 'Custom events', 'Priority support'], cta: { label: 'Start Business', href: '#' } },
            ],
          },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Start understanding your users today', description: 'Free plan available. Setup takes 2 minutes. One line of code.', primaryCta: { label: 'Get Started Free', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#0891b2' },
        },
      ],
    },
  ],
};

// ─── Template: SaaS E-Commerce ──────────────────────────────────

const TEMPLATE_SAAS_ECOMMERCE: AppConfig = {
  id: 'saas-ecommerce',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'CartEngine',
    subtitle: 'The e-commerce platform built to scale',
    homeSegment: 'home',
    primaryColor: '#059669',
  },
  landingConfig: {
    navbar: {
      title: 'CartEngine',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Testimonials', href: '#testimonials' },
        { label: 'FAQ', href: '#faq' },
      ],
      ctaButton: { label: 'Start Selling', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'Themes', href: '#' }, { label: 'Apps', href: '#' }] },
        { title: 'Resources', links: [{ label: 'Help Center', href: '#' }, { label: 'API Docs', href: '#' }, { label: 'Blog', href: '#' }] },
        { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Contact', href: '#' }] },
      ],
      copyright: '© 2026 CartEngine, Inc. All rights reserved.',
      socialLinks: [{ icon: '𝕏', url: '#' }, { icon: '📸', url: '#' }, { icon: '💼', url: '#' }],
    },
    seo: { title: 'CartEngine — The E-Commerce Platform Built to Scale', description: 'Launch your online store in minutes. Beautiful themes, built-in payments, inventory management, and marketing tools.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'split',
          heroConfig: { headline: 'Your online store, live in minutes', subheadline: 'E-Commerce Platform', description: 'Beautiful storefronts, built-in payments, shipping, and marketing tools. Everything you need to sell online and grow your business.', image: 'https://placehold.co/700x500/059669/ffffff?text=Online+Store', primaryCta: { label: 'Start Free Trial', href: '#pricing' }, secondaryCta: { label: 'View Themes', href: '#' }, alignment: 'left', minHeight: '85vh' },
          background: { type: 'color', value: '#ecfdf5' },
        },
        {
          id: 'logos', type: 'logos', padding: 'sm',
          logosConfig: { headline: 'Powering 50,000+ stores worldwide', logos: [
            { src: '', alt: 'AllBirds' }, { src: '', alt: 'Glossier' }, { src: '', alt: 'Warby Parker' }, { src: '', alt: 'Bombas' }, { src: '', alt: 'Away' },
          ], grayscale: true },
        },
        {
          id: 'features', type: 'features', anchor: 'features',
          featuresConfig: {
            headline: 'Everything You Need to Sell', subtitle: 'From storefront to shipping, CartEngine handles it all.',
            items: [
              { icon: '🎨', title: 'Beautiful Themes', description: '50+ professionally designed themes. Mobile-first, fast, and fully customizable.' },
              { icon: '💳', title: 'Built-in Payments', description: 'Accept credit cards, Apple Pay, and local payment methods. No transaction fees.' },
              { icon: '📦', title: 'Inventory & Shipping', description: 'Real-time inventory sync, automated shipping rates, and label printing.' },
              { icon: '📊', title: 'Marketing Tools', description: 'SEO, email campaigns, discount codes, and abandoned cart recovery built in.' },
            ],
          },
        },
        {
          id: 'testimonials', type: 'testimonials', anchor: 'testimonials',
          testimonialsConfig: {
            headline: 'Merchant Success Stories',
            items: [
              { quote: 'We migrated from Shopify to CartEngine and saw a 30% increase in conversion rate. The speed difference is incredible.', name: 'Lisa Chang', title: 'Founder, Bloom Beauty' },
              { quote: 'CartEngine made it possible for us to go from idea to first sale in under a week. The onboarding is flawless.', name: 'Omar Hernandez', title: 'CEO, Artisan Goods Co' },
            ],
          },
        },
        {
          id: 'pricing', type: 'pricing', anchor: 'pricing',
          pricingConfig: {
            headline: 'Plans for Every Stage',
            plans: [
              { name: 'Starter', price: '$29/mo', features: ['Unlimited products', 'Online store', 'Discount codes', 'SSL certificate', 'Email support'], cta: { label: 'Start Free Trial', href: '#' } },
              { name: 'Growth', price: '$79/mo', features: ['Everything in Starter', 'Abandoned cart recovery', 'Gift cards', 'Professional reports', 'Priority support'], cta: { label: 'Start Free Trial', href: '#' }, highlighted: true },
              { name: 'Enterprise', price: '$299/mo', features: ['Everything in Growth', 'Custom checkout', 'API access', 'Advanced analytics', 'Dedicated manager'], cta: { label: 'Contact Sales', href: '#' } },
            ],
          },
        },
        {
          id: 'faq', type: 'faq', anchor: 'faq',
          faqConfig: {
            headline: 'FAQ',
            items: [
              { question: 'Can I migrate from Shopify?', answer: 'Yes. We offer free migration with our Growth and Enterprise plans. Your products, customers, and orders transfer seamlessly.' },
              { question: 'Do you take transaction fees?', answer: 'No transaction fees on any plan when you use CartEngine Payments. Third-party gateways have a small processing fee.' },
              { question: 'Can I use my own domain?', answer: 'Absolutely. Connect your custom domain with one click. Free SSL included on all plans.' },
            ],
          },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Start selling online today', description: '14-day free trial. No credit card required.', primaryCta: { label: 'Start Free Trial', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#059669' },
        },
      ],
    },
  ],
};

// ─── Template: SaaS Fintech ─────────────────────────────────────

const TEMPLATE_SAAS_FINTECH: AppConfig = {
  id: 'saas-fintech',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'VaultPay',
    subtitle: 'Modern financial infrastructure',
    homeSegment: 'home',
    primaryColor: '#0f766e',
  },
  landingConfig: {
    navbar: {
      title: 'VaultPay',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Security', href: '#security' },
        { label: 'Pricing', href: '#pricing' },
      ],
      ctaButton: { label: 'Get API Keys', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Product', links: [{ label: 'Payments', href: '#' }, { label: 'Banking', href: '#' }, { label: 'Compliance', href: '#' }, { label: 'API Docs', href: '#' }] },
        { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Press', href: '#' }, { label: 'Contact', href: '#' }] },
        { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }, { label: 'Compliance', href: '#' }] },
      ],
      copyright: '© 2026 VaultPay, Inc. All rights reserved.',
      socialLinks: [{ icon: '💼', url: '#' }, { icon: '𝕏', url: '#' }],
    },
    seo: { title: 'VaultPay — Modern Financial Infrastructure', description: 'Payment processing, banking-as-a-service, and compliance tools for fintech companies. PCI DSS Level 1 certified.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'centered',
          heroConfig: { headline: 'Financial infrastructure for the internet economy', subheadline: 'VaultPay API', description: 'Payment processing, banking integrations, and regulatory compliance — all through a single, unified API. Built for scale, designed for developers.', primaryCta: { label: 'Get API Keys', href: '#pricing' }, secondaryCta: { label: 'Read Docs', href: '#' }, alignment: 'center', minHeight: '80vh' },
          background: { type: 'gradient', value: 'linear-gradient(135deg, #042f2e 0%, #0f766e 100%)' },
        },
        {
          id: 'stats', type: 'stats',
          statsConfig: { headline: 'Trusted at Scale', items: [
            { value: '$12B+', label: 'Processed Annually' },
            { value: '99.999%', label: 'Uptime' },
            { value: '180+', label: 'Countries Supported' },
            { value: '<50ms', label: 'Avg Latency' },
          ] },
        },
        {
          id: 'features', type: 'features', anchor: 'features',
          featuresConfig: {
            headline: 'Complete Financial Stack', subtitle: 'Everything you need to move money globally.',
            items: [
              { icon: '💳', title: 'Payments', description: 'Accept cards, wallets, and local payment methods in 180+ countries. Real-time settlement.' },
              { icon: '🏦', title: 'Banking', description: 'Issue virtual accounts, manage balances, and move money between accounts instantly.' },
              { icon: '📋', title: 'Compliance', description: 'KYC, AML, and transaction monitoring built in. Stay compliant without the overhead.' },
              { icon: '🔐', title: 'Security', description: 'PCI DSS Level 1 certified. Tokenized payments and fraud detection powered by ML.' },
            ],
          },
        },
        {
          id: 'security', type: 'content', anchor: 'security',
          contentConfig: { headline: 'Enterprise-Grade Security', body: '<p>VaultPay is PCI DSS Level 1 certified — the highest level of payment security certification. All data is encrypted at rest and in transit with AES-256.</p><p>Our ML-powered fraud detection system analyzes every transaction in real-time, blocking fraudulent activity before it impacts your business. SOC 2 Type II audited annually.</p>', image: 'https://placehold.co/500x400/0f766e/ffffff?text=Security+Shield', imagePosition: 'right', bodyFormat: 'html' },
        },
        {
          id: 'pricing', type: 'pricing', anchor: 'pricing',
          pricingConfig: {
            headline: 'Pay-As-You-Go Pricing',
            plans: [
              { name: 'Standard', price: '2.9% + $0.30', features: ['All payment methods', 'Real-time dashboard', 'Email support', 'Basic fraud protection'], cta: { label: 'Get Started', href: '#' } },
              { name: 'Growth', price: '2.5% + $0.25', features: ['Everything in Standard', 'Advanced fraud ML', 'Banking APIs', 'Priority support', 'Custom reporting'], cta: { label: 'Get Started', href: '#' }, highlighted: true },
              { name: 'Enterprise', price: 'Custom', features: ['Volume discounts', 'Dedicated infrastructure', 'Custom integrations', 'SLA guarantee', '24/7 support'], cta: { label: 'Contact Sales', href: '#' } },
            ],
          },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Start processing payments today', description: 'Free sandbox environment. Go live when you are ready.', primaryCta: { label: 'Get API Keys', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#0f766e' },
        },
      ],
    },
  ],
};

// ─── Template: Startup Pitch ────────────────────────────────────

const TEMPLATE_STARTUP_PITCH: AppConfig = {
  id: 'startup-pitch',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'Quantum',
    subtitle: 'The future of work is here',
    homeSegment: 'home',
    primaryColor: '#f59e0b',
  },
  landingConfig: {
    navbar: {
      title: 'Quantum',
      links: [
        { label: 'Traction', href: '#stats' },
        { label: 'Product', href: '#features' },
        { label: 'Team', href: '#team' },
        { label: 'Investors', href: '#testimonials' },
      ],
      ctaButton: { label: 'Request Demo', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Press', href: '#' }, { label: 'Contact', href: '#cta' }] },
        { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }] },
      ],
      copyright: '© 2026 Quantum Technologies, Inc.',
      socialLinks: [{ icon: '𝕏', url: '#' }, { icon: '💼', url: '#' }],
    },
    seo: { title: 'Quantum — The Future of Work Is Here', description: 'AI-powered workspace platform that increases team productivity by 3x. Backed by top-tier VCs.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'centered',
          heroConfig: { headline: 'The AI workspace that replaces 10 tools', subheadline: 'Series A — $18M Raised', description: 'Quantum is the AI-powered workspace platform that increases team productivity by 3x. One tool for docs, tasks, communication, and analytics.', primaryCta: { label: 'Request a Demo', href: '#cta' }, secondaryCta: { label: 'See Traction', href: '#stats' }, alignment: 'center', minHeight: '85vh' },
          background: { type: 'gradient', value: 'linear-gradient(135deg, #78350f 0%, #f59e0b 100%)' },
        },
        {
          id: 'stats', type: 'stats', anchor: 'stats',
          statsConfig: { headline: 'Traction', items: [
            { value: '$4.2M', label: 'ARR' },
            { value: '340%', label: 'YoY Growth' },
            { value: '2,800+', label: 'Teams Using Quantum' },
            { value: '92%', label: 'Net Revenue Retention' },
          ] },
        },
        {
          id: 'features', type: 'features', anchor: 'features',
          featuresConfig: {
            headline: 'Why Quantum Wins', subtitle: 'The value propositions that drive our growth.',
            items: [
              { icon: '🧠', title: 'AI-Native', description: 'Every feature is AI-powered. Smart drafting, auto-prioritization, and predictive analytics built in.' },
              { icon: '⚡', title: '3x Productivity', description: 'Teams using Quantum complete 3x more tasks per week than with traditional tool stacks.' },
              { icon: '🔗', title: 'One Platform', description: 'Replace Slack, Notion, Asana, and Tableau. Everything in one unified workspace.' },
              { icon: '🏢', title: 'Enterprise Ready', description: 'SOC 2, SAML SSO, audit logs, and data residency. Trusted by Fortune 500 companies.' },
            ],
          },
        },
        {
          id: 'team', type: 'team', anchor: 'team',
          teamConfig: {
            headline: 'Leadership Team',
            members: [
              { name: 'Alex Rivera', role: 'CEO (ex-Google)', avatar: 'https://placehold.co/200x200/f59e0b/ffffff?text=AR' },
              { name: 'Priya Mehta', role: 'CTO (ex-Meta)', avatar: 'https://placehold.co/200x200/f59e0b/ffffff?text=PM' },
              { name: 'Jordan Lee', role: 'CPO (ex-Notion)', avatar: 'https://placehold.co/200x200/f59e0b/ffffff?text=JL' },
              { name: 'Sam Nakamura', role: 'VP Sales (ex-Salesforce)', avatar: 'https://placehold.co/200x200/f59e0b/ffffff?text=SN' },
            ],
          },
        },
        {
          id: 'testimonials', type: 'testimonials', anchor: 'testimonials',
          testimonialsConfig: {
            headline: 'Backed by the Best',
            items: [
              { quote: 'Quantum is the most compelling productivity platform we have seen in a decade. The AI integration is not a gimmick — it is the core product.', name: 'Sarah Chen', title: 'Partner, Sequoia Capital' },
              { quote: 'The team, the traction, and the technology — Quantum has all three. This is a generational opportunity.', name: 'Mark Thompson', title: 'GP, a16z' },
            ],
          },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'See why top teams choose Quantum', description: 'Request a personalized demo with our team.', primaryCta: { label: 'Request Demo', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#f59e0b' },
        },
      ],
    },
  ],
};

// ─── Template: Corporate Services ───────────────────────────────

const TEMPLATE_CORPORATE_SERVICES: AppConfig = {
  id: 'corporate-services',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'Pinnacle Advisory',
    subtitle: 'Strategic consulting for market leaders',
    homeSegment: 'home',
    primaryColor: '#1e3a5f',
  },
  landingConfig: {
    navbar: {
      title: 'Pinnacle Advisory',
      links: [
        { label: 'Services', href: '#services' },
        { label: 'Results', href: '#stats' },
        { label: 'Team', href: '#team' },
        { label: 'Contact', href: '#contact' },
      ],
      ctaButton: { label: 'Schedule Consultation', href: '#contact' },
      sticky: true,
      transparent: false,
    },
    footer: {
      columns: [
        { title: 'Services', links: [{ label: 'Strategy', href: '#' }, { label: 'Operations', href: '#' }, { label: 'Digital Transformation', href: '#' }, { label: 'M&A Advisory', href: '#' }] },
        { title: 'Firm', links: [{ label: 'About', href: '#' }, { label: 'Leadership', href: '#team' }, { label: 'Careers', href: '#' }, { label: 'Contact', href: '#contact' }] },
        { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }, { label: 'Disclosures', href: '#' }] },
      ],
      copyright: '© 2026 Pinnacle Advisory Group, LLC. All rights reserved.',
      socialLinks: [{ icon: '💼', url: '#' }, { icon: '𝕏', url: '#' }],
    },
    seo: { title: 'Pinnacle Advisory — Strategic Consulting for Market Leaders', description: 'Top-tier management consulting. Strategy, operations, digital transformation, and M&A advisory for Fortune 500 companies.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'centered',
          heroConfig: { headline: 'Navigate complexity with confidence', subheadline: 'Pinnacle Advisory', description: 'We partner with Fortune 500 executives to solve their most critical strategic challenges. Decades of experience across every major industry.', primaryCta: { label: 'Schedule a Consultation', href: '#contact' }, alignment: 'center', minHeight: '70vh' },
          background: { type: 'gradient', value: 'linear-gradient(135deg, #0f2744 0%, #1e3a5f 100%)' },
        },
        {
          id: 'services', type: 'features', anchor: 'services',
          featuresConfig: {
            headline: 'Our Services', subtitle: 'Comprehensive advisory services for complex business challenges.',
            items: [
              { icon: '🎯', title: 'Corporate Strategy', description: 'Market entry, portfolio optimization, and long-term strategic planning for sustainable growth.' },
              { icon: '⚙️', title: 'Operations Excellence', description: 'Supply chain optimization, process redesign, and operational efficiency at scale.' },
              { icon: '💻', title: 'Digital Transformation', description: 'Technology roadmaps, data strategy, and organizational change management.' },
              { icon: '🤝', title: 'M&A Advisory', description: 'Due diligence, valuation, post-merger integration, and deal sourcing.' },
            ],
          },
        },
        {
          id: 'stats', type: 'stats', anchor: 'stats',
          statsConfig: { headline: 'Our Impact', items: [
            { value: '200+', label: 'Fortune 500 Clients' },
            { value: '$50B+', label: 'Value Created' },
            { value: '25+', label: 'Years of Experience' },
            { value: '95%', label: 'Client Satisfaction' },
          ] },
        },
        {
          id: 'team', type: 'team', anchor: 'team',
          teamConfig: {
            headline: 'Leadership',
            members: [
              { name: 'Robert Chen', role: 'Managing Partner', avatar: 'https://placehold.co/200x200/1e3a5f/ffffff?text=RC' },
              { name: 'Victoria Hayes', role: 'Partner, Strategy', avatar: 'https://placehold.co/200x200/1e3a5f/ffffff?text=VH' },
              { name: 'Michael Okafor', role: 'Partner, Operations', avatar: 'https://placehold.co/200x200/1e3a5f/ffffff?text=MO' },
              { name: 'Diana Petrov', role: 'Partner, Digital', avatar: 'https://placehold.co/200x200/1e3a5f/ffffff?text=DP' },
            ],
          },
        },
        {
          id: 'testimonials', type: 'testimonials',
          testimonialsConfig: {
            headline: 'What Our Clients Say',
            items: [
              { quote: 'Pinnacle helped us navigate a $3B merger seamlessly. Their strategic insight and hands-on approach were invaluable.', name: 'James Porter', title: 'CEO, Global Industries Inc.' },
              { quote: 'The operations redesign delivered $200M in annual savings within 18 months. Exceptional work.', name: 'Maria Santos', title: 'COO, TechManufacture Corp.' },
            ],
          },
        },
        {
          id: 'contact', type: 'contact', anchor: 'contact',
          contactConfig: { headline: 'Let\'s Discuss Your Challenge', subtitle: 'Schedule a confidential consultation with one of our partners.', successMessage: 'Thank you! A partner will contact you shortly.' },
        },
      ],
    },
  ],
};

// ─── Template: Law Firm ─────────────────────────────────────────

const TEMPLATE_LAW_FIRM: AppConfig = {
  id: 'law-firm',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'Sterling & Associates',
    subtitle: 'Trusted legal counsel since 1992',
    homeSegment: 'home',
    primaryColor: '#1c1917',
  },
  landingConfig: {
    navbar: {
      title: 'Sterling & Associates',
      links: [
        { label: 'Practice Areas', href: '#practices' },
        { label: 'Attorneys', href: '#team' },
        { label: 'Results', href: '#stats' },
        { label: 'Contact', href: '#contact' },
      ],
      ctaButton: { label: 'Free Consultation', href: '#contact' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Practice Areas', links: [{ label: 'Corporate Law', href: '#' }, { label: 'Litigation', href: '#' }, { label: 'IP Law', href: '#' }, { label: 'Real Estate', href: '#' }] },
        { title: 'Firm', links: [{ label: 'About', href: '#' }, { label: 'Attorneys', href: '#team' }, { label: 'News', href: '#' }, { label: 'Contact', href: '#contact' }] },
        { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Disclaimer', href: '#' }, { label: 'Attorney Advertising', href: '#' }] },
      ],
      copyright: '© 2026 Sterling & Associates LLP. All rights reserved.',
      socialLinks: [{ icon: '💼', url: '#' }],
    },
    seo: { title: 'Sterling & Associates — Trusted Legal Counsel', description: 'Full-service law firm specializing in corporate law, litigation, intellectual property, and real estate. Serving clients nationwide since 1992.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'centered',
          heroConfig: { headline: 'Protecting what matters most', subheadline: 'Sterling & Associates LLP', description: 'Full-service law firm with 30+ years of experience in corporate law, complex litigation, intellectual property, and real estate transactions.', primaryCta: { label: 'Free Consultation', href: '#contact' }, alignment: 'center', minHeight: '75vh' },
          background: { type: 'gradient', value: 'linear-gradient(135deg, #0c0a09 0%, #292524 100%)' },
        },
        {
          id: 'practices', type: 'features', anchor: 'practices',
          featuresConfig: {
            headline: 'Practice Areas', subtitle: 'Comprehensive legal services for businesses and individuals.',
            items: [
              { icon: '🏛️', title: 'Corporate Law', description: 'Formation, governance, compliance, and corporate transactions for businesses of all sizes.' },
              { icon: '⚖️', title: 'Litigation', description: 'Complex commercial litigation, arbitration, and dispute resolution with a winning track record.' },
              { icon: '💡', title: 'Intellectual Property', description: 'Patent prosecution, trademark registration, trade secrets, and IP licensing.' },
              { icon: '🏠', title: 'Real Estate', description: 'Commercial and residential transactions, zoning, land use, and development.' },
            ],
          },
        },
        {
          id: 'team', type: 'team', anchor: 'team',
          teamConfig: {
            headline: 'Our Attorneys',
            members: [
              { name: 'Catherine Sterling', role: 'Managing Partner', avatar: 'https://placehold.co/200x200/1c1917/ffffff?text=CS' },
              { name: 'David Park', role: 'Senior Partner', avatar: 'https://placehold.co/200x200/1c1917/ffffff?text=DP' },
              { name: 'Elena Rodriguez', role: 'Partner, IP', avatar: 'https://placehold.co/200x200/1c1917/ffffff?text=ER' },
              { name: 'Thomas Wright', role: 'Partner, Litigation', avatar: 'https://placehold.co/200x200/1c1917/ffffff?text=TW' },
            ],
          },
        },
        {
          id: 'testimonials', type: 'testimonials',
          testimonialsConfig: {
            headline: 'Client Testimonials',
            items: [
              { quote: 'Sterling & Associates handled our $500M acquisition flawlessly. Their attention to detail and strategic thinking saved us from several hidden risks.', name: 'Richard Blake', title: 'CEO, Apex Industries' },
              { quote: 'Outstanding IP counsel. They protected our patents across 12 jurisdictions and won every challenge.', name: 'Dr. Sarah Kim', title: 'CTO, InnovateTech' },
            ],
          },
        },
        {
          id: 'stats', type: 'stats', anchor: 'stats',
          statsConfig: { items: [
            { value: '30+', label: 'Years of Practice' },
            { value: '5,000+', label: 'Cases Handled' },
            { value: '97%', label: 'Success Rate' },
            { value: '40', label: 'Attorneys' },
          ] },
        },
        {
          id: 'contact', type: 'contact', anchor: 'contact',
          contactConfig: { headline: 'Schedule a Free Consultation', subtitle: 'Discuss your legal matter with one of our experienced attorneys. Confidential and obligation-free.', successMessage: 'Thank you! An attorney will contact you within 24 hours.' },
        },
      ],
    },
  ],
};

// ─── Template: Medical Clinic ───────────────────────────────────

const TEMPLATE_MEDICAL_CLINIC: AppConfig = {
  id: 'medical-clinic',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'CarePoint Medical',
    subtitle: 'Your health, our priority',
    homeSegment: 'home',
    primaryColor: '#0284c7',
  },
  landingConfig: {
    navbar: {
      title: 'CarePoint Medical',
      links: [
        { label: 'Services', href: '#services' },
        { label: 'Doctors', href: '#team' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Contact', href: '#contact' },
      ],
      ctaButton: { label: 'Book Appointment', href: '#contact' },
      sticky: true,
      transparent: false,
    },
    footer: {
      columns: [
        { title: 'Services', links: [{ label: 'Primary Care', href: '#' }, { label: 'Pediatrics', href: '#' }, { label: 'Cardiology', href: '#' }, { label: 'Dermatology', href: '#' }] },
        { title: 'Patients', links: [{ label: 'Book Online', href: '#contact' }, { label: 'Patient Portal', href: '#' }, { label: 'Insurance', href: '#' }, { label: 'Forms', href: '#' }] },
        { title: 'Contact', links: [{ label: 'Phone: (555) 123-4567', href: 'tel:5551234567' }, { label: 'Email Us', href: '#contact' }, { label: 'Directions', href: '#' }] },
      ],
      copyright: '© 2026 CarePoint Medical Group. All rights reserved.',
      socialLinks: [{ icon: '📘', url: '#' }, { icon: '📸', url: '#' }],
    },
    seo: { title: 'CarePoint Medical — Your Health, Our Priority', description: 'Comprehensive healthcare services including primary care, pediatrics, cardiology, and dermatology. Accepting new patients.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'split',
          heroConfig: { headline: 'Comprehensive care for the whole family', subheadline: 'CarePoint Medical', description: 'Board-certified physicians, modern facilities, and compassionate care. Now accepting new patients with same-day appointments available.', image: 'https://placehold.co/700x500/0284c7/ffffff?text=Modern+Clinic', primaryCta: { label: 'Book Appointment', href: '#contact' }, secondaryCta: { label: 'Our Services', href: '#services' }, alignment: 'left', minHeight: '75vh' },
          background: { type: 'color', value: '#f0f9ff' },
        },
        {
          id: 'services', type: 'features', anchor: 'services',
          featuresConfig: {
            headline: 'Our Specialties', subtitle: 'Expert care across a wide range of medical specialties.',
            items: [
              { icon: '🩺', title: 'Primary Care', description: 'Annual physicals, preventive care, chronic disease management, and wellness screenings.' },
              { icon: '👶', title: 'Pediatrics', description: 'Well-child visits, immunizations, developmental assessments, and pediatric urgent care.' },
              { icon: '❤️', title: 'Cardiology', description: 'Heart health screenings, EKG, echocardiography, and cardiac rehabilitation.' },
              { icon: '🔬', title: 'Dermatology', description: 'Skin cancer screening, acne treatment, cosmetic procedures, and allergy patch testing.' },
            ],
          },
        },
        {
          id: 'team', type: 'team', anchor: 'team',
          teamConfig: {
            headline: 'Our Physicians',
            members: [
              { name: 'Dr. Emily Chen', role: 'Internal Medicine', avatar: 'https://placehold.co/200x200/0284c7/ffffff?text=EC' },
              { name: 'Dr. James Okafor', role: 'Pediatrics', avatar: 'https://placehold.co/200x200/0284c7/ffffff?text=JO' },
              { name: 'Dr. Sarah Kim', role: 'Cardiology', avatar: 'https://placehold.co/200x200/0284c7/ffffff?text=SK' },
              { name: 'Dr. Maria Lopez', role: 'Dermatology', avatar: 'https://placehold.co/200x200/0284c7/ffffff?text=ML' },
            ],
          },
        },
        {
          id: 'testimonials', type: 'testimonials',
          testimonialsConfig: {
            headline: 'Patient Reviews',
            items: [
              { quote: 'Dr. Chen is the most thorough and caring doctor I have ever had. The staff is incredibly friendly and the wait times are minimal.', name: 'Jennifer M.', title: 'Patient' },
              { quote: 'My kids love Dr. Okafor. He makes every visit comfortable and explains everything clearly. Highly recommend CarePoint.', name: 'David R.', title: 'Parent' },
            ],
          },
        },
        {
          id: 'faq', type: 'faq', anchor: 'faq',
          faqConfig: {
            headline: 'Patient FAQ',
            items: [
              { question: 'Do you accept my insurance?', answer: 'We accept most major insurance plans including Aetna, Blue Cross, Cigna, and UnitedHealthcare. Call us to verify your coverage.' },
              { question: 'Can I book online?', answer: 'Yes! Use our online booking system or call (555) 123-4567 to schedule. Same-day appointments are often available.' },
              { question: 'Do you offer telehealth?', answer: 'Yes, we offer video visits for many types of appointments. Ask about telehealth when scheduling.' },
            ],
          },
        },
        {
          id: 'contact', type: 'contact', anchor: 'contact',
          contactConfig: { headline: 'Book an Appointment', subtitle: 'Schedule your visit online or call us at (555) 123-4567. Same-day appointments available.', successMessage: 'Thank you! We will confirm your appointment shortly.' },
        },
      ],
    },
  ],
};

// ─── Template: Architecture Studio ──────────────────────────────

const TEMPLATE_ARCHITECTURE_STUDIO: AppConfig = {
  id: 'architecture-studio',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'Forma Architects',
    subtitle: 'Designing spaces that inspire',
    homeSegment: 'home',
    primaryColor: '#78716c',
  },
  landingConfig: {
    navbar: {
      title: 'Forma',
      links: [
        { label: 'Projects', href: '#projects' },
        { label: 'Philosophy', href: '#philosophy' },
        { label: 'Studio', href: '#team' },
        { label: 'Contact', href: '#contact' },
      ],
      ctaButton: { label: 'Start a Project', href: '#contact' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Services', links: [{ label: 'Residential', href: '#' }, { label: 'Commercial', href: '#' }, { label: 'Interior Design', href: '#' }, { label: 'Urban Planning', href: '#' }] },
        { title: 'Studio', links: [{ label: 'About', href: '#' }, { label: 'Team', href: '#team' }, { label: 'Awards', href: '#' }, { label: 'Contact', href: '#contact' }] },
      ],
      copyright: '© 2026 Forma Architects. All rights reserved.',
      socialLinks: [{ icon: '📸', url: '#' }, { icon: '📌', url: '#' }, { icon: '💼', url: '#' }],
    },
    seo: { title: 'Forma Architects — Designing Spaces That Inspire', description: 'Award-winning architecture studio specializing in residential, commercial, and interior design. Sustainable design for modern living.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'fullscreen',
          heroConfig: { headline: 'Architecture is frozen music', description: 'Award-winning design studio creating timeless spaces that balance beauty, function, and sustainability.', primaryCta: { label: 'View Projects', href: '#projects' }, alignment: 'center', minHeight: '100vh' },
          background: { type: 'image', value: 'https://placehold.co/1920x1080/78716c/ffffff?text=Architecture', overlay: 'rgba(0,0,0,0.4)' },
        },
        {
          id: 'philosophy', type: 'content', anchor: 'philosophy',
          contentConfig: { headline: 'Our Philosophy', body: '<p>We believe great architecture emerges from the dialogue between space, light, and the people who inhabit it. Every project begins with listening — understanding how you live, work, and dream.</p><p>Our approach blends modernist clarity with sustainable materials and biophilic design principles. The result: spaces that feel timeless on day one and grow more beautiful with age.</p>', image: 'https://placehold.co/500x400/78716c/ffffff?text=Design+Process', imagePosition: 'right', bodyFormat: 'html' },
        },
        {
          id: 'projects', type: 'gallery', anchor: 'projects',
          galleryConfig: { headline: 'Selected Projects', images: [
            { src: 'https://placehold.co/600x450/a8a29e/ffffff?text=Lakeside+Residence', alt: 'Lakeside Residence' },
            { src: 'https://placehold.co/600x450/78716c/ffffff?text=Urban+Office', alt: 'Urban Office Complex' },
            { src: 'https://placehold.co/600x450/57534e/ffffff?text=Gallery+Space', alt: 'Contemporary Gallery' },
            { src: 'https://placehold.co/600x450/a8a29e/ffffff?text=Beach+House', alt: 'Coastal Retreat' },
            { src: 'https://placehold.co/600x450/78716c/ffffff?text=Restaurant', alt: 'Restaurant Interiors' },
            { src: 'https://placehold.co/600x450/57534e/ffffff?text=Penthouse', alt: 'Sky Penthouse' },
          ], columns: 3 },
        },
        {
          id: 'team', type: 'team', anchor: 'team',
          teamConfig: {
            headline: 'The Studio',
            members: [
              { name: 'Lucia Ferreira', role: 'Principal Architect', avatar: 'https://placehold.co/200x200/78716c/ffffff?text=LF' },
              { name: 'Kenji Tanaka', role: 'Design Director', avatar: 'https://placehold.co/200x200/78716c/ffffff?text=KT' },
              { name: 'Nina Andersen', role: 'Interior Design Lead', avatar: 'https://placehold.co/200x200/78716c/ffffff?text=NA' },
            ],
          },
        },
        {
          id: 'stats', type: 'stats',
          statsConfig: { items: [
            { value: '120+', label: 'Projects Completed' },
            { value: '15', label: 'Design Awards' },
            { value: '18', label: 'Years of Practice' },
            { value: '3', label: 'Countries' },
          ] },
        },
        {
          id: 'contact', type: 'contact', anchor: 'contact',
          contactConfig: { headline: 'Start Your Project', subtitle: 'Tell us about your vision. We would love to bring it to life.', successMessage: 'Thank you! We will be in touch shortly.' },
        },
      ],
    },
  ],
};

// ─── Template: Wedding Planner ──────────────────────────────────

const TEMPLATE_WEDDING_PLANNER: AppConfig = {
  id: 'wedding-planner',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'Ever After Events',
    subtitle: 'Making your dream day a reality',
    homeSegment: 'home',
    primaryColor: '#be185d',
  },
  landingConfig: {
    navbar: {
      title: 'Ever After',
      links: [
        { label: 'Gallery', href: '#gallery' },
        { label: 'Services', href: '#testimonials' },
        { label: 'Packages', href: '#pricing' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Contact', href: '#contact' },
      ],
      ctaButton: { label: 'Plan Your Day', href: '#contact' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Services', links: [{ label: 'Full Planning', href: '#' }, { label: 'Day-Of Coordination', href: '#' }, { label: 'Destination Weddings', href: '#' }, { label: 'Corporate Events', href: '#' }] },
        { title: 'Connect', links: [{ label: 'Instagram', href: '#', external: true }, { label: 'Pinterest', href: '#', external: true }, { label: 'The Knot', href: '#', external: true }] },
      ],
      copyright: '© 2026 Ever After Events. All rights reserved.',
      socialLinks: [{ icon: '📸', url: '#' }, { icon: '📌', url: '#' }],
    },
    seo: { title: 'Ever After Events — Making Your Dream Day a Reality', description: 'Luxury wedding planning and event design. Full-service coordination, destination weddings, and bespoke celebrations.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'fullscreen',
          heroConfig: { headline: 'Your love story deserves a perfect celebration', description: 'Luxury wedding planning and event design. From intimate elopements to grand celebrations, we make every detail unforgettable.', primaryCta: { label: 'Start Planning', href: '#contact' }, secondaryCta: { label: 'View Our Work', href: '#gallery' }, alignment: 'center', minHeight: '100vh' },
          background: { type: 'image', value: 'https://placehold.co/1920x1080/be185d/ffffff?text=Wedding', overlay: 'rgba(0,0,0,0.3)' },
        },
        {
          id: 'gallery', type: 'gallery', anchor: 'gallery',
          galleryConfig: { headline: 'Our Celebrations', images: [
            { src: 'https://placehold.co/500x400/fda4af/ffffff?text=Garden+Wedding', alt: 'Garden Wedding' },
            { src: 'https://placehold.co/500x400/fb7185/ffffff?text=Beach+Ceremony', alt: 'Beach Ceremony' },
            { src: 'https://placehold.co/500x400/f43f5e/ffffff?text=Ballroom+Reception', alt: 'Ballroom Reception' },
            { src: 'https://placehold.co/500x400/be185d/ffffff?text=Vineyard+Dinner', alt: 'Vineyard Dinner' },
          ], columns: 4 },
        },
        {
          id: 'testimonials', type: 'testimonials',
          testimonialsConfig: {
            headline: 'Happy Couples',
            items: [
              { quote: 'Ever After made our wedding absolutely magical. Every single detail was perfect, from the flowers to the timeline. We could not have done it without them.', name: 'Jessica & Michael', title: 'Married June 2025' },
              { quote: 'Planning a destination wedding felt overwhelming until we found Ever After. They handled everything flawlessly and we just enjoyed the day.', name: 'Ana & Carlos', title: 'Married September 2025' },
            ],
          },
        },
        {
          id: 'pricing', type: 'pricing', anchor: 'pricing',
          pricingConfig: {
            headline: 'Our Packages',
            plans: [
              { name: 'Day-Of', price: 'From $2,500', features: ['Day-of coordination', 'Timeline management', 'Vendor communication', 'Emergency kit'], cta: { label: 'Inquire', href: '#contact' } },
              { name: 'Full Planning', price: 'From $8,000', features: ['Complete planning & design', 'Venue selection', 'Vendor management', 'Budget tracking', 'Day-of coordination'], cta: { label: 'Inquire', href: '#contact' }, highlighted: true },
              { name: 'Destination', price: 'From $15,000', features: ['Everything in Full Planning', 'Travel coordination', 'Welcome events', 'Guest management', 'Local vendor sourcing'], cta: { label: 'Inquire', href: '#contact' } },
            ],
          },
        },
        {
          id: 'faq', type: 'faq', anchor: 'faq',
          faqConfig: {
            headline: 'FAQ',
            items: [
              { question: 'How far in advance should I book?', answer: 'We recommend booking 12-18 months before your wedding date. For destination weddings, 18-24 months is ideal.' },
              { question: 'Do you work with specific vendors?', answer: 'We have a curated list of trusted vendors but are always happy to work with your preferred choices too.' },
              { question: 'What is your service area?', answer: 'We are based in California but plan destination weddings worldwide. Travel fees may apply for events outside our local area.' },
            ],
          },
        },
        {
          id: 'contact', type: 'contact', anchor: 'contact',
          contactConfig: { headline: 'Let\'s Plan Your Perfect Day', subtitle: 'Tell us about your vision and we will be in touch within 24 hours.', successMessage: 'Thank you! We will reach out within 24 hours.' },
        },
      ],
    },
  ],
};

// ─── Template: Coworking Space ──────────────────────────────────

const TEMPLATE_COWORKING_SPACE: AppConfig = {
  id: 'coworking-space',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'WorkHive',
    subtitle: 'Where great work happens',
    homeSegment: 'home',
    primaryColor: '#ea580c',
  },
  landingConfig: {
    navbar: {
      title: 'WorkHive',
      links: [
        { label: 'Amenities', href: '#amenities' },
        { label: 'Plans', href: '#pricing' },
        { label: 'Spaces', href: '#gallery' },
        { label: 'Reviews', href: '#testimonials' },
      ],
      ctaButton: { label: 'Book a Tour', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Spaces', links: [{ label: 'Hot Desks', href: '#' }, { label: 'Private Offices', href: '#' }, { label: 'Meeting Rooms', href: '#' }, { label: 'Event Space', href: '#' }] },
        { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Locations', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Contact', href: '#' }] },
      ],
      copyright: '© 2026 WorkHive. All rights reserved.',
      socialLinks: [{ icon: '📸', url: '#' }, { icon: '💼', url: '#' }, { icon: '𝕏', url: '#' }],
    },
    seo: { title: 'WorkHive — Where Great Work Happens', description: 'Premium coworking spaces with hot desks, private offices, and meeting rooms. Flexible plans, amazing community, downtown location.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'split',
          heroConfig: { headline: 'Your office, reimagined', subheadline: 'Premium Coworking', description: 'Flexible workspaces in the heart of downtown. Hot desks, private offices, and meeting rooms with world-class amenities and a thriving community.', image: 'https://placehold.co/700x500/ea580c/ffffff?text=Coworking+Space', primaryCta: { label: 'Book a Tour', href: '#cta' }, secondaryCta: { label: 'See Plans', href: '#pricing' }, alignment: 'left', minHeight: '80vh' },
          background: { type: 'color', value: '#fff7ed' },
        },
        {
          id: 'amenities', type: 'features', anchor: 'amenities',
          featuresConfig: {
            headline: 'World-Class Amenities', subtitle: 'Everything you need to do your best work.',
            items: [
              { icon: '☕', title: 'Craft Coffee & Snacks', description: 'Unlimited specialty coffee, tea, and healthy snacks. Catered lunches on Fridays.' },
              { icon: '🖨️', title: 'Print & Mail', description: 'High-speed printing, scanning, and a dedicated business mailing address.' },
              { icon: '📶', title: 'Gigabit Internet', description: 'Enterprise-grade WiFi and Ethernet. Redundant connections for 99.9% uptime.' },
              { icon: '🏋️', title: 'Wellness Room', description: 'On-site gym, meditation room, and bike storage. Take care of yourself and your work.' },
            ],
          },
        },
        {
          id: 'pricing', type: 'pricing', anchor: 'pricing',
          pricingConfig: {
            headline: 'Flexible Plans',
            plans: [
              { name: 'Hot Desk', price: '$250/mo', features: ['Shared desk access', 'Business address', 'Coffee & snacks', 'Community events', '5 meeting room hours'], cta: { label: 'Start Now', href: '#cta' } },
              { name: 'Dedicated Desk', price: '$450/mo', features: ['Your own desk 24/7', 'Locker storage', 'All Hot Desk perks', '15 meeting room hours', 'Printing credits'], cta: { label: 'Start Now', href: '#cta' }, highlighted: true },
              { name: 'Private Office', price: 'From $1,200/mo', features: ['Lockable office (2-10 people)', 'Custom branding', 'All Dedicated perks', 'Unlimited meeting rooms', 'Dedicated phone line'], cta: { label: 'Contact Us', href: '#cta' } },
            ],
          },
        },
        {
          id: 'gallery', type: 'gallery', anchor: 'gallery',
          galleryConfig: { headline: 'Our Spaces', images: [
            { src: 'https://placehold.co/500x400/ea580c/ffffff?text=Open+Space', alt: 'Open Workspace' },
            { src: 'https://placehold.co/500x400/c2410c/ffffff?text=Private+Office', alt: 'Private Office' },
            { src: 'https://placehold.co/500x400/9a3412/ffffff?text=Meeting+Room', alt: 'Meeting Room' },
            { src: 'https://placehold.co/500x400/ea580c/ffffff?text=Lounge', alt: 'Lounge Area' },
          ], columns: 4 },
        },
        {
          id: 'testimonials', type: 'testimonials', anchor: 'testimonials',
          testimonialsConfig: {
            headline: 'Member Stories',
            items: [
              { quote: 'WorkHive is more than an office — it is a community. I have found collaborators, clients, and friends here. Best business decision I ever made.', name: 'Sarah Lee', title: 'Freelance Designer' },
              { quote: 'The private offices are beautifully designed and the internet never drops. Our team of 6 could not be happier.', name: 'James Rivera', title: 'CEO, TinyStartup' },
            ],
          },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Come see the space', description: 'Book a free tour and try a day on us. No commitment required.', primaryCta: { label: 'Book a Free Tour', href: '#' }, variant: 'centered' },
          background: { type: 'color', value: '#ea580c' },
        },
      ],
    },
  ],
};

// ─── Template: Crypto DeFi ──────────────────────────────────────

const TEMPLATE_CRYPTO_DEFI: AppConfig = {
  id: 'crypto-defi',
  version: '1.0.0',
  appMode: 'landing',
  branding: {
    title: 'NexVault',
    subtitle: 'Decentralized finance, simplified',
    homeSegment: 'home',
    primaryColor: '#6d28d9',
  },
  landingConfig: {
    navbar: {
      title: 'NexVault',
      links: [
        { label: 'Protocol', href: '#features' },
        { label: 'Stats', href: '#stats' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'FAQ', href: '#faq' },
      ],
      ctaButton: { label: 'Launch App', href: '#cta' },
      sticky: true,
      transparent: true,
    },
    footer: {
      columns: [
        { title: 'Protocol', links: [{ label: 'Documentation', href: '#' }, { label: 'GitHub', href: '#', external: true }, { label: 'Audit Reports', href: '#' }, { label: 'Bug Bounty', href: '#' }] },
        { title: 'Community', links: [{ label: 'Discord', href: '#', external: true }, { label: 'Twitter', href: '#', external: true }, { label: 'Governance', href: '#' }, { label: 'Blog', href: '#' }] },
        { title: 'Legal', links: [{ label: 'Terms', href: '#' }, { label: 'Privacy', href: '#' }, { label: 'Risk Disclaimer', href: '#' }] },
      ],
      copyright: '© 2026 NexVault Protocol. All rights reserved.',
      socialLinks: [{ icon: '💬', url: '#' }, { icon: '𝕏', url: '#' }, { icon: '🐙', url: '#' }],
    },
    seo: { title: 'NexVault — Decentralized Finance, Simplified', description: 'DeFi protocol offering yield farming, lending, and staking with industry-leading security. Audited by Trail of Bits.', ogType: 'website' },
  },
  navigation: [],
  pages: [
    {
      id: 'home', segment: 'home', title: 'Home', content: 'landing',
      landingSections: [
        {
          id: 'hero', type: 'hero', variant: 'centered',
          heroConfig: { headline: 'Earn yield on your crypto, effortlessly', subheadline: 'Decentralized Finance Protocol', description: 'NexVault offers automated yield optimization, lending, and staking across multiple chains. Non-custodial, audited, and open source.', primaryCta: { label: 'Launch App', href: '#' }, secondaryCta: { label: 'Read Docs', href: '#' }, alignment: 'center', minHeight: '85vh' },
          background: { type: 'gradient', value: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #6d28d9 100%)' },
        },
        {
          id: 'stats', type: 'stats', anchor: 'stats',
          statsConfig: { headline: 'Protocol Stats', items: [
            { value: '$1.8B', label: 'Total Value Locked' },
            { value: '420K', label: 'Unique Wallets' },
            { value: '12.4%', label: 'Avg APY' },
            { value: '5', label: 'Chains Supported' },
          ] },
        },
        {
          id: 'features', type: 'features', anchor: 'features',
          featuresConfig: {
            headline: 'Protocol Features', subtitle: 'Everything you need to put your crypto to work.',
            items: [
              { icon: '🌾', title: 'Yield Farming', description: 'Automated strategies that optimize your yield across lending protocols and liquidity pools.' },
              { icon: '🏦', title: 'Lending & Borrowing', description: 'Supply assets to earn interest or borrow against your collateral. Variable and fixed rates.' },
              { icon: '🔒', title: 'Staking', description: 'Stake NXV tokens to earn protocol fees and governance power. No lockup period.' },
              { icon: '🔗', title: 'Multi-Chain', description: 'Deploy on Ethereum, Arbitrum, Polygon, Optimism, and Base. Unified experience across chains.' },
            ],
          },
        },
        {
          id: 'pricing', type: 'pricing', anchor: 'pricing',
          pricingConfig: {
            headline: 'Protocol Fees',
            plans: [
              { name: 'Yield Farming', price: '0.5% Fee', features: ['Automated rebalancing', 'Gas optimization', 'Multi-protocol', 'Auto-compounding'], cta: { label: 'Start Farming', href: '#' } },
              { name: 'Lending', price: '0.1% Fee', features: ['Variable & fixed rates', 'Flash loans', 'Isolated markets', 'Liquidation protection'], cta: { label: 'Start Lending', href: '#' }, highlighted: true },
              { name: 'Staking', price: '0% Fee', features: ['NXV staking', 'Governance voting', 'Fee sharing', 'No lockup'], cta: { label: 'Stake NXV', href: '#' } },
            ],
          },
        },
        {
          id: 'faq', type: 'faq', anchor: 'faq',
          faqConfig: {
            headline: 'FAQ',
            items: [
              { question: 'Is NexVault audited?', answer: 'Yes. Our smart contracts are audited by Trail of Bits and Certora. All audit reports are public on our GitHub.' },
              { question: 'Is it non-custodial?', answer: 'Absolutely. You always maintain full control of your assets. NexVault smart contracts are immutable and permissionless.' },
              { question: 'What are the risks?', answer: 'DeFi involves smart contract risk, market risk, and liquidation risk. Please read our risk documentation before using the protocol.' },
            ],
          },
        },
        {
          id: 'cta', type: 'cta', anchor: 'cta',
          ctaConfig: { headline: 'Start earning yield today', description: 'Non-custodial. Audited. Open source. Connect your wallet to begin.', primaryCta: { label: 'Launch App', href: '#' }, variant: 'centered' },
          background: { type: 'gradient', value: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 100%)' },
        },
      ],
    },
  ],
};

// ─── Template Registry ───────────────────────────────────────────

const ALL_TEMPLATES: { meta: LandingTemplateMeta; config: AppConfig }[] = [
  {
    meta: {
      id: 'saas-startup',
      title: 'SaaS Startup',
      description: 'Landing page for SaaS products with hero, features, pricing, testimonials, and FAQ.',
      category: 'saas',
      icon: '🚀',
      tags: ['saas', 'startup', 'tech', 'pricing', 'testimonials'],
    },
    config: TEMPLATE_SAAS_STARTUP,
  },
  {
    meta: {
      id: 'portfolio-minimal',
      title: 'Portfolio Minimal',
      description: 'Clean, minimal portfolio for designers and developers with project gallery.',
      category: 'portfolio',
      icon: '🎨',
      tags: ['portfolio', 'design', 'creative', 'minimal'],
    },
    config: TEMPLATE_PORTFOLIO_MINIMAL,
  },
  {
    meta: {
      id: 'restaurant-menu',
      title: 'Restaurant',
      description: 'Restaurant landing page with menu gallery, story section, and reservation CTA.',
      category: 'restaurant',
      icon: '🍽️',
      tags: ['restaurant', 'food', 'menu', 'dining'],
    },
    config: TEMPLATE_RESTAURANT,
  },
  {
    meta: {
      id: 'saas-product',
      title: 'SaaS Product',
      description: 'Product-focused SaaS landing with split hero, video demo, alternating features, and pricing.',
      category: 'saas',
      icon: '💻',
      tags: ['saas', 'product', 'software', 'video', 'pricing'],
    },
    config: TEMPLATE_SAAS_PRODUCT,
  },
  {
    meta: {
      id: 'portfolio-agency',
      title: 'Digital Agency',
      description: 'Digital agency landing with services, team section, testimonials, and contact form.',
      category: 'agency',
      icon: '🏢',
      tags: ['agency', 'design', 'development', 'team', 'services'],
    },
    config: TEMPLATE_PORTFOLIO_AGENCY,
  },
  {
    meta: {
      id: 'event-conference',
      title: 'Conference Event',
      description: 'Conference landing with speaker grid, ticket pricing, FAQ, and countdown.',
      category: 'event',
      icon: '🎤',
      tags: ['event', 'conference', 'speakers', 'tickets', 'tech'],
    },
    config: TEMPLATE_EVENT_CONFERENCE,
  },
  {
    meta: {
      id: 'ecommerce-store',
      title: 'E-Commerce Store',
      description: 'Storefront landing with product gallery, categories, testimonials, and promotional CTA.',
      category: 'ecommerce',
      icon: '🛍️',
      tags: ['ecommerce', 'store', 'products', 'furniture', 'shop'],
    },
    config: TEMPLATE_ECOMMERCE_STORE,
  },
  {
    meta: {
      id: 'blog-standard',
      title: 'Blog Standard',
      description: 'Clean blog with minimal hero and grid-based article listing page.',
      category: 'blog',
      icon: '✍️',
      tags: ['blog', 'articles', 'writing', 'newsletter'],
    },
    config: TEMPLATE_BLOG_STANDARD,
  },
  {
    meta: {
      id: 'blog-magazine',
      title: 'Blog Magazine',
      description: 'Magazine-style blog with featured post hero and magazine layout listing.',
      category: 'blog',
      icon: '📰',
      tags: ['blog', 'magazine', 'news', 'media', 'editorial'],
    },
    config: TEMPLATE_BLOG_MAGAZINE,
  },
  {
    meta: {
      id: 'consulting-firm',
      title: 'Consulting Firm',
      description: 'B2B consulting landing with services, team, stats, testimonials, and contact form.',
      category: 'professional',
      icon: '📋',
      tags: ['consulting', 'b2b', 'professional', 'corporate', 'services'],
    },
    config: TEMPLATE_CONSULTING_FIRM,
  },
  {
    meta: {
      id: 'nonprofit-charity',
      title: 'Nonprofit Charity',
      description: 'Charity landing with emotional hero, impact stats, mission, gallery, and donate CTA.',
      category: 'nonprofit',
      icon: '💛',
      tags: ['nonprofit', 'charity', 'donate', 'education', 'impact'],
    },
    config: TEMPLATE_NONPROFIT_CHARITY,
  },
  {
    meta: {
      id: 'fitness-gym',
      title: 'Fitness Gym',
      description: 'Gym landing with classes, membership pricing, results, gallery, and free trial CTA.',
      category: 'fitness',
      icon: '🏋️',
      tags: ['fitness', 'gym', 'crossfit', 'training', 'health'],
    },
    config: TEMPLATE_FITNESS_GYM,
  },
  {
    meta: {
      id: 'realestate-listing',
      title: 'Real Estate',
      description: 'Luxury property landing with gallery, features, market stats, reviews, and contact.',
      category: 'realestate',
      icon: '🏠',
      tags: ['realestate', 'property', 'luxury', 'homes', 'listings'],
    },
    config: TEMPLATE_REALESTATE_LISTING,
  },
  {
    meta: {
      id: 'education-course',
      title: 'Online Course',
      description: 'Course landing with curriculum, pricing tiers, student reviews, FAQ, and enrollment CTA.',
      category: 'education',
      icon: '🎓',
      tags: ['education', 'course', 'bootcamp', 'coding', 'learning'],
    },
    config: TEMPLATE_EDUCATION_COURSE,
  },
  {
    meta: {
      id: 'app-download',
      title: 'Mobile App',
      description: 'App landing with phone mockup hero, feature icons, stats, reviews, and download CTAs.',
      category: 'mobile-app',
      icon: '📱',
      tags: ['app', 'mobile', 'download', 'ios', 'android', 'health'],
    },
    config: TEMPLATE_APP_DOWNLOAD,
  },
  // ── Blog Templates ──
  {
    meta: {
      id: 'blog-masonry',
      title: 'Blog Masonry',
      description: 'Pinterest-style masonry blog layout with featured post hero and newsletter CTA.',
      category: 'blog',
      icon: '📌',
      tags: ['blog', 'masonry', 'pinterest', 'creative', 'visual'],
    },
    config: TEMPLATE_BLOG_MASONRY,
  },
  {
    meta: {
      id: 'blog-clean',
      title: 'Blog Clean',
      description: 'Minimal long-form blog with no sidebar, serif typography focus, and distraction-free reading.',
      category: 'blog',
      icon: '📝',
      tags: ['blog', 'minimal', 'clean', 'longform', 'writing'],
    },
    config: TEMPLATE_BLOG_CLEAN,
  },
  {
    meta: {
      id: 'blog-tech',
      title: 'Tech Blog',
      description: 'Developer-focused tech blog with dark hero, topic sections, and newsletter.',
      category: 'blog',
      icon: '💻',
      tags: ['blog', 'tech', 'developer', 'coding', 'engineering'],
    },
    config: TEMPLATE_BLOG_TECH,
  },
  {
    meta: {
      id: 'blog-lifestyle',
      title: 'Lifestyle Blog',
      description: 'Lifestyle and wellness blog with soft colors, Instagram gallery, and magazine layout.',
      category: 'blog',
      icon: '🌸',
      tags: ['blog', 'lifestyle', 'wellness', 'fashion', 'inspiration'],
    },
    config: TEMPLATE_BLOG_LIFESTYLE,
  },
  {
    meta: {
      id: 'blog-news',
      title: 'News Portal',
      description: 'News and magazine portal with breaking news hero and multi-column article listing.',
      category: 'blog',
      icon: '📰',
      tags: ['blog', 'news', 'magazine', 'journalism', 'media'],
    },
    config: TEMPLATE_BLOG_NEWS,
  },
  {
    meta: {
      id: 'blog-personal',
      title: 'Personal Blog',
      description: 'Personal blog with avatar hero, about section, and simple list-style posts.',
      category: 'blog',
      icon: '👤',
      tags: ['blog', 'personal', 'journal', 'diary', 'writer'],
    },
    config: TEMPLATE_BLOG_PERSONAL,
  },
  {
    meta: {
      id: 'blog-food',
      title: 'Food Blog',
      description: 'Recipe and food blog with warm amber colors, recipe gallery, and newsletter.',
      category: 'blog',
      icon: '🍳',
      tags: ['blog', 'food', 'recipes', 'cooking', 'kitchen'],
    },
    config: TEMPLATE_BLOG_FOOD,
  },
  {
    meta: {
      id: 'blog-travel',
      title: 'Travel Blog',
      description: 'Travel blog with full-screen destination hero, stats, photo gallery, and magazine listing.',
      category: 'blog',
      icon: '✈️',
      tags: ['blog', 'travel', 'destinations', 'photography', 'adventure'],
    },
    config: TEMPLATE_BLOG_TRAVEL,
  },
  {
    meta: {
      id: 'blog-photography',
      title: 'Photography Blog',
      description: 'Dark-themed photography blog with full-width gallery and minimal design.',
      category: 'blog',
      icon: '📷',
      tags: ['blog', 'photography', 'portfolio', 'dark', 'visual'],
    },
    config: TEMPLATE_BLOG_PHOTOGRAPHY,
  },
  {
    meta: {
      id: 'blog-podcast',
      title: 'Podcast Blog',
      description: 'Podcast landing with episode list, download stats, and subscribe CTAs.',
      category: 'blog',
      icon: '🎙️',
      tags: ['blog', 'podcast', 'audio', 'interviews', 'episodes'],
    },
    config: TEMPLATE_BLOG_PODCAST,
  },
  {
    meta: {
      id: 'blog-review',
      title: 'Review Blog',
      description: 'Product review site with category sections and data-driven review listings.',
      category: 'blog',
      icon: '⭐',
      tags: ['blog', 'reviews', 'products', 'tech', 'comparisons'],
    },
    config: TEMPLATE_BLOG_REVIEW,
  },
  {
    meta: {
      id: 'blog-tutorial',
      title: 'Tutorial Blog',
      description: 'Tutorial and course blog with learning paths, student stats, and grid layout.',
      category: 'blog',
      icon: '📚',
      tags: ['blog', 'tutorials', 'courses', 'learning', 'education'],
    },
    config: TEMPLATE_BLOG_TUTORIAL,
  },
  {
    meta: {
      id: 'blog-newsletter',
      title: 'Newsletter Blog',
      description: 'Newsletter-first blog (Substack style) with big subscribe hero and reader testimonials.',
      category: 'blog',
      icon: '📬',
      tags: ['blog', 'newsletter', 'substack', 'email', 'subscribe'],
    },
    config: TEMPLATE_BLOG_NEWSLETTER,
  },
  {
    meta: {
      id: 'blog-corporate',
      title: 'Corporate Blog',
      description: 'Corporate thought leadership blog with partner logos, team section, and professional tone.',
      category: 'blog',
      icon: '🏢',
      tags: ['blog', 'corporate', 'enterprise', 'thought-leadership', 'b2b'],
    },
    config: TEMPLATE_BLOG_CORPORATE,
  },
  {
    meta: {
      id: 'blog-multilang',
      title: 'Multi-Language Blog',
      description: 'Multilingual blog with language selector, global topics, and FAQ section.',
      category: 'blog',
      icon: '🌍',
      tags: ['blog', 'multilingual', 'international', 'languages', 'culture'],
    },
    config: TEMPLATE_BLOG_MULTILANG,
  },
  // ── SaaS / Agency / Business Templates ──
  {
    meta: {
      id: 'agency-creative',
      title: 'Creative Agency',
      description: 'Award-winning creative agency with video hero, portfolio gallery, services, and team.',
      category: 'agency',
      icon: '🎬',
      tags: ['agency', 'creative', 'branding', 'video', 'portfolio'],
    },
    config: TEMPLATE_AGENCY_CREATIVE,
  },
  {
    meta: {
      id: 'agency-digital',
      title: 'Digital Marketing Agency',
      description: 'Digital marketing agency with ROI stats, service tiers, pricing, and client testimonials.',
      category: 'agency',
      icon: '📈',
      tags: ['agency', 'marketing', 'seo', 'ppc', 'growth'],
    },
    config: TEMPLATE_AGENCY_DIGITAL,
  },
  {
    meta: {
      id: 'saas-ai',
      title: 'AI SaaS Platform',
      description: 'AI/ML product landing with gradient hero, capabilities, video demo, pricing, and FAQ.',
      category: 'saas',
      icon: '🤖',
      tags: ['saas', 'ai', 'machine-learning', 'automation', 'enterprise'],
    },
    config: TEMPLATE_SAAS_AI,
  },
  {
    meta: {
      id: 'saas-devtools',
      title: 'Developer Tools',
      description: 'Developer tools SaaS with dark theme, code-style hero, free tier pricing, and FAQ.',
      category: 'saas',
      icon: '🛠️',
      tags: ['saas', 'developer', 'tools', 'api', 'sdk'],
    },
    config: TEMPLATE_SAAS_DEVTOOLS,
  },
  {
    meta: {
      id: 'saas-analytics',
      title: 'Analytics Platform',
      description: 'Privacy-first analytics SaaS with dashboard hero, features, stats, and simple pricing.',
      category: 'saas',
      icon: '📊',
      tags: ['saas', 'analytics', 'privacy', 'dashboard', 'gdpr'],
    },
    config: TEMPLATE_SAAS_ANALYTICS,
  },
  {
    meta: {
      id: 'saas-ecommerce',
      title: 'E-Commerce Platform',
      description: 'E-commerce platform SaaS with store hero, merchant testimonials, pricing, and FAQ.',
      category: 'saas',
      icon: '🛒',
      tags: ['saas', 'ecommerce', 'store', 'platform', 'merchants'],
    },
    config: TEMPLATE_SAAS_ECOMMERCE,
  },
  {
    meta: {
      id: 'saas-fintech',
      title: 'Fintech Platform',
      description: 'Financial infrastructure SaaS with security section, stats, and pay-as-you-go pricing.',
      category: 'saas',
      icon: '💰',
      tags: ['saas', 'fintech', 'payments', 'banking', 'api'],
    },
    config: TEMPLATE_SAAS_FINTECH,
  },
  {
    meta: {
      id: 'startup-pitch',
      title: 'Startup Pitch',
      description: 'Startup investor pitch page with traction stats, team, and investor testimonials.',
      category: 'saas',
      icon: '🦄',
      tags: ['saas', 'startup', 'pitch', 'investors', 'fundraising'],
    },
    config: TEMPLATE_STARTUP_PITCH,
  },
  {
    meta: {
      id: 'corporate-services',
      title: 'Corporate Services',
      description: 'Corporate consulting landing with services, impact stats, leadership team, and contact form.',
      category: 'professional',
      icon: '🏛️',
      tags: ['professional', 'consulting', 'corporate', 'b2b', 'strategy'],
    },
    config: TEMPLATE_CORPORATE_SERVICES,
  },
  {
    meta: {
      id: 'law-firm',
      title: 'Law Firm',
      description: 'Elegant law firm landing with practice areas, attorney profiles, and client testimonials.',
      category: 'professional',
      icon: '⚖️',
      tags: ['professional', 'law', 'legal', 'attorneys', 'firm'],
    },
    config: TEMPLATE_LAW_FIRM,
  },
  {
    meta: {
      id: 'medical-clinic',
      title: 'Medical Clinic',
      description: 'Healthcare clinic with specialties, doctor profiles, patient FAQ, and appointment booking.',
      category: 'professional',
      icon: '🏥',
      tags: ['professional', 'medical', 'healthcare', 'clinic', 'doctors'],
    },
    config: TEMPLATE_MEDICAL_CLINIC,
  },
  {
    meta: {
      id: 'architecture-studio',
      title: 'Architecture Studio',
      description: 'Architecture portfolio with full-width gallery, design philosophy, and project showcase.',
      category: 'portfolio',
      icon: '🏗️',
      tags: ['portfolio', 'architecture', 'design', 'studio', 'buildings'],
    },
    config: TEMPLATE_ARCHITECTURE_STUDIO,
  },
  {
    meta: {
      id: 'wedding-planner',
      title: 'Wedding Planner',
      description: 'Romantic wedding planning landing with celebration gallery, packages, and FAQ.',
      category: 'event',
      icon: '💍',
      tags: ['event', 'wedding', 'planning', 'celebration', 'romantic'],
    },
    config: TEMPLATE_WEDDING_PLANNER,
  },
  {
    meta: {
      id: 'coworking-space',
      title: 'Coworking Space',
      description: 'Coworking space with amenities, flexible desk/office plans, space gallery, and tour CTA.',
      category: 'professional',
      icon: '🏢',
      tags: ['professional', 'coworking', 'office', 'workspace', 'remote'],
    },
    config: TEMPLATE_COWORKING_SPACE,
  },
  {
    meta: {
      id: 'crypto-defi',
      title: 'Crypto DeFi',
      description: 'DeFi protocol landing with TVL stats, yield features, protocol fees, and security FAQ.',
      category: 'saas',
      icon: '🔗',
      tags: ['saas', 'crypto', 'defi', 'blockchain', 'yield'],
    },
    config: TEMPLATE_CRYPTO_DEFI,
  },
];

export const LANDING_TEMPLATES = new Map<string, { meta: LandingTemplateMeta; config: AppConfig }>(
  ALL_TEMPLATES.map(t => [t.meta.id, t]),
);

/** Get a landing template by ID (returns a deep clone) */
export function getLandingTemplate(id: string): AppConfig {
  const entry = LANDING_TEMPLATES.get(id);
  if (!entry) throw new Error(`Landing template "${id}" not found`);
  return structuredClone(entry.config);
}

/** List all available landing templates with metadata */
export function listLandingTemplates(): LandingTemplateMeta[] {
  return ALL_TEMPLATES.map(t => t.meta);
}

/** List landing templates filtered by category */
export function listLandingTemplatesByCategory(category: LandingTemplateCategory): LandingTemplateMeta[] {
  return ALL_TEMPLATES.filter(t => t.meta.category === category).map(t => t.meta);
}
