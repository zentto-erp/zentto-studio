// @zentto/studio-core — Landing page i18n system
// Translates landing page configs between locales
// Templates ship with EN text; this module provides ES translations and a translator utility

import type {
  AppConfig, LandingSection, LandingConfig, LandingLocale,
  HeroSectionConfig, FeaturesSectionConfig, PricingSectionConfig,
  TestimonialsSectionConfig, CtaSectionConfig, StatsSectionConfig,
  FaqSectionConfig, TeamSectionConfig, GallerySectionConfig,
  LogosSectionConfig, ContentSectionConfig, VideoSectionConfig,
  ContactSectionConfig,
} from '../app-types.js';

// ─── Common UI translations ─────────────────────────────────────

export const LANDING_UI_STRINGS: Record<string, Record<string, string>> = {
  es: {
    'cta.getStarted': 'Comenzar',
    'cta.learnMore': 'Saber mas',
    'cta.startNow': 'Empezar ahora',
    'cta.startFree': 'Empezar gratis',
    'cta.tryFree': 'Probar gratis',
    'cta.signUp': 'Registrarse',
    'cta.contactUs': 'Contactanos',
    'cta.viewDemo': 'Ver demo',
    'cta.viewPlans': 'Ver planes',
    'cta.viewAll': 'Ver todo',
    'cta.readMore': 'Leer mas',
    'cta.subscribe': 'Suscribirse',
    'cta.download': 'Descargar',
    'cta.bookDemo': 'Agendar demo',
    'cta.bookNow': 'Reservar ahora',
    'cta.applyNow': 'Aplicar ahora',
    'cta.enrollNow': 'Inscribirse',
    'cta.donate': 'Donar',
    'cta.joinUs': 'Unete',
    'cta.start': 'Empezar',
    'cta.viewGallery': 'Ver galeria',
    'cta.seeWork': 'Ver trabajo',
    'cta.viewMenu': 'Ver menu',
    'cta.exploreListings': 'Explorar propiedades',

    'section.features': 'Caracteristicas',
    'section.pricing': 'Precios',
    'section.testimonials': 'Testimonios',
    'section.faq': 'Preguntas frecuentes',
    'section.team': 'Nuestro equipo',
    'section.gallery': 'Galeria',
    'section.contact': 'Contacto',
    'section.blog': 'Blog',
    'section.about': 'Sobre nosotros',
    'section.services': 'Servicios',
    'section.portfolio': 'Portafolio',

    'pricing.month': '/mes',
    'pricing.year': '/ano',
    'pricing.basic': 'Basico',
    'pricing.pro': 'Pro',
    'pricing.enterprise': 'Empresa',
    'pricing.starter': 'Inicio',
    'pricing.free': 'Gratis',
    'pricing.popular': 'Popular',
    'pricing.recommended': 'Recomendado',
    'pricing.chooseYourPlan': 'Elige tu plan',
    'pricing.allPlansInclude': 'Todos los planes incluyen',

    'footer.allRightsReserved': 'Todos los derechos reservados',
    'footer.company': 'Empresa',
    'footer.product': 'Producto',
    'footer.resources': 'Recursos',
    'footer.support': 'Soporte',
    'footer.legal': 'Legal',
    'footer.privacy': 'Privacidad',
    'footer.terms': 'Terminos',

    'nav.home': 'Inicio',
    'nav.about': 'Nosotros',
    'nav.features': 'Caracteristicas',
    'nav.pricing': 'Precios',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'nav.faq': 'FAQ',
    'nav.team': 'Equipo',
    'nav.gallery': 'Galeria',
    'nav.menu': 'Menu',
    'nav.courses': 'Cursos',
    'nav.listings': 'Propiedades',

    'stats.customers': 'Clientes',
    'stats.users': 'Usuarios',
    'stats.countries': 'Paises',
    'stats.uptime': 'Disponibilidad',
    'stats.satisfaction': 'Satisfaccion',
    'stats.projects': 'Proyectos',
    'stats.yearsExperience': 'Anos de experiencia',
    'stats.teamMembers': 'Miembros del equipo',
    'stats.downloads': 'Descargas',

    'faq.howDoesItWork': 'Como funciona?',
    'faq.isThereFreeTrial': 'Hay prueba gratuita?',
    'faq.canICancel': 'Puedo cancelar en cualquier momento?',
    'faq.doYouOfferSupport': 'Ofrecen soporte?',
    'faq.isMyDataSecure': 'Mis datos estan seguros?',

    'misc.trustedBy': 'La confianza de las mejores empresas',
    'misc.readyToStart': 'Listo para empezar?',
    'misc.joinThousands': 'Unete a miles de clientes satisfechos.',
    'misc.everythingYouNeed': 'Todo lo que necesitas',
    'misc.meetTheTeam': 'Conoce al equipo',
    'misc.whatPeopleSay': 'Lo que dicen nuestros clientes',
    'misc.ourImpact': 'Nuestro impacto',
    'misc.watchDemo': 'Mira nuestro demo',
    'misc.commonQuestions': 'Preguntas comunes',
  },
  en: {}, // EN is the base language, no translations needed
  pt: {
    'cta.getStarted': 'Comecar',
    'cta.learnMore': 'Saiba mais',
    'cta.startNow': 'Comecar agora',
    'cta.contactUs': 'Contate-nos',
    'section.features': 'Recursos',
    'section.pricing': 'Precos',
    'section.testimonials': 'Depoimentos',
    'section.faq': 'Perguntas frequentes',
    'section.team': 'Nossa equipe',
    'section.contact': 'Contato',
    'footer.allRightsReserved': 'Todos os direitos reservados',
    'misc.readyToStart': 'Pronto para comecar?',
  },
};

