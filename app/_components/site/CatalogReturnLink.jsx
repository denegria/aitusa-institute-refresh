"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { catalogHref, normalizeCatalogGroup } from "../../../src/courseDiscovery";

export function CatalogReturnLink({ slug }) {
  const [href, setHref] = useState("/cursos/");
  useEffect(() => {
    const group = new URLSearchParams(window.location.search).get("grupo");
    if (group) setHref(catalogHref(normalizeCatalogGroup(group), slug));
  }, [slug]);
  return <Link href={href}>Volver a cursos</Link>;
}
