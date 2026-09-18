export function formatPortalPaymentDate(value) {
  if (!value) return 'Sin fecha';

  const serialized = value instanceof Date ? value.toISOString() : String(value);
  const dateOnly = serialized.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  if (!dateOnly) return 'Sin fecha';

  const parsed = new Date(`${dateOnly}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return 'Sin fecha';

  return new Intl.DateTimeFormat('es-US', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(parsed);
}