// ─── CTA label translation map (EN → ES) ───────────────────────

const CTA_EN_TO_ES: Record<string, string> = {
  'Get Started': 'Comenzar',
  'Learn More': 'Saber mas',
  'Start Now': 'Empezar ahora',
  'Start Free': 'Empezar gratis',
  'Start Free Trial': 'Prueba gratuita',
  'Try Free': 'Probar gratis',
  'Try It Free': 'Probar gratis',
  'Sign Up': 'Registrarse',
  'Sign Up Free': 'Registro gratuito',
  'Contact Us': 'Contactanos',
  'Contact Sales': 'Contactar ventas',
  'View Demo': 'Ver demo',
  'Watch Demo': 'Ver demo',
  'Book a Demo': 'Agendar demo',
  'Book Demo': 'Agendar demo',
  'Book Now': 'Reservar ahora',
  'Book a Table': 'Reservar mesa',
  'View Plans': 'Ver planes',
  'View All': 'Ver todo',
  'View Projects': 'Ver proyectos',
  'View Work': 'Ver trabajo',
  'See Our Work': 'Ver nuestro trabajo',
  'Read More': 'Leer mas',
  'Subscribe': 'Suscribirse',
  'Download': 'Descargar',
  'Download App': 'Descargar app',
  'Download Now': 'Descargar ahora',
  'Get the App': 'Obtener la app',
  'Apply Now': 'Aplicar ahora',
  'Enroll Now': 'Inscribirse',
  'Donate': 'Donar',
  'Donate Now': 'Donar ahora',
  'Join Us': 'Unete',
  'Join Now': 'Unirse ahora',
  'Start': 'Empezar',
  'Start Building': 'Empezar a crear',
  'Explore': 'Explorar',
  'Explore Listings': 'Explorar propiedades',
  'View Gallery': 'Ver galeria',
  'View Menu': 'Ver menu',
  'View Courses': 'Ver cursos',
  'Browse Catalog': 'Ver catalogo',
  'Shop Now': 'Comprar ahora',
  'Add to Cart': 'Agregar al carrito',
  'Buy Now': 'Comprar ahora',
  'Register': 'Registrarse',
  'Register Now': 'Registrarse ahora',
  'Get Tickets': 'Obtener entradas',
  'RSVP': 'Confirmar asistencia',
  'Schedule Visit': 'Agendar visita',
  'Request Quote': 'Solicitar cotizacion',
  'Get a Quote': 'Solicitar cotizacion',
  'Free Consultation': 'Consulta gratuita',
  'Schedule Consultation': 'Agendar consulta',
  'View Pricing': 'Ver precios',
  'See Pricing': 'Ver precios',
};

