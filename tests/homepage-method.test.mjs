import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { siteData } from "../src/content.js";

const selectedQuestions = [
  "¿Quieres hablar inglés rápido, fácil y sin estrés?",
  "¿Llevas tiempo intentando hablar inglés y todavía no lo logras?",
  "¿Te obligan a memorizar miles de palabras y sientes que no te alcanzan ni el tiempo ni la cabeza?",
];

describe("homepage Method and materials", () => {
  it("keeps the approved method identity, fundamentals, and original media", () => {
    const { methodNarrative, solutionCharacteristics } = siteData;

    assert.equal(methodNarrative.eyebrow, "Nuestra filosofía");
    assert.equal(methodNarrative.heading, "Primero comprendes. Después hablas.");
    assert.deepEqual(methodNarrative.headingLines, ["Primero comprendes.", "Después hablas."]);
    assert.equal(
      methodNarrative.introduction,
      "Durante más de 20 años hemos escuchado las necesidades y frustraciones de nuestra comunidad. De esa experiencia nació Graphic Concept: nuestro método visual para ayudarte a pensar en inglés y comunicarte en el trabajo, los estudios y la vida diaria. Es fácil de aprender y está pensado para cualquier persona, sin importar su nivel académico, para que comprendas y hables con más facilidad y fluidez, sin memorizar listas interminables.",
    );
    assert.equal(methodNarrative.painEyebrow, "Lo que escuchamos");
    assert.equal(methodNarrative.painHeading, "¿Te suena familiar?");
    assert.deepEqual(methodNarrative.painPoints, selectedQuestions);
    assert.equal(methodNarrative.reasonsEyebrow, "Nuestra respuesta");
    assert.equal(methodNarrative.reasonsHeading, "Lo que cambia cuando entiendes el método.");
    assert.equal(methodNarrative.video, "/assets/wix/videos/intro-video-great.mp4");
    assert.equal(methodNarrative.videoPoster, "/assets/wix/videos/posters/intro-video-great.jpg");
    assert.equal(methodNarrative.videoLabel, "Conoce el método completo · 1:45");
    assert.deepEqual(solutionCharacteristics.map(({ title, body }) => ({ title, body })), [
      { title: "Comprende sin traducir", body: "Entrena tu comprensión para entender inglés directamente, sin traducir palabra por palabra." },
      { title: "Habla sin memorizar", body: "Practica estructuras útiles para hablar desde la primera clase, sin listas interminables." },
      { title: "Avanza a tu ritmo", body: "Graphic Concept se adapta a tu nivel: un método propio, patentado y probado para hablar con más facilidad." },
    ]);
    assert.deepEqual(solutionCharacteristics.map(({ icon }) => icon), ["ear", "message-circle", "route"]);
  });

  it("combines teaching fundamentals, real video, and materials in one method chapter", async () => {
    const source = await readFile("app/_components/site/PublicSections.jsx", "utf8");
    const method = source.slice(source.indexOf("export function MethodSection"), source.indexOf("export function StudyGoalsSection"));

    assert.match(method, /id="metodo" aria-labelledby="method-title"/);
    assert.match(method, /<h2 id="method-title"/);
    assert.match(method, /methodNarrative\.headingLines/);
    assert.match(method, /<ul className="cohesion-method__reasons"/);
    assert.match(method, /aria-label="Cómo practicarás con el método"/);
    assert.match(method, /solutionCharacteristics\.map/);
    assert.match(method, /<h3>\{item\.title\}<\/h3><p>\{item\.body\}<\/p>/);
    assert.equal((method.match(/<MethodVideo/g) || []).length, 1);
    assert.equal((method.match(/<BooksSection/g) || []).length, 1);
    assert.ok(method.indexOf("solutionCharacteristics.map") < method.indexOf("<BooksSection"));
    assert.ok(method.indexOf("<MethodVideo") < method.indexOf("<BooksSection"));
    assert.doesNotMatch(method, /method-story__community|method-story__questions|painPoints|painIntroduction|<ol/);
    assert.doesNotMatch(method, /graphic-concept-(compass-source|pain-|principle-|path)/);
    assert.equal((method.match(/className="method-reason__icon"/g) || []).length, 1);
    assert.match(method, /data-lucide=\{item\.icon \|\| "circle-check"\}/);
    assert.match(method, /src=\{item\.iconImage\}/);
    assert.doesNotMatch(method, /href="\/placement-test\/"|<CallbackDialog/);
  });

  it("renders the existing native Method video exactly once without autoplay", async () => {
    const [sections, interactive] = await Promise.all([
      readFile("app/_components/site/PublicSections.jsx", "utf8"),
      readFile("app/_components/site/InteractiveSections.jsx", "utf8"),
    ]);
    const method = sections.slice(sections.indexOf("export function MethodSection"), sections.indexOf("export function StudyGoalsSection"));
    const video = interactive.slice(interactive.indexOf("export function MethodVideo"), interactive.indexOf("export function TestimonialsSection"));

    assert.equal((method.match(/<MethodVideo/g) || []).length, 1);
    assert.equal((video.match(/<video/g) || []).length, 1);
    assert.match(video, /className="method-story__video"/);
    assert.match(video, /controls/);
    assert.match(video, /preload="metadata"/);
    assert.match(video, /narrative\.video/);
    assert.match(video, /narrative\.videoPoster/);
    assert.match(video, /onPlay=\{enterMobileFullscreen\}/);
    assert.match(video, /video\.webkitEnterFullscreen\(\)/);
    assert.match(video, /video\.requestFullscreen/);
    assert.doesNotMatch(video, /autoplay|muted|playsInline/);
  });

  it("shows three representative covers while preserving the complete six-step collection", async () => {
    const { bookLibrary } = siteData;
    const books = bookLibrary.levels.flatMap((level) => level.books);
    const source = await readFile("app/_components/site/PublicSections.jsx", "utf8");
    const section = source.slice(source.indexOf("export function BooksSection"), source.indexOf("export function FaqSection"));

    assert.equal(bookLibrary.intro.title, "Intro Plus");
    assert.equal(bookLibrary.intro.image, "/assets/books/intro-book-portada.avif");
    assert.deepEqual(books.map((book) => book.title), ["Step 1 Plus", "Step 2 Plus", "Step 3 Plus", "Step 4 Plus", "Step 5 Plus", "Step 6 Plus"]);
    for (const book of [bookLibrary.intro, ...books]) {
      assert.match(book.image, /^\/assets\/books\/.+\.avif$/);
      assert.match(book.imageAlt, /Portada del libro .+ de AIT USA Institute\./);
      await readFile(`public${book.image}`);
    }
    assert.match(section, /featuredBooks = \[bookLibrary\.intro, galleryBooks\[0\], galleryBooks\[2\]\]/);
    assert.match(section, /featuredBooks\.map/);
    const completeCollection = section.match(/<details className="cohesion-books__collection">([\s\S]*?)<\/details>/)?.[1];
    assert.ok(completeCollection);
    assert.match(completeCollection, /<summary>Ver la colección completa<\/summary>/);
    assert.match(completeCollection, /galleryBooks\.map/);
    assert.match(section, /alt=\{book\.imageAlt\}/);
    assert.match(section, /<figcaption>\{book\.title\}<\/figcaption>/);
    assert.match(section, /href="\/cursos\/ingles-jovenes-adultos\/#niveles"/);
    assert.match(section, /admisiones confirma el material de tu grupo/);
  });
});
