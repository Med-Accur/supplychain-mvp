export function formatUserName(email = '') {
  const localPart = email.split('@')[0];
  const parts = localPart.split(/[.\-_]+/);
  return parts
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}
