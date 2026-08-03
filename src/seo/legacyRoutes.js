export const CANONICAL_ORIGIN = "https://www.aitusainstitute.com";
export const LEGACY_ENGLISH_HOST = "en.aitusainstitute.com";

export const LEGACY_REDIRECTS = [
  { source: "/copy-of-terms-of-use", destination: "/privacy-policy" },
  { source: "/terms-of-use", destination: "/terms-and-conditions" },
  { source: "/contact-8", destination: "/contactanos" },
  { source: "/copy-of-contáctanos", destination: "/cursos/ingles-online-adultos/" },
  { source: "/copy-of-inscripciones", destination: "/contactanos" },
  { source: "/copy-of-ofertas", destination: "/contactanos" },
  { source: "/inscripciones", destination: "/contactanos" },
  { source: "/copy-of-computacion", destination: "/cursos/computacion-basica/" },
  { source: "/copy-of-computacion-1", destination: "/cursos/computacion-oficina/" },
  { source: "/copy-of-computacion-para-oficina", destination: "/cursos/reparacion-computadoras/" },
  { source: "/copy-of-ged-matematicas", destination: "/cursos/ged/" },
  { source: "/copy-of-ged-matematicas-1", destination: "/cursos/tutorias-matematicas/" },
  { source: "/copy-of-español-para-americanos", destination: "/cursos/espanol-extranjeros/" },
  { source: "/copy-of-ingles", destination: "/cursos/ingles-jovenes-adultos/" },
  { source: "/copy-of-ingles-1", destination: "/cursos/ingles-online-adultos/" },
  { source: "/copy-of-ingles-para-jovenes-adultos", destination: "/cursos/ingles-online-adultos/" },
  { source: "/ingles-para-ninos", destination: "/cursos/ingles-ninos/" },
  { source: "/copy-of-ingles-para-ninos", destination: "/cursos/ingles-ninos/" },
  { source: "/cursos-1", destination: "/cursos/" },
  { source: "/nosotros", destination: "/#metodo" },
  { source: "/aulas-vivas", destination: "/#metodo" },
  { source: "/product-page/ingles-nivel-basico", destination: "/cursos/ingles-online-adultos/" },
  { source: "/product-page/europa-mes-4weeks", destination: "/cursos/ingles-online-adultos/" },
  { source: "/product-page/copy-of-ingles", destination: "/contactanos" },
  { source: "/product-page/ingles-costo-promocional-para-colombia", destination: "/contactanos" },
  { source: "/product-page/libro", destination: "/contactanos" },
];

const redirectBySource = new Map(
  LEGACY_REDIRECTS.map(({ source, destination }) => [source.normalize("NFC"), destination]),
);

const exactGonePaths = new Set(["/descargas", "/landing-page", "/events"]);

export function normalizeLegacyPath(pathname) {
  try {
    return decodeURIComponent(pathname).normalize("NFC");
  } catch {
    return pathname.normalize("NFC");
  }
}

export function getLegacyDestination(pathname) {
  return redirectBySource.get(normalizeLegacyPath(pathname)) || null;
}

export function isLegacyGonePath(pathname) {
  const normalized = normalizeLegacyPath(pathname);
  return exactGonePaths.has(normalized) || normalized.startsWith("/events-1/");
}
