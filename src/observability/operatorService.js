export const FUNNEL_OPERATOR_DEFAULT_WINDOW_HOURS = 24;
export const FUNNEL_OPERATOR_MAX_WINDOW_HOURS = 168;
export const FUNNEL_OPERATOR_STALE_DELIVERY_MINUTES = 15;

export function createFunnelOperatorService({
  repository,
  now = () => new Date(),
  staleDeliveryMinutes = FUNNEL_OPERATOR_STALE_DELIVERY_MINUTES,
}) {
  if (!repository) throw new Error("funnel_operator_repository_required");

  return {
    async getHealth({ hours = FUNNEL_OPERATOR_DEFAULT_WINDOW_HOURS } = {}) {
      const boundedHours = Math.max(
        1,
        Math.min(Number.parseInt(hours, 10) || FUNNEL_OPERATOR_DEFAULT_WINDOW_HOURS, FUNNEL_OPERATOR_MAX_WINDOW_HOURS),
      );
      const current = now();
      const since = new Date(current.getTime() - boundedHours * 3_600_000);
      const staleBefore = new Date(current.getTime() - staleDeliveryMinutes * 60_000);
      const summary = await repository.readSummary({ since, now: current, staleBefore });
      const eventCounts = Object.fromEntries(
        summary.events.map((row) => [eventKey(row.eventName, row.safeOutcomeCode), Number(row.count)]),
      );
      const outboxCounts = Object.fromEntries(
        summary.outbox.map((row) => [row.status, Number(row.count)]),
      );
      const started = countEvent(summary.events, "diagnostic_started");
      const completed = countEvent(summary.events, "result_save_completed");
      const authSuccess = countEvent(summary.events, "portal_auth_success");
      const authFailure = countEvent(summary.events, "portal_auth_failure");
      const deadLetters = outboxCounts.dead_letter || 0;
      const staleDeliveries = Number(summary.staleDeliveryCount || 0);
      const alerts = [];

      if (deadLetters > 0) alerts.push(alert("crm_dead_letters_present", "critical", deadLetters));
      if (staleDeliveries > 0) alerts.push(alert("crm_delivery_stale", "warning", staleDeliveries));
      if (started >= 5 && completed / started < 0.5) {
        alerts.push(alert("diagnostic_completion_rate_low", "warning", started - completed));
      }
      if (authFailure >= 5 && authFailure / Math.max(1, authFailure + authSuccess) >= 0.5) {
        alerts.push(alert("portal_auth_failure_rate_high", "warning", authFailure));
      }

      return {
        ok: true,
        status: alerts.some((item) => item.severity === "critical")
          ? "critical"
          : alerts.length ? "warning" : "healthy",
        window: {
          hours: boundedHours,
          from: since.toISOString(),
          to: current.toISOString(),
          staleDeliveryMinutes,
        },
        funnel: { eventCounts },
        crmOutbox: {
          statusCounts: outboxCounts,
          staleDeliveryCount: staleDeliveries,
          oldestOpenAt: summary.oldestOpenAt || null,
        },
        alerts,
      };
    },
  };
}

function countEvent(events, eventName) {
  return events
    .filter((row) => row.eventName === eventName)
    .reduce((total, row) => total + Number(row.count), 0);
}

function eventKey(eventName, safeOutcomeCode) {
  return safeOutcomeCode ? `${eventName}:${safeOutcomeCode}` : eventName;
}

function alert(code, severity, count) {
  return { code, severity, count };
}
