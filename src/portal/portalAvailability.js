const PRODUCTION_ENVIRONMENT = "production";

function normalizeEnvironment(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function getPortalPrototypeAvailability(environment = process.env) {
  const vercelEnvironment = normalizeEnvironment(environment?.VERCEL_ENV);
  const vercelTargetEnvironment = normalizeEnvironment(
    environment?.VERCEL_TARGET_ENV,
  );
  const isVercelDeployment = normalizeEnvironment(environment?.VERCEL) === "1";
  const isProduction =
    vercelEnvironment === PRODUCTION_ENVIRONMENT ||
    vercelTargetEnvironment === PRODUCTION_ENVIRONMENT;

  if (isProduction) {
    const productionEnabled =
      environment?.PORTAL_PRODUCTION_ENABLED === "true";
    return {
      available: productionEnabled,
      reason: productionEnabled
        ? "production_enabled"
        : "production_disabled",
    };
  }

  if (vercelEnvironment || vercelTargetEnvironment) {
    return {
      available: true,
      reason: "non_production_environment",
    };
  }

  return {
    available: !isVercelDeployment,
    reason: isVercelDeployment
      ? "vercel_environment_unknown"
      : "local_development",
  };
}

export function isPortalPrototypeAvailable(environment = process.env) {
  return getPortalPrototypeAvailability(environment).available;
}

export function getPortalPrototypeGateResponse(environment = process.env) {
  if (isPortalPrototypeAvailable(environment)) return null;

  return new Response("Not Found", {
    status: 404,
    headers: {
      "cache-control": "private, no-store",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
