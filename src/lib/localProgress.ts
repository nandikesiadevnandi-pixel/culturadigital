// Progresso local (sem backend) — guarda no localStorage por usuário
const k = (userId: string, key: string) => `cd:${userId}:${key}`;

export const localGetSet = (userId: string, key: string): Set<string> => {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(k(userId, key)) ?? "[]"));
  } catch { return new Set(); }
};

export const localAddToSet = (userId: string, key: string, value: string) => {
  const s = localGetSet(userId, key);
  s.add(value);
  localStorage.setItem(k(userId, key), JSON.stringify([...s]));
};

export const localGetCount = (userId: string, key: string): number => {
  return Number(localStorage.getItem(k(userId, key)) ?? "0");
};

export const localIncCount = (userId: string, key: string, by = 1) => {
  const n = localGetCount(userId, key) + by;
  localStorage.setItem(k(userId, key), String(n));
  return n;
};
