export type StatusEntry = {
  id: string;
  event: string;
  createdAt: string;
  payload?: Record<string, unknown>;
};

const statusLog: StatusEntry[] = [];

export function addStatus(entry: StatusEntry) {
  statusLog.unshift(entry);
  if (statusLog.length > 100) statusLog.pop();
}

export function getStatus(): StatusEntry[] {
  return statusLog;
}
