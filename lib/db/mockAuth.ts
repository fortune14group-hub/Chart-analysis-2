type UserRecord = {
  email: string;
  pro: boolean;
};

const users = new Map<string, UserRecord>();
const sessions = new Map<string, string>();

export function getUser(email: string): UserRecord {
  const existing = users.get(email);
  if (existing) return existing;
  const fresh = { email, pro: false };
  users.set(email, fresh);
  return fresh;
}

export function setPro(email: string, pro: boolean) {
  const user = getUser(email);
  user.pro = pro;
  users.set(email, user);
}

export function createSession(token: string, email: string) {
  sessions.set(token, email);
}

export function getSession(token: string) {
  const email = sessions.get(token);
  return email ? getUser(email) : null;
}

export function listUsers() {
  return Array.from(users.values());
}
