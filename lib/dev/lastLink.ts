let lastLink: { email: string; url: string } | null = null;

export function storeMagicLink(email: string, url: string) {
  lastLink = { email, url };
}

export function getLastMagicLink() {
  return lastLink;
}
