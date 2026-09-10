# Approved classroom hero — design QA

final result: passed

Final post-adjustment full-view and focused comparisons pass. Prior course/homepage audit history is preserved in `docs/design-qa-before-classroom-hero.md`.

## Comparison target

- Source visual truth: `C:/Users/Alvaro/.codex/generated_images/01a08d43-5039-7aa2-9980-cf756c2d8bc4/exec-24c75d42-dcc4-480b-b9e6-26be872a6e10.png`.
- Archived source: `C:/Users/Alvaro/.codex/visualizations/2026/09/05/01a06fdf-2c71-7af3-a8b4-d49b238a3e17/aitusa-approved-classroom-hero-release/approved-reference.png`.
- Implementation: `http://127.0.0.1:3026/`, Next.js production build, initial unscrolled Spanish homepage, menu closed.
- Exact viewport: 1505 × 1045 CSS pixels, density 1. Source and deterministic implementation PNG both 1505 × 1045 pixels; no density rescaling.
- Latest deterministic implementation: `C:/Users/Alvaro/.codex/visualizations/2026/09/05/01a06fdf-2c71-7af3-a8b4-d49b238a3e17/aitusa-approved-classroom-hero-release/hero-qa/desktop-1505.png`.
- Codex in-app evidence: `C:/Users/Alvaro/.codex/visualizations/2026/09/05/01a06fdf-2c71-7af3-a8b4-d49b238a3e17/aitusa-approved-classroom-hero-release/desktop-final.png` (explicit screenshot clip 1505 × 1045). The first un-clipped in-app snapshot was a scaled JPEG and is excluded from precise pixel comparison.
- Full source and latest render were opened together in one comparison input. Focused combined regions, source above implementation: `C:/Users/Alvaro/.codex/visualizations/2026/09/05/01a06fdf-2c71-7af3-a8b4-d49b238a3e17/aitusa-approved-classroom-hero-release/comparison-header.png`, `comparison-copy.png`, `comparison-facts.png`.

## Findings and comparison history

1. [P2, resolved] Initial facts strip extended below the selected frame. Reduced the lower scene and strip padding; the chapter now ends at approximately y1046, matching the y1045 reference within rounding. Text remains in normal flow; there is no fixed-height clipping.
2. [P1, resolved] Initial development browser session had not hydrated the icon runtime. Switched verification to the production build. All five hero icons, account/phone/menu controls, and interactive navigation render; no runtime errors. No application workaround or dependency change was needed.
3. [P2, resolved] Mobile announcement artwork was enlarged behind its text, the headline wrapped awkwardly, and inherited CSS hid INSTITUTE. Kept the ribbon art in a 48px decorative rail, separated the welcome sentence below it, restored the wordmark, and retained three deliberate headline lines. Evidence: mobile-pass2.png before, mobile-pass3.png and hero-qa/mobile-390.png after.
4. [P2, resolved] At 200% text, a layout without overflow still put white copy over bright glass. Added a font-relative container breakpoint so enlarged text uses the stacked composition. Also kept the skip link fully off-screen until focus. Evidence: hero-qa/enlarged-200.png, with navy behind all copy.
5. [P2, resolved] At 1280px the eyebrow could reach a bright window. Bounded its desktop width and added a restrained text shadow. It wraps safely before the window; mobile uses its own reading width. Evidence: hero-qa/desktop-1280.png.
6. [P2, resolved] Focused CTA comparison showed its text and arrow were aligned to opposing edges, while the reference centers the group. Centered that group inside the original 346px outlined control; the final combined `comparison-copy.png` confirms the centered group.

## Required fidelity surfaces

- **Fonts and typography:** retained the site's Plus Jakarta Sans, verified loaded in the browser. H1 is approximately 80.5px/73.3px at the source width, weight 800, three lines, normal Spanish capitalization. Supporting copy is live text, 22px with a deliberate two-line desktop wrap. Rem-based text honors font preferences. Small optical differences from generated lettering are P3.
- **Spacing and layout rhythm:** 83px white header, 73px announcement, approximately 767px classroom chapter, approximately 123px institutional strip. Copy begins near x184; photography occupies the whole scene with people to the right. Min-height expands with content. Mobile/tablet use an intentional multi-viewport chapter with copy followed by the people and a two-column facts strip.
- **Colors and tokens:** navy #001b3e, white copy, yellow/gold highlights, blue navigation and orange wordmark/account accent. The blue-glass imagery, gold beam and map are generated raster assets, not CSS/SVG drawings. Hover and high-contrast keyboard-focus states are present. Enlarged text gets a solid navy surface.
- **Image quality:** new teacher and three adult students, blank whiteboard, no AIT wall sign, people-free copy area. Classroom WebP is 141074 bytes; ribbon WebP is 18750 bytes. Generated reconstruction retains small fine-detail differences from the mock, classified P3. It is decorative illustration, not documentary student evidence; existing real proof remains below.
- **Copy and content:** exact approved Spanish headline, promise, location, announcement, CTA, format names, and four institutional facts. Existing location-count derivation and qualifications are retained. No new educational, operational, or results claims. All copy and controls are HTML, independently selectable and operable.
- **Icons/brand:** supplied circular AIT logo reused unchanged. Existing Lucide icon library matches the line-icon family; no logo recreation or handwritten SVG. The reference's filled map pin versus outlined library pin is a P3 optical difference.

## Browser acceptance and verification

- [x] Desktop 1505 × 1045 and 1280 × 900, tablet 768 × 1024, mobile 390 × 844 and 320 × 812.
- [x] 200% text at 1280 × 900: stacked composition, no horizontal overflow or clipped controls.
- [x] All hero actions at least 44px tall; mobile controls remain within the viewport.
- [x] Menu opens, Escape closes it, focus returns to the trigger; verified through real keyboard input in Codex browser and deterministic browser QA.
- [x] Level-test CTA opens `/placement-test/` with the existing assessment intro and account/verification disclosure; no form submitted.
- [x] Three format links retain their existing course destinations; course, admissions, Method, FAQ, legal, and portal-entry regressions covered by release surfaces.
- [x] Reduced-motion verification; no new animation. Decorative photo has empty alt and is hidden from assistive technology; Spanish H1 and landmark labels are real semantics.
- [x] No browser runtime exceptions or in-app warning/error logs on the production candidate.
- [x] `npm run validate`: repository and asset integrity, 357 tests, production build.
- [x] Final candidate release-surface rerun: 40 screenshots pass. Live staging metadata/render verification is recorded separately in the release packet after publication.

## Follow-up polish and confirmation

Final recapture has no unresolved P0/P1/P2 product issue. P3 only: generated fine details, minor font optical differences and facts alignment versus raster lettering, outline versus filled map pin. No new business-content confirmation is needed for this approved scope. Safari/Firefox and real-device testing were not performed; Chromium desktop/mobile emulation is the tested coverage. Sentry is unavailable through the connected tools, so this report makes no claim about hosted telemetry health.
