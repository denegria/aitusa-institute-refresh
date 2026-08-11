import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { siteData } from "../src/content.js";

describe("homepage community gallery", () => {
  it("keeps the published testimonial videos and their real durations", () => {
    const { testimonials } = siteData;

    assert.ok(testimonials.length >= 3);
    assert.equal(testimonials.find((item) => item.name === "Testimonio internacional")?.duration, "0:46");
    assert.equal(testimonials.find((item) => item.name === "Eric")?.duration, "0:42");
    assert.equal(testimonials.find((item) => item.name === "Jessica")?.duration, "2:52");

    for (const item of testimonials) {
      assert.match(item.video, /^\/assets\/wix\/videos\/.+\.mp4$/);
      assert.match(item.videoPoster, /^\/assets\/wix\/videos\/posters\/.+\.jpg$/);
    }
  });

  it("organizes every gallery image into accessible editorial views", () => {
    const { communityGallery } = siteData;

    assert.deepEqual(
      communityGallery.tabs.map((tab) => tab.id),
      ["classroom", "graduations", "celebrations", "stories"],
    );
    assert.equal(communityGallery.tabs[0].label, "En clase");
    assert.equal(communityGallery.tabs.at(-1).label, "Entrevistas en inglés");
    assert.match(communityGallery.introduction, /Clases reales, graduaciones, celebraciones y entrevistas en inglés/);
    assert.equal(communityGallery.stories.length, 0);
    assert.equal(communityGallery.graduations.length, 27);
    assert.ok(communityGallery.celebrations.length >= 20);
    assert.ok(communityGallery.classroom.length >= 5);

    const uniquePhotos = new Map();
    for (const tab of communityGallery.tabs) {
      for (const photo of communityGallery[tab.id]) uniquePhotos.set(photo.id, photo);
    }
    assert.equal(uniquePhotos.size, 54);
    for (const photo of uniquePhotos.values()) {
      assert.match(photo.src, /^\/assets\/gallery\/photos\/\d{4}\.webp$/);
      assert.ok(photo.alt.length > 20);
    }
  });

  it("renders keyboard tabs, no-JS video links, and both media dialogs", async () => {
    const source = await readFile("app/_components/site/InteractiveSections.jsx", "utf8");

    assert.match(source, /export function ProofStories/);
    assert.match(source, /community-proof__tabs/);
    assert.match(source, /role="tablist"/);
    assert.match(source, /role="tab"/);
    assert.match(source, /role="tabpanel"/);
    assert.match(source, /event\.key === "ArrowRight"/);
    assert.match(source, /event\.key === "ArrowLeft"/);
    assert.match(source, /href=\{activeStoryCycle\.video\}/);
    assert.match(source, /sideStories\.map/);
    assert.match(source, /community-proof__tile community-proof__tile--video/);
    assert.match(source, /aria-label=\{`Ver entrevista en inglés con/);
    assert.match(source, /className="proof-dialog"/);
    assert.match(source, /className="community-lightbox"/);
    assert.match(source, /Array\.from\(\{ length: 2 \}/);
    assert.match(source, /featuredGraduationIds = \["0031", "0022", "0033", "0028"\]/);
    assert.match(source, /communityGallery\.graduations\.findIndex/);
    assert.match(source, /Ver todas las graduaciones recientes/);
    assert.doesNotMatch(source, /community-proof__explore/);
    assert.match(source, /video\?\.pause\(\)/);
    assert.match(source, /triggerRef\.current\?\.focus\(\)/);
    assert.doesNotMatch(source, /video\.play\(\)/);
    assert.doesNotMatch(source, /autoPlay|autoplay/);
  });

  it("cycles visible imagery and reveals the section without overriding reduced motion", async () => {
    const source = await readFile("app/_components/site/InteractiveSections.jsx", "utf8");
    const styles = await readFile("src/styles.css", "utf8");

    assert.match(source, /IntersectionObserver/);
    assert.match(source, /bounds\.bottom > 0 && bounds\.top < window\.innerHeight/);
    assert.match(source, /threshold: 0\.02/);
    assert.match(source, /setActiveTab\(\(currentTab\)/);
    assert.match(source, /COMMUNITY_TAB_CYCLE_MS = 8000/);
    assert.match(source, /COMMUNITY_PHOTO_CYCLE_MS = 2600/);
    assert.match(source, /activeTab, setActiveTab] = useState\("classroom"\)/);
    assert.match(source, /activeTab === "graduations" \|\| activeTab === "celebrations"/);
    assert.match(source, /setMediaCycleIndex\(\(index\) => index \+ 1\)/);
    assert.match(source, /community-proof__photo-count/);
    assert.match(source, /is-auto-cycling/);
    assert.match(source, /prefers-reduced-motion: reduce/);
    assert.match(source, /interactionPaused/);
    assert.match(source, /hoverPaused/);
    assert.match(source, /focusPaused/);
    assert.match(styles, /\.community-proof__stage\s*\{[\s\S]*grid-template-columns: minmax\(0, 1\.78fr\) minmax\(250px, 1fr\)/);
    assert.match(styles, /\.community-proof__mosaic\s*\{[\s\S]*grid-template-columns: minmax\(0, 1fr\)[\s\S]*grid-template-rows: repeat\(2, minmax\(0, 1fr\)\)/);
    assert.match(styles, /\.community-proof__wall\s*\{[\s\S]*grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
    assert.match(styles, /\.community-proof__wall-tile\s*\{[\s\S]*aspect-ratio: 3 \/ 4/);
    assert.match(styles, /filter: brightness\(1\.045\) contrast\(1\.055\) saturate\(\.94\)/);
    assert.doesNotMatch(styles, /\.community-proof__wall-tile:nth-child/);
    assert.match(styles, /\.community-proof\.is-visible \.community-proof__heading/);
    assert.match(styles, /@keyframes communityMediaIn/);
    assert.match(styles, /@keyframes communityTileReveal/);
    assert.match(styles, /@keyframes communityTabProgress/);
    assert.match(styles, /@media \(max-width: 719px\)[\s\S]*\.community-proof__tabs\s*\{[\s\S]*overflow-x: auto/);
    assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation: none/);
  });

  it("prioritizes practical homepage FAQ questions without repeating the same schedule objection", async () => {
    const { faqs } = siteData;
    const source = await readFile("app/_components/site/InteractiveSections.jsx", "utf8");

    assert.equal(faqs.length, 7);
    assert.ok(faqs.some((faq) => faq.question.includes("otro país")));
    assert.ok(faqs.some((faq) => faq.question.includes("no puedo asistir")));
    assert.equal(faqs.filter((faq) => /Trabajo todo el día|No tengo mucho tiempo/.test(faq.question)).length, 1);
    assert.match(source, /\{faqs\.map\(\(faq, index\) => \(/);
    assert.doesNotMatch(source, /faqs\.slice\(0, 6\)/);
  });
});
