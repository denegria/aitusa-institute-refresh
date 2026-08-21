import { notFound } from "next/navigation";
import { PlacementQaFixture } from "../../../_components/site/PlacementExperience";
import { SiteHeader } from "../../../_components/site/SiteChrome";
import { site } from "../../../../src/content";
import {
  createPlacementQaFixture,
  isPlacementQaFixtureAvailable,
} from "../../../../src/diagnostic/qaFixture";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Placement QA Fixture | AIT USA Institute",
  robots: { index: false, follow: false },
};

export default async function PlacementQaFixturePage({ searchParams }) {
  if (!isPlacementQaFixtureAvailable()) notFound();
  const query = await searchParams;
  const fixture = createPlacementQaFixture({
    state: query?.state,
    channel: query?.channel,
  });

  return (
    <>
      <SiteHeader activePage="placement" />
      <main className="placement-page" id="main-content" data-placement-qa-state={fixture.state}>
        <section className="section placement-page__app" id="placement-test">
          <PlacementQaFixture fixture={fixture} />
        </section>
        <nav className="placement-utility" aria-label="Ayuda y documentos legales">
          <a href={site.legalLinks.contact}>Ayuda</a>
          <a href={site.legalLinks.privacy}>Privacidad</a>
          <a href={site.legalLinks.terms}>Términos</a>
        </nav>
      </main>
    </>
  );
}
