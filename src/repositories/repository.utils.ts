export const normalizeValue = (value: unknown) =>
  typeof value === "bigint" ? value.toString() : value;

export const normalizeValues = (values: unknown[]) =>
  values.map((value) => normalizeValue(value));
