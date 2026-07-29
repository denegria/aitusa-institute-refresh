import { ProofStories } from "../_components/site/InteractiveSections";
import {
  FaqSection,
  FinalCtaSection,
  HeroSection,
  LocationsSection,
  MethodSection,
  OfferingPathSection,
} from "../_components/site/PublicSections";
import { SiteFooter, SiteHeader } from "../_components/site/SiteChrome";
import { site } from "../../src/content";

export const metadata = {
  title: "AiT USA Institute | Aprende inglés con confianza en New Jersey",
  description:
    "Aprende inglés con el método Graphic Concept, práctica guiada, clases reales y opciones presenciales, híbridas u online.",
  keywords: site.seoKeywords,
  alternates: {
    canonical: "/",
    languages: {
      "es-US": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: "/",
    siteName: site.name,
    title: site.seoTitle,
    description: site.seoDescription,
    images: [{ url: site.seoImage, width: site.seoVideoWidth, height: site.seoVideoHeight, alt: site.seoImageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    site: site.twitterHandle,
    title: site.seoTitle,
    description: site.seoDescription,
    images: [site.seoImage],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${site.canonical}#organization`,
  name: site.name,
  alternateName: site.legal,
  url: site.canonical,
  logo: new URL(site.images.logo, site.canonical).toString(),
  description: site.seoDescription,
  telephone: site.phone,
  email: site.email,
  foundingDate: site.founded,
  sameAs: [site.facebookHref],
  address: site.locations.map((location) => ({
    "@type": "PostalAddress",
    ...location,
    geo: undefined,
  })),
};

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "@id": `${site.canonical}#videos-reales`,
  name: "Videos reales de AiT USA Institute",
  description: "Video introductorio con la experiencia, método y opciones de AiT USA Institute para decidir con claridad.",
  contentUrl: new URL(site.seoVideo, site.canonical).toString(),
  thumbnailUrl: [new URL(site.seoImage, site.canonical).toString()],
  duration: site.seoVideoDuration,
  uploadDate: "2026-06-22",
  publisher: { "@id": `${site.canonical}#organization` },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }} />
      <SiteHeader activePage="home" />
      <main id="main-content" className="home-page">
        <HeroSection />
        <MethodSection />
        <ProofStories />
        <OfferingPathSection />
        <LocationsSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
