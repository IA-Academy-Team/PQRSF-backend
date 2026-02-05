export const normalizeValue = (value: unknown) => {
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Date) return value;
  return value;
};

export const normalizeValues = (values: unknown[]) =>
  values.map((value) => normalizeValue(value));
