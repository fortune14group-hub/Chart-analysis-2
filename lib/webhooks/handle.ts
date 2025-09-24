import { addStatus } from "@/lib/utils/status";
import { uuid } from "@/lib/utils/uuid";

export type WebhookEvent = {
  id: string;
  type: string;
  created: number;
  data: Record<string, unknown>;
};

export function handleWebhook(event: WebhookEvent) {
  addStatus({
    id: uuid(),
    event: `Webhook: ${event.type}`,
    createdAt: new Date().toISOString(),
    payload: event.data,
  });
  return { received: true };
}
