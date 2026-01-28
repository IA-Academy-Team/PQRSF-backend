import { z } from "zod";

export const nonEmptyStringSchema = z.string().trim().min(1);
export const optionalStringSchema = nonEmptyStringSchema.optional();
export const nullableStringSchema = nonEmptyStringSchema.nullable();
export const optionalNullableStringSchema = nonEmptyStringSchema.nullable().optional();
export const optionalNullableStringAllowEmptySchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  nonEmptyStringSchema.nullable().optional()
);

export const emailSchema = nonEmptyStringSchema.email();
export const optionalEmailSchema = emailSchema.optional();
export const nullableEmailSchema = emailSchema.nullable();
export const optionalNullableEmailSchema = emailSchema.nullable().optional();

export const positiveIntSchema = z.coerce.number().int().positive();
export const optionalPositiveIntSchema = positiveIntSchema.optional();
export const nullablePositiveIntSchema = positiveIntSchema.nullable();
export const optionalNullablePositiveIntSchema = z.preprocess(
  (value) => (value === undefined || value === "" ? undefined : value === null ? null : value),
  positiveIntSchema.nullable().optional()
);

export const booleanSchema = z.boolean();
export const optionalBooleanSchema = booleanSchema.optional();
export const nullableBooleanSchema = booleanSchema.nullable();
export const optionalNullableBooleanSchema = booleanSchema.nullable().optional();

const bigIntBaseSchema = z.preprocess((value) => {
  if (typeof value === "bigint") return value;
  if (typeof value === "number" && Number.isInteger(value)) return BigInt(value);
  if (typeof value === "string" && /^\d+$/.test(value)) return BigInt(value);
  return value;
}, z.bigint());

export const positiveBigIntSchema = bigIntBaseSchema.refine(
  (value) => value > 0n,
  { message: "must be a positive bigint" }
);
export const optionalPositiveBigIntSchema = positiveBigIntSchema.optional();
export const nullablePositiveBigIntSchema = positiveBigIntSchema.nullable();
export const optionalNullablePositiveBigIntSchema = positiveBigIntSchema.nullable().optional();

export const dateSchema = z.coerce.date();
export const optionalDateSchema = dateSchema.optional();
export const nullableDateSchema = z.preprocess(
  (value) => (value === null ? null : value),
  z.coerce.date().nullable()
);
export const optionalNullableDateSchema = z.preprocess(
  (value) => (value === null ? null : value),
  z.coerce.date().nullable()
).optional();