const CTA_EN_TO_PT: Record<string, string> = {
  'Get Started': 'Comecar',
  'Learn More': 'Saiba mais',
  'Start Now': 'Comecar agora',
  'Contact Us': 'Contate-nos',
  'Sign Up': 'Cadastrar-se',
  'Subscribe': 'Inscrever-se',
  'Download': 'Baixar',
  'Book Now': 'Reservar agora',
};

// ─── Translation engine ─────────────────────────────────────────

/**
 * Translate all text fields in a landing AppConfig to the target locale.
 * Modifies the config in place and returns it.
 */
export function translateLandingConfig(config: AppConfig, targetLocale: LandingLocale): AppConfig {
  if (targetLocale === 'en') return config; // EN is the source language

  const result = structuredClone(config);

  // Set locale
  if (!result.landingConfig) result.landingConfig = {};
  result.landingConfig.locale = targetLocale;

  const ctaMap = targetLocale === 'es' ? CTA_EN_TO_ES
    : targetLocale === 'pt' ? CTA_EN_TO_PT
    : CTA_EN_TO_ES; // fallback to ES

  // Translate navbar
  if (result.landingConfig?.navbar) {
    const nav = result.landingConfig.navbar;
    if (nav.links) {
      nav.links = nav.links.map(link => ({
        ...link,
        label: translateNavLabel(link.label, targetLocale),
      }));
    }
    if (nav.ctaButton) {
      nav.ctaButton.label = ctaMap[nav.ctaButton.label] ?? nav.ctaButton.label;
    }
  }

  // Translate footer
  if (result.landingConfig?.footer) {
    const footer = result.landingConfig.footer;
    if (footer.copyright) {
      footer.copyright = footer.copyright
        .replace('All rights reserved', targetLocale === 'es' ? 'Todos los derechos reservados' : 'Todos os direitos reservados');
    }
    if (footer.columns) {
      footer.columns = footer.columns.map(col => ({
        ...col,
        title: translateFooterTitle(col.title, targetLocale),
      }));
    }
    if (footer.newsletter?.buttonLabel) {
      footer.newsletter.buttonLabel = ctaMap[footer.newsletter.buttonLabel] ?? footer.newsletter.buttonLabel;
    }
  }

  // Translate sections
  if (result.pages?.[0]?.landingSections) {
    result.pages[0].landingSections = result.pages[0].landingSections.map(s => translateSection(s, targetLocale, ctaMap));
  }

  return result;
}

