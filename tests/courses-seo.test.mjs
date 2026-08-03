import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";
import { programs } from "../src/content.js";

describe("MIS-264 native React course routes", () => {
  it("defines catalog metadata and a native App Router page", async () => {
    const source = await readFile("app/(public-site)/cursos/page.jsx", "utf8");
    assert.match(source, /Cursos AiT USA Institute \| Catálogo detallado/);
    assert.match(source, /canonical: "\/cursos\/"/);
    assert.match(source, /Explora el catálogo detallado de inglés, GED, computación/);
    assert.match(source, /<CoursesPage/);
  });

  it("statically generates every course with route-specific metadata and schema", async () => {
    const route = await readFile("app/(public-site)/cursos/[slug]/page.jsx", "utf8");
    const shell = await readFile("app/_components/site/CoursesPage.jsx", "utf8");

    assert.match(route, /generateStaticParams/);
    assert.match(route, /programs\.map/);
    assert.match(route, /generateMetadata/);
    assert.match(route, /"@type": "Course"/);
    assert.match(route, /dangerouslySetInnerHTML/);
    assert.match(route, /CourseProgramPage/);
    assert.match(route, /program\.editorial/);
    assert.match(shell, /`\$\{program\.title\} \| Cursos AiT USA Institute`/);
    assert.match(shell, /canonical: `\/cursos\/\$\{program\.slug\}\/`/);
    assert.equal(programs.length, 9);
  });

  it("uses one reusable editorial template for all nine programs", async () => {
    const template = await readFile("app/_components/site/CourseProgramPage.jsx", "utf8");
    const editorialPrograms = programs.filter((program) => program.editorial);
    const adultEnglish = programs.find((program) => program.slug === "ingles-jovenes-adultos");
    const onlineEnglish = programs.find((program) => program.slug === "ingles-online-adultos");
    const kidsEnglish = programs.find((program) => program.slug === "ingles-ninos");
    const spanish = programs.find((program) => program.slug === "espanol-extranjeros");
    const ged = programs.find((program) => program.slug === "ged");
    const math = programs.find((program) => program.slug === "tutorias-matematicas");
    const basicComputing = programs.find((program) => program.slug === "computacion-basica");
    const officeComputing = programs.find((program) => program.slug === "computacion-oficina");
    const repair = programs.find((program) => program.slug === "reparacion-computadoras");

    assert.deepEqual(
      editorialPrograms.map((program) => program.slug),
      [
        "ingles-jovenes-adultos",
        "ingles-online-adultos",
        "ingles-ninos",
        "espanol-extranjeros",
        "ged",
        "tutorias-matematicas",
        "computacion-basica",
        "computacion-oficina",
        "reparacion-computadoras",
      ],
    );
    assert.ok(editorialPrograms.every((program) => program.editorial.version === "course-editorial-v1"));
    assert.ok(editorialPrograms.every((program) => program.editorial.proofLedger.length === 4));
    assert.ok(editorialPrograms.every((program) => program.editorial.outcomes.length === 3));
    assert.ok(editorialPrograms.every((program) => program.editorial.pathway.length >= 3));
    assert.ok(editorialPrograms.every((program) => program.editorial.formats.length === 3));
    assert.ok(editorialPrograms.every((program) => program.editorial.schedule.length >= 1));
    assert.ok(editorialPrograms.every((program) => program.editorial.faqs.length === 6));
    assert.ok(editorialPrograms.every((program) => program.editorial.closing));
    assert.equal(adultEnglish.editorial.version, "course-editorial-v1");
    assert.equal(adultEnglish.editorial.outcomes.length, 3);
    assert.equal(adultEnglish.editorial.pathway.length, 3);
    assert.equal(adultEnglish.editorial.formats.length, 3);
    assert.equal(adultEnglish.editorial.schedule.length, 3);
    assert.equal(adultEnglish.editorial.faqs.length, 6);
    assert.deepEqual(adultEnglish.editorial.schedule, [
      {
        label: "Lun–jue · mañanas",
        times: ["9:30–10:30 am", "10:30–11:30 am"],
      },
      {
        label: "Lun–jue · noches",
        times: ["6:20–7:30 pm", "7:30–8:40 pm", "8:40–9:50 pm"],
      },
      {
        label: "Sábados",
        times: ["10:00 am–1:00 pm", "2:00–5:00 pm"],
      },
    ]);
    assert.match(
      adultEnglish.editorial.formats.find((format) => format.title === "Online").text,
      /tiempo real.*no pregrabadas/,
    );
    assert.equal(onlineEnglish.editorial.pathway.length, 3);
    assert.equal(onlineEnglish.editorial.formats.length, 3);
    assert.equal(onlineEnglish.editorial.schedule.length, 3);
    assert.equal(onlineEnglish.editorial.faqs.length, 6);
    assert.match(
      onlineEnglish.editorial.formats.find((format) => format.title === "Clase en vivo").text,
      /no pregrabada/,
    );
    assert.deepEqual(onlineEnglish.editorial.schedule[1], {
      label: "Lun–jue · noches",
      times: ["6:20–7:30 pm", "7:30–8:40 pm", "8:40–9:50 pm"],
    });
    assert.equal(onlineEnglish.editorial.story, undefined);

    assert.equal(kidsEnglish.editorial.pathway.length, 3);
    assert.match(kidsEnglish.editorial.eyebrow, /8 a 13/);
    assert.match(kidsEnglish.editorial.heroNote, /familia/);
    assert.equal(kidsEnglish.editorial.primaryCta.external, true);
    assert.doesNotMatch(kidsEnglish.editorial.closing.text, /10 meses/i);

    assert.equal(spanish.editorial.schedule.length, 1);
    assert.match(spanish.editorial.schedule[0].times[0], /por confirmar/i);
    assert.equal(spanish.editorial.primaryCta.external, true);
    assert.doesNotMatch(spanish.editorial.lead, /Colombia|Perú/i);

    assert.equal(ged.editorial.pathway.length, 4);
    assert.deepEqual(
      ged.editorial.pathway.map((area) => area.title),
      ["Razonamiento matemático", "Artes del lenguaje", "Ciencias", "Estudios sociales"],
    );
    assert.equal(ged.editorial.schedule.length, 4);
    assert.equal(ged.editorial.faqs.length, 6);
    assert.equal(ged.editorial.story, undefined);
    assert.equal(ged.editorial.primaryCta.external, true);
    assert.match(ged.editorial.primaryCta.href, /^https:\/\/wa\.me\//);
    assert.doesNotMatch(ged.editorial.closing.text, /garant/i);

    assert.equal(math.editorial.primaryCta.external, true);
    assert.match(math.editorial.heroNote, /materia.*nivel.*modalidad.*horario/i);
    assert.doesNotMatch(math.editorial.closing.text, /garant/i);

    assert.deepEqual(
      basicComputing.editorial.pathway.map((module) => module.title),
      ["Equipo y entorno", "Internet y comunicación", "Archivos y mantenimiento"],
    );
    assert.equal(basicComputing.editorial.primaryCta.external, true);

    assert.deepEqual(
      officeComputing.editorial.pathway.map((module) => module.title),
      ["Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint"],
    );
    assert.match(officeComputing.editorial.logisticsNote, /referencias, no garantías/i);
    assert.equal(officeComputing.editorial.primaryCta.external, true);

    assert.equal(repair.editorial.primaryCta.external, true);
    assert.match(repair.editorial.sectionCopy.pathway.text, /No prometemos reparar cualquier marca o modelo/);
    assert.doesNotMatch(repair.editorial.closing.text, /certificaci[oó]n|empleo/i);

    assert.match(template, /data-course-template/);
    assert.match(template, /CourseOutcomes/);
    assert.match(template, /CoursePathway/);
    assert.match(template, /CourseMethod/);
    assert.match(template, /CourseLogistics/);
    assert.match(template, /CourseStory/);
    assert.match(template, /CourseFaq/);
    assert.match(template, /conversionCtas\.placement\.href/);
    assert.match(template, /editorial\.sectionCopy/);
    assert.match(template, /editorial\.story \?/);
    assert.match(template, /editorial\.primaryCta/);
    assert.match(template, /<video/);
  });

  it("keeps English aliases working by redirecting to the Spanish route family", async () => {
    const catalogAlias = await readFile("app/(public-site)/courses/page.jsx", "utf8");
    const detailAlias = await readFile("app/(public-site)/courses/[slug]/page.jsx", "utf8");
    assert.match(catalogAlias, /permanentRedirect\("\/cursos\/"\)/);
    assert.match(detailAlias, /permanentRedirect/);
    assert.match(detailAlias, /`\/cursos\/\$\{slug\}\/`/);
  });
});
