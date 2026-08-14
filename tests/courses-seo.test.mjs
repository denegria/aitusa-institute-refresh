import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { catalogInformationRoutes, courseCatalog, productOfferings, programs, schedules } from "../src/content.js";
import { getCourseMetaDescription } from "../src/seo/courseMetadata.js";

const activeSlugs = [
  "ingles-jovenes-adultos",
  "ingles-hibrido-adultos",
  "ingles-online-adultos",
  "espanol-extranjeros",
  "ged",
  "tutorias-matematicas",
  "computacion-basica",
  "computacion-oficina",
];

describe("AIT USA native course routes and SEO contract", () => {
  it("defines catalog metadata and a native App Router page", async () => {
    const source = await readFile("app/(public-site)/cursos/page.jsx", "utf8");
    assert.match(source, /Cursos AiT USA Institute \| Catálogo detallado/);
    assert.match(source, /canonical: "\/cursos\//);
    assert.match(source, /Explora el catálogo detallado de inglés, GED, computación/);
    assert.match(source, /"@type": "ItemList"/);
    assert.match(source, /itemListElement: programs\.map/);
    assert.match(source, /data-schema="course-catalog"/);
    assert.match(source, /<CoursesPage/);
  });

  it("publishes exactly eight complete active records in the static route inventory", async () => {
    const route = await readFile("app/(public-site)/cursos/[slug]/page.jsx", "utf8");
    const shell = await readFile("app/_components/site/CoursesPage.jsx", "utf8");

    assert.match(route, /generateStaticParams/);
    assert.match(route, /programs\.map/);
    assert.match(route, /generateMetadata/);
    assert.match(route, /"@type": "Course"/);
    assert.match(route, /"@type": "CourseInstance"/);
    assert.match(route, /hasCourseInstance/);
    assert.match(route, /courseMode: program\.mode/);
    assert.match(route, /location: buildCourseLocations/);
    assert.match(route, /courseSchedule: buildCourseSchedule/);
    assert.doesNotMatch(route, /provider:\s*\{[^}]*courseMode/);
    assert.match(route, /"@type": "BreadcrumbList"/);
    assert.match(route, /"@type": "FAQPage"/);
    assert.match(route, /data-schema="breadcrumb"/);
    assert.match(route, /data-schema="faq"/);
    assert.match(route, /CourseProgramPage/);
    assert.equal(programs.length, 8);
    assert.deepEqual(programs.map((program) => program.slug), activeSlugs);
    assert.ok(programs.every((program) => program.editorial?.version === "course-editorial-v1"));
    assert.ok(programs.every((program) => program.editorial.proofLedger.length === 4));
    assert.ok(programs.every((program) => program.editorial.outcomes.length === 3));
    assert.ok(programs.every((program) => program.editorial.pathway.length >= 3));
    assert.ok(programs.every((program) => program.editorial.formats.length === 3));
    assert.ok(programs.every((program) => program.editorial.schedule.length >= 1));
    assert.ok(programs.every((program) => program.editorial.faqs.length === 6));
    assert.ok(programs.every((program) => program.editorial.closing));
    assert.match(shell, /`\$\{program\.title\} \| AiT USA Institute`/);
    assert.match(shell, /canonical: `\/cursos\/\$\{program\.slug\}\/`/);
    assert.match(shell, /locale: "es_US"/);
    assert.match(shell, /site: site\.twitterHandle/);
  });

  it("keeps generated course snippets unique, useful, and within the SEO limit", () => {
    const descriptions = programs.map(getCourseMetaDescription);

    assert.equal(new Set(descriptions).size, descriptions.length);
    assert.ok(descriptions.every((description) => description.length >= 140));
    assert.ok(descriptions.every((description) => description.length <= 160));
  });

  it("removes retired course records from the source inventory while retaining redirects", async () => {
    const contentSource = await readFile("src/content.js", "utf8");
    const recordInventory = contentSource.slice(
      contentSource.indexOf("const allCourseRecords = ["),
      contentSource.indexOf("const hybridEnglishProgram = {"),
    );
    const legacySource = await readFile("src/seo/legacyRoutes.js", "utf8");

    assert.doesNotMatch(recordInventory, /slug: "ingles-ninos"/);
    assert.doesNotMatch(recordInventory, /slug: "reparacion-computadoras"/);
    assert.match(contentSource, /const retiredCourseSlugs = new Set\(\["ingles-ninos", "reparacion-computadoras"\]\)/);
    assert.match(legacySource, /\/cursos\/ingles-ninos\//);
    assert.match(legacySource, /\/cursos\/reparacion-computadoras\//);
  });

  it("keeps the three English journeys unique while preserving verified facts", () => {
    const presencial = programs.find((program) => program.slug === "ingles-jovenes-adultos");
    const hybrid = programs.find((program) => program.slug === "ingles-hibrido-adultos");
    const online = programs.find((program) => program.slug === "ingles-online-adultos");

    assert.equal(presencial.title, "Inglés presencial");
    assert.equal(presencial.mode, "Presencial");
    assert.match(presencial.editorial.lead, /presencial/i);
    assert.doesNotMatch(presencial.editorial.lead, /híbrido|online/i);
    assert.deepEqual(presencial.editorial.schedule, [
      {
        label: "Lun–jue · inicios por la mañana",
        times: ["8:30 am", "9:30 am", "10:30 am", "11:30 am"],
      },
      {
        label: "Lun–jue · inicios por la noche",
        times: ["6:30 pm", "7:40 pm", "8:45 pm"],
      },
      {
        label: "Sábados",
        times: ["10:00 am–1:00 pm", "3:30–5:30 pm"],
      },
      {
        label: "Domingos",
        times: ["10:30 am–12:30 pm"],
      },
    ]);
    assert.deepEqual(presencial.courseDetail.schedule, [
      "Lunes a jueves por la mañana: clases con inicio a las 8:30 am, 9:30 am, 10:30 am y 11:30 am.",
      "Lunes a jueves por la noche: clases con inicio a las 6:30 pm, 7:40 pm y 8:45 pm.",
      "Sábados: 10:00 am–1:00 pm y 3:30 pm–5:30 pm.",
      "Domingos: 10:30 am–12:30 pm.",
    ]);
    assert.deepEqual(schedules.map(({ label, times, duration }) => ({ label, times, duration })), [
      {
        label: "Mañanas · lun–jue",
        times: ["8:30 am", "9:30 am", "10:30 am", "11:30 am"],
        duration: "Horarios de inicio",
      },
      {
        label: "Noches · lun–jue",
        times: ["6:30 pm", "7:40 pm", "8:45 pm"],
        duration: "Horarios de inicio",
      },
      {
        label: "Sábados",
        times: ["10:00 am a 1:00 pm", "3:30 pm a 5:30 pm"],
        duration: "Bloques publicados",
      },
      {
        label: "Domingos",
        times: ["10:30 am a 12:30 pm"],
        duration: "Bloque publicado",
      },
    ]);
    assert.doesNotMatch(
      JSON.stringify({ courseDetail: presencial.courseDetail, editorial: presencial.editorial, schedules }),
      /6:20|8:40|9:50|2:00 pm|3:00 pm|10:00 am a 12:30 pm/,
    );
    assert.equal(hybrid.title, "Inglés híbrido");
    assert.equal(hybrid.mode, "Presencial + remoto");
    assert.match(hybrid.editorial.lead, /presencial.*remoto/i);
    assert.match(hybrid.editorial.faqs[0].answer, /grupo activo/i);
    assert.equal(online.title, "Inglés online");
    assert.equal(online.mode, "100% online");
    assert.match(online.editorial.lead, /100% online/i);
    assert.match(online.editorial.formats.find((format) => format.title === "Clase en vivo").text, /no pregrabada/);
    assert.deepEqual(online.editorial.schedule[1], {
      label: "Lun–jue · noches",
      times: ["6:20–7:30 pm", "7:30–8:40 pm", "8:40–9:50 pm"],
    });
  });

  it("keeps the remaining five program pages complete", () => {
    const spanish = programs.find((program) => program.slug === "espanol-extranjeros");
    const ged = programs.find((program) => program.slug === "ged");
    const math = programs.find((program) => program.slug === "tutorias-matematicas");
    const basicComputing = programs.find((program) => program.slug === "computacion-basica");
    const officeComputing = programs.find((program) => program.slug === "computacion-oficina");

    assert.equal(spanish.editorial.schedule.length, 1);
    assert.match(spanish.editorial.schedule[0].times[0], /por confirmar/i);
    assert.equal(ged.editorial.pathway.length, 4);
    assert.deepEqual(ged.editorial.pathway.map((area) => area.title), [
      "Razonamiento matemático",
      "Artes del lenguaje",
      "Ciencias",
      "Estudios sociales",
    ]);
    assert.equal(math.editorial.primaryCta.external, true);
    assert.deepEqual(basicComputing.editorial.pathway.map((module) => module.title), [
      "Equipo y entorno",
      "Internet y comunicación",
      "Archivos y mantenimiento",
    ]);
    assert.deepEqual(officeComputing.editorial.pathway.map((module) => module.title), [
      "Microsoft Word",
      "Microsoft Excel",
      "Microsoft PowerPoint",
    ]);
    assert.match(officeComputing.editorial.logisticsNote, /referencias, no garantías/i);
  });

  it("keeps the catalog compact and makes all active cards crawlable", async () => {
    const source = await readFile("app/_components/site/CourseSections.jsx", "utf8");
    const page = await readFile("app/_components/site/CoursesPage.jsx", "utf8");

    assert.doesNotMatch(source, /OfferingsSection|course-detail-stack|<details|<summary|filter-bar/);
    assert.match(source, /role="tablist"/);
    assert.match(source, /Todos los cursos/);
    assert.match(source, /useState\(allOfferingsKey\)/);
    assert.match(source, /role="tabpanel"/);
    assert.doesNotMatch(source, /catalog-nav/);
    assert.match(source, /data-course-detail-link=\{program\.slug\}/);
    assert.match(source, /\{program\.cta\}/);
    assert.ok(programs.every((program) => program.cta && !/learn more/i.test(program.cta)));
    assert.doesNotMatch(source, /Learn more|Abrir ficha completa|Ver mi nivel/);
    assert.doesNotMatch(page, /page-hero--catalog|Hacer examen de ubicación|Hablar con un asesor/);
    assert.doesNotMatch(page, /OfferingsSection/);
    assert.equal(courseCatalog.flatMap((group) => group.programs).length, 8);
    assert.equal(new Set(courseCatalog.flatMap((group) => group.programs)).size, 8);
    assert.deepEqual(catalogInformationRoutes.map((route) => route.key), ["ciudadania"]);
    assert.equal(catalogInformationRoutes[0].href, "/ciudadania/");
    assert.match(catalogInformationRoutes[0].note, /No es un curso publicado/i);
    assert.equal(courseCatalog.find((group) => group.key === "additional-languages").informationRoutes?.[0], "ciudadania");
    assert.deepEqual(productOfferings.slice(0, 3).map((offering) => offering.href), [
      "/cursos/ingles-jovenes-adultos/",
      "/cursos/ingles-hibrido-adultos/",
      "/cursos/ingles-online-adultos/",
    ]);
  });

  it("keeps English aliases working by redirecting to the Spanish route family", async () => {
    const catalogAlias = await readFile("app/(public-site)/courses/page.jsx", "utf8");
    const detailAlias = await readFile("app/(public-site)/courses/[slug]/page.jsx", "utf8");
    assert.match(catalogAlias, /permanentRedirect\("\/cursos\/"\)/);
    assert.match(detailAlias, /permanentRedirect/);
    assert.match(detailAlias, /`\/cursos\/\$\{slug\}\/`/);
    assert.match(detailAlias, /retiredCourseSlugs/);
  });

  it("keeps the Spanish course navigation canonical and current", async () => {
    const chrome = await readFile("app/_components/site/SiteChrome.jsx", "utf8");
    assert.match(chrome, /id === "cursos"[\s\S]*?"\/cursos\//);
    assert.match(chrome, /activePage === "courses" && id === "cursos"[\s\S]*?"page"/);
  });
});