function translateSection(section: LandingSection, locale: LandingLocale, ctaMap: Record<string, string>): LandingSection {
  const s = { ...section };

  switch (s.type) {
    case 'hero':
      if (s.heroConfig) {
        const h = { ...s.heroConfig };
        if (h.primaryCta) h.primaryCta = { ...h.primaryCta, label: ctaMap[h.primaryCta.label] ?? h.primaryCta.label };
        if (h.secondaryCta) h.secondaryCta = { ...h.secondaryCta, label: ctaMap[h.secondaryCta.label] ?? h.secondaryCta.label };
        s.heroConfig = h;
      }
      break;

    case 'features':
      if (s.featuresConfig) {
        const f = { ...s.featuresConfig };
        if (f.headline) f.headline = translateCommonHeadline(f.headline, locale);
        if (f.subtitle) f.subtitle = translateCommonSubtitle(f.subtitle, locale);
        s.featuresConfig = f;
      }
      break;

    case 'pricing':
      if (s.pricingConfig) {
        const p = { ...s.pricingConfig };
        if (p.headline) p.headline = translateCommonHeadline(p.headline, locale);
        if (p.subtitle) p.subtitle = translateCommonSubtitle(p.subtitle, locale);
        if (p.plans) {
          p.plans = p.plans.map(plan => ({
            ...plan,
            period: translatePeriod(plan.period, locale),
            cta: plan.cta ? { ...plan.cta, label: ctaMap[plan.cta.label] ?? plan.cta.label } : plan.cta,
            features: plan.features?.map(f => translateFeatureItem(f, locale)),
          }));
        }
        s.pricingConfig = p;
      }
      break;

    case 'testimonials':
      if (s.testimonialsConfig) {
        const t = { ...s.testimonialsConfig };
        if (t.headline) t.headline = translateCommonHeadline(t.headline, locale);
        s.testimonialsConfig = t;
      }
      break;

    case 'cta':
      if (s.ctaConfig) {
        const c = { ...s.ctaConfig };
        if (c.headline) c.headline = translateCommonHeadline(c.headline, locale);
        if (c.description) c.description = translateCommonSubtitle(c.description, locale);
        if (c.primaryCta) c.primaryCta = { ...c.primaryCta, label: ctaMap[c.primaryCta.label] ?? c.primaryCta.label };
        if (c.secondaryCta) c.secondaryCta = { ...c.secondaryCta, label: ctaMap[c.secondaryCta.label] ?? c.secondaryCta.label };
        s.ctaConfig = c;
      }
      break;

    case 'stats':
      if (s.statsConfig) {
        const st = { ...s.statsConfig };
        if (st.headline) st.headline = translateCommonHeadline(st.headline, locale);
        if (st.items) {
          st.items = st.items.map(item => ({
            ...item,
            label: translateStatLabel(item.label, locale),
          }));
        }
        s.statsConfig = st;
      }
      break;

    case 'faq':
      if (s.faqConfig) {
        const f = { ...s.faqConfig };
        if (f.headline) f.headline = translateCommonHeadline(f.headline, locale);
        if (f.subtitle) f.subtitle = translateCommonSubtitle(f.subtitle, locale);
        s.faqConfig = f;
      }
      break;

    case 'team':
      if (s.teamConfig) {
        const t = { ...s.teamConfig };
        if (t.headline) t.headline = translateCommonHeadline(t.headline, locale);
        if (t.subtitle) t.subtitle = translateCommonSubtitle(t.subtitle, locale);
        s.teamConfig = t;
      }
      break;

    case 'gallery':
      if (s.galleryConfig) {
        const g = { ...s.galleryConfig };
        if (g.headline) g.headline = translateCommonHeadline(g.headline, locale);
        s.galleryConfig = g;
      }
      break;

    case 'logos':
      if (s.logosConfig) {
        const l = { ...s.logosConfig };
        if (l.headline) l.headline = translateCommonHeadline(l.headline, locale);
        s.logosConfig = l;
      }
      break;

    case 'content':
      if (s.contentConfig) {
        const c = { ...s.contentConfig };
        if (c.headline) c.headline = translateCommonHeadline(c.headline, locale);
        s.contentConfig = c;
      }
      break;

    case 'video':
      if (s.videoConfig) {
        const v = { ...s.videoConfig };
        if (v.headline) v.headline = translateCommonHeadline(v.headline, locale);
        if (v.subtitle) v.subtitle = translateCommonSubtitle(v.subtitle, locale);
        s.videoConfig = v;
      }
      break;

    case 'contact':
      if (s.contactConfig) {
        const c = { ...s.contactConfig };
        if (c.headline) c.headline = translateCommonHeadline(c.headline, locale);
        if (c.subtitle) c.subtitle = translateCommonSubtitle(c.subtitle, locale);
        s.contactConfig = c;
      }
      break;
  }

  return s;
}

// ─── Common text translations ───────────────────────────────────

