export class DiagnosticDomainError extends Error {
  constructor(code, status = 400, details = {}) {
    super(code);
    this.name = "DiagnosticDomainError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function toDiagnosticErrorResponse(error) {
  if (error instanceof DiagnosticDomainError) {
    return {
      status: error.status,
      body: {
        ok: false,
        error: error.code,
        ...error.details,
      },
    };
  }
  return {
    status: 500,
    body: {
      ok: false,
      error: "diagnostic_service_unavailable",
    },
  };
}
