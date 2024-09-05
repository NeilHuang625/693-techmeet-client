export const years = Array.from({ length: 20 }, (_, i) =>
  (new Date().getFullYear() + i).toString().slice(-2)
);

export const months = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, "0")
);