const HEADLINE_MAP_ES: Record<string, string> = {
  'Features': 'Caracteristicas',
  'Our Features': 'Nuestras caracteristicas',
  'Why Choose Us': 'Por que elegirnos',
  'What We Offer': 'Lo que ofrecemos',
  'How It Works': 'Como funciona',
  'Pricing': 'Precios',
  'Simple Pricing': 'Precios simples',
  'Choose Your Plan': 'Elige tu plan',
  'Transparent Pricing': 'Precios transparentes',
  'What People Say': 'Lo que dicen nuestros clientes',
  'What Our Clients Say': 'Lo que dicen nuestros clientes',
  'Testimonials': 'Testimonios',
  'Client Testimonials': 'Testimonios de clientes',
  'FAQ': 'Preguntas frecuentes',
  'Frequently Asked Questions': 'Preguntas frecuentes',
  'Common Questions': 'Preguntas comunes',
  'Our Team': 'Nuestro equipo',
  'Meet the Team': 'Conoce al equipo',
  'Meet Our Team': 'Conoce a nuestro equipo',
  'The Team': 'El equipo',
  'Gallery': 'Galeria',
  'Our Gallery': 'Nuestra galeria',
  'Our Work': 'Nuestro trabajo',
  'Portfolio': 'Portafolio',
  'Contact': 'Contacto',
  'Contact Us': 'Contactanos',
  'Get in Touch': 'Ponte en contacto',
  "Let's Talk": 'Hablemos',
  'About Us': 'Sobre nosotros',
  'About': 'Acerca de',
  'Our Story': 'Nuestra historia',
  'Our Impact': 'Nuestro impacto',
  'By the Numbers': 'En numeros',
  'Our Numbers': 'Nuestros numeros',
  'Key Metrics': 'Metricas clave',
  'Watch Our Demo': 'Mira nuestro demo',
  'See It in Action': 'Velo en accion',
  'Ready to Get Started?': 'Listo para empezar?',
  'Ready to get started?': 'Listo para empezar?',
  'Start Building Today': 'Empieza a crear hoy',
  'Get Started Today': 'Empieza hoy',
  'Join Us': 'Unete',
  'Start Your Journey': 'Comienza tu viaje',
  'Trusted by Leading Companies': 'La confianza de empresas lideres',
  'Trusted by leading companies': 'La confianza de empresas lideres',
  'Trusted by the best': 'La confianza de los mejores',
  'Our Services': 'Nuestros servicios',
  'Services': 'Servicios',
  'What We Do': 'Lo que hacemos',
  'Our Speakers': 'Nuestros ponentes',
  'Our Courses': 'Nuestros cursos',
  'Our Menu': 'Nuestro menu',
  'The Menu': 'El menu',
};

const SUBTITLE_MAP_ES: Record<string, string> = {
  'Everything you need': 'Todo lo que necesitas',
  'Everything you need to succeed': 'Todo lo que necesitas para triunfar',
  'Choose the plan that works for you': 'Elige el plan que mejor se adapte a ti',
  'Simple, transparent pricing': 'Precios simples y transparentes',
  'No hidden fees': 'Sin costos ocultos',
  'Meet the people behind the product': 'Conoce a las personas detras del producto',
  'Meet the people making it happen': 'Conoce a quienes lo hacen posible',
  'Common questions answered': 'Respuestas a preguntas comunes',
  'Got questions? We have answers': 'Tienes preguntas? Tenemos respuestas',
  'Join thousands of happy customers today.': 'Unete a miles de clientes satisfechos.',
  'Join thousands of happy customers.': 'Unete a miles de clientes satisfechos.',
  'Start your free trial today': 'Comienza tu prueba gratuita hoy',
  'We would love to hear from you': 'Nos encantaria escucharte',
  "We'd love to hear from you": 'Nos encantaria escucharte',
  'See how it works': 'Descubre como funciona',
};

const NAV_LABEL_MAP_ES: Record<string, string> = {
  'Home': 'Inicio', 'About': 'Nosotros', 'Features': 'Caracteristicas',
  'Pricing': 'Precios', 'Blog': 'Blog', 'Contact': 'Contacto',
  'FAQ': 'FAQ', 'Team': 'Equipo', 'Gallery': 'Galeria',
  'Menu': 'Menu', 'Services': 'Servicios', 'Portfolio': 'Portafolio',
  'Courses': 'Cursos', 'Listings': 'Propiedades', 'Speakers': 'Ponentes',
  'Schedule': 'Agenda', 'Sponsors': 'Patrocinadores', 'Testimonials': 'Testimonios',
  'Work': 'Trabajo', 'Process': 'Proceso', 'Clients': 'Clientes',
  'Classes': 'Clases', 'Reviews': 'Resenas', 'Programs': 'Programas',
};

const FOOTER_TITLE_MAP_ES: Record<string, string> = {
  'Company': 'Empresa', 'Product': 'Producto', 'Resources': 'Recursos',
  'Support': 'Soporte', 'Legal': 'Legal', 'Quick Links': 'Enlaces rapidos',
  'Navigation': 'Navegacion', 'Connect': 'Conectar', 'Social': 'Social',
  'Follow Us': 'Siguenos', 'Hours': 'Horarios', 'Location': 'Ubicacion',
  'Contact': 'Contacto', 'About': 'Acerca de', 'Services': 'Servicios',
};

