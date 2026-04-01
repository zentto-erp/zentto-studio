// @zentto/studio-core — Google Fonts loader utility

const loadedFonts = new Set<string>();

export function loadGoogleFont(fontFamily: string, weights: number[] = [400, 500, 600, 700]): void {
  if (loadedFonts.has(fontFamily)) return;
  loadedFonts.add(fontFamily);

  const weightsStr = weights.join(';');
  const encoded = encodeURIComponent(fontFamily);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encoded}:wght@${weightsStr}&display=swap`;
  document.head.appendChild(link);
}

export function loadGoogleFonts(fonts: string[]): void {
  fonts.forEach(f => loadGoogleFont(f));
}

export const POPULAR_FONTS = [
  'Inter', 'Poppins', 'Roboto', 'Open Sans', 'Montserrat', 'Lato',
  'Playfair Display', 'Merriweather', 'Source Sans 3', 'Raleway',
  'DM Sans', 'Space Grotesk', 'Plus Jakarta Sans', 'Outfit',
] as const;
