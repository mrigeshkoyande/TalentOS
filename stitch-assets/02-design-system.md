---
name: Obsidian Intellect
colors:
  surface: '#11131b'
  surface-dim: '#11131b'
  surface-bright: '#373942'
  surface-container-lowest: '#0c0e16'
  surface-container-low: '#1a1b23'
  surface-container: '#1e1f27'
  surface-container-high: '#282932'
  surface-container-highest: '#33343d'
  on-surface: '#e2e1ed'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e2e1ed'
  inverse-on-surface: '#2f3039'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#a4cbeb'
  on-secondary: '#01344e'
  secondary-container: '#214a66'
  on-secondary-container: '#93bad9'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#cae6ff'
  secondary-fixed-dim: '#a4cbeb'
  on-secondary-fixed: '#001e2f'
  on-secondary-fixed-variant: '#214a66'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#11131b'
  on-background: '#e2e1ed'
  surface-variant: '#33343d'
typography:
  display-lg:
    fontFamily: Instrument Serif
    fontSize: 72px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-md:
    fontFamily: Instrument Serif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is engineered for a high-performance hiring intelligence platform. The brand personality is authoritative yet ethereal—merging the precision of enterprise software with the cinematic mystery of advanced artificial intelligence. It targets executive leadership and elite recruiters who require clarity amidst high-volume data.

The aesthetic follows a **Cinematic Dark Minimalism** approach. It leverages deep obsidian voids, razor-sharp typography, and "liquid glass" surfaces to create a sense of depth and prestige. The emotional response should be one of calm confidence, professional rigor, and futuristic sophistication, drawing inspiration from the focused utility of developer tools and the expansive feeling of modern AI interfaces.

## Colors

This design system utilizes a high-contrast monochromatic core set against a deep, nocturnal foundation. 

- **Primary:** Pure white (#FFFFFF) is reserved for critical actions, headings, and active states to provide maximum legibility against the dark void.
- **Secondary:** A saturated deep teal (#00334D) derived from the background HSL provides subtle tonal shifts for interactive containers.
- **Neutral/Muted:** A desaturated slate gray (#A8A8B3) handles secondary information and metadata to maintain visual hierarchy.
- **Surface & Stroke:** The background is a dense, "midnight" blue-black. Borders are kept thin and dark (#2E2E2E) to maintain a structural but unobtrusive grid.

## Typography

The typographic strategy relies on a sharp contrast between the intellectual, editorial feel of **Instrument Serif** and the functional, systematic clarity of **Inter**. 

- **Display & Hero:** Use Instrument Serif for large headlines and "hero" moments to evoke a premium, cinematic feel. It should be set with tight letter spacing.
- **System & UI:** Use Inter for all functional elements, data visualization, and body copy. It provides the "Enterprise" reliability required for hiring workflows.
- **Labels:** Small labels and tags should use Inter Medium with slight tracking (letter-spacing) and uppercase styling to differentiate them from body text.

## Layout & Spacing

The design system employs a **Fixed Grid with Generous Margins** to create a cinematic "letterbox" effect on large displays. 

- **Grid:** A 12-column grid system with 24px gutters. Content is centered with a maximum width of 1440px.
- **Margins:** Large horizontal margins (64px+) on desktop create white space (or "dark space") that focuses the user's attention on the central intelligence data.
- **Rhythm:** A strict 4px baseline grid governs all internal component spacing, ensuring pixel-perfect alignment in dense data views.
- **Mobile:** Transition to a fluid 4-column grid with 16px side margins. Typography scales down significantly to ensure the serif display faces do not break.

## Elevation & Depth

Depth in the design system is achieved through **Glassmorphism and Tonal Layering** rather than traditional drop shadows.

- **The Void:** The base background is the lowest level. 
- **Liquid Glass:** Primary containers and navigation bars use a semi-transparent background (approx. 40% opacity) with a high-density `backdrop-filter: blur(20px)`. 
- **Stroke Definition:** Instead of shadows, use 1px solid borders with low-opacity white (e.g., `rgba(255,255,255,0.1)`) to define the edges of surfaces. 
- **Interactive Elevation:** Upon hover, surfaces should increase in border brightness or gain a very subtle "ambient glow" (a diffused white shadow with < 5% opacity).

## Shapes

The shape language is **Soft yet Structured**. By using a `0.25rem` (4px) base radius, we maintain a professional, "engineered" look that feels modern without becoming too playful or casual.

- **Small Components:** Buttons, inputs, and tags use the base 4px radius.
- **Large Components:** Cards and modals use `rounded-lg` (8px) to create a clear distinction between the layout structure and the individual interactive elements.
- **Icons:** Icons should follow a linear, 2px stroke weight with slight rounding to match the UI's radius.

## Components

### Buttons
- **Primary:** Solid white background with near-black text. High contrast, no border.
- **Secondary (Liquid):** Semi-transparent background with a 1px white border (15% opacity). Subtle hover effect that increases background opacity.
- **Ghost:** No background, white text. Becomes Secondary on hover.

### Input Fields
- Dark backgrounds (slightly lighter than the page) with a persistent 1px border.
- Focus state: The border transitions to pure white, and a subtle "inner glow" appears.
- Monospaced fonts may be used for specific AI-generated data strings.

### Cards & Navigation
- Cards should utilize the "Liquid Glass" effect. 
- Headers within cards should use a subtle bottom border to separate metadata from the body.
- Navigation items use high-contrast white text for active states and muted slate for inactive states.

### Chips & Badges
- Small, rectangular with the 4px radius. 
- Use subtle background tints (e.g., deep teals or indigos) to categorize talent status without breaking the dark aesthetic.

### AI Intelligence Markers
- Components that represent "AI-powered" insights should use a subtle, animated gradient border or a "shimmer" effect to indicate active processing or premium data.