const STAT_LABEL_MAP_ES: Record<string, string> = {
  'Customers': 'Clientes', 'Users': 'Usuarios', 'Countries': 'Paises',
  'Uptime': 'Disponibilidad', 'Satisfaction': 'Satisfaccion',
  'Projects': 'Proyectos', 'Team Members': 'Miembros del equipo',
  'Years': 'Anos', 'Downloads': 'Descargas', 'Happy Clients': 'Clientes felices',
  'Reviews': 'Resenas', 'Awards': 'Premios', 'Classes': 'Clases',
  'Members': 'Miembros', 'Active Users': 'Usuarios activos',
  'Locations': 'Ubicaciones', 'Avg Rating': 'Calificacion promedio',
  'Daily Active': 'Activos diarios', 'Data Points': 'Datos',
  'Integrations': 'Integraciones', 'API Calls': 'Llamadas API',
  'Students': 'Estudiantes', 'Partners': 'Socios', 'Countries Served': 'Paises atendidos',
  'Years Experience': 'Anos de experiencia', 'Clients Served': 'Clientes atendidos',
  'Active Members': 'Miembros activos', 'Properties Sold': 'Propiedades vendidas',
  'Average Sale Price': 'Precio promedio venta', 'Client Satisfaction': 'Satisfaccion cliente',
  'Repeat Clients': 'Clientes recurrentes', 'Lives Impacted': 'Vidas impactadas',
  'Children Educated': 'Ninos educados', 'Volunteers': 'Voluntarios',
  'Schools Built': 'Escuelas construidas', 'Placed Graduates': 'Graduados colocados',
  'Avg Salary Increase': 'Aumento salarial promedio', 'Hiring Partners': 'Socios empleadores',
  'Completion Rate': 'Tasa de finalizacion',
};

const PERIOD_MAP_ES: Record<string, string> = {
  '/mo': '/mes', '/month': '/mes', '/yr': '/ano', '/year': '/ano',
  '/week': '/semana', 'per month': 'por mes', 'per year': 'por ano',
};

function translateCommonHeadline(text: string, locale: LandingLocale): string {
  if (locale === 'es') return HEADLINE_MAP_ES[text] ?? text;
  return text;
}

function translateCommonSubtitle(text: string, locale: LandingLocale): string {
  if (locale === 'es') return SUBTITLE_MAP_ES[text] ?? text;
  return text;
}

function translateNavLabel(text: string, locale: LandingLocale): string {
  if (locale === 'es') return NAV_LABEL_MAP_ES[text] ?? text;
  return text;
}

function translateFooterTitle(text: string, locale: LandingLocale): string {
  if (locale === 'es') return FOOTER_TITLE_MAP_ES[text] ?? text;
  return text;
}

function translateStatLabel(text: string, locale: LandingLocale): string {
  if (locale === 'es') return STAT_LABEL_MAP_ES[text] ?? text;
  return text;
}

function translatePeriod(text: string | undefined, locale: LandingLocale): string | undefined {
  if (!text) return text;
  if (locale === 'es') return PERIOD_MAP_ES[text] ?? text;
  return text;
}

function translateFeatureItem(text: string, locale: LandingLocale): string {
  // Common pricing feature items
  if (locale !== 'es') return text;
  const MAP: Record<string, string> = {
    'Unlimited projects': 'Proyectos ilimitados',
    'Unlimited users': 'Usuarios ilimitados',
    'Unlimited storage': 'Almacenamiento ilimitado',
    'Priority support': 'Soporte prioritario',
    'Email support': 'Soporte por email',
    'Custom domain': 'Dominio personalizado',
    'API access': 'Acceso API',
    'Analytics': 'Analitica',
    'Advanced analytics': 'Analitica avanzada',
    'Custom integrations': 'Integraciones personalizadas',
    'SSO & SAML': 'SSO y SAML',
    'Dedicated account manager': 'Gerente de cuenta dedicado',
    'SLA guarantee': 'Garantia SLA',
    'White-label': 'Marca blanca',
    '24/7 support': 'Soporte 24/7',
    'Basic features': 'Funciones basicas',
    'All features': 'Todas las funciones',
  };
  return MAP[text] ?? text;
}

/**
 * Get available locales for landing templates
 */
export function getAvailableLandingLocales(): { code: LandingLocale; label: string; flag: string }[] {
  return [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Espanol', flag: '🇪🇸' },
    { code: 'pt', label: 'Portugues', flag: '🇧🇷' },
  ];
}
