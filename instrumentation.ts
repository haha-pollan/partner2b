import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const exporter = token && host
  ? new OTLPLogExporter({
      url: new URL("/i/v1/logs", host).toString(),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
  : undefined;

export const posthogLoggerProvider = new LoggerProvider({
  resource: resourceFromAttributes({ "service.name": "partner2b" }),
  processors: exporter ? [new BatchLogRecordProcessor({ exporter })] : [],
});

export const posthogLogger = posthogLoggerProvider.getLogger("partner2b-posthog-logs");

export function register() {
  if (!token && process.env.NODE_ENV !== "production") {
    console.warn(
      "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured"
    );
  } else if (!host && process.env.NODE_ENV !== "production") {
    console.warn(
      "NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured"
    );
  }
}

export function flushPostHogLogs() {
  return posthogLoggerProvider.forceFlush().catch(() => {});
}
