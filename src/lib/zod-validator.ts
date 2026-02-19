import { z } from "zod";

/** Result of validating a value against a Zod schema. */
export interface ValidationResult {
	valid: boolean;
	error?: string;
}

/**
 * Parses a Zod schema from source code at runtime.
 *
 * **Security note**: Uses `new Function()` internally to evaluate the schema code.
 * Only call with trusted input.
 *
 * @param schemaCode - Zod schema source code (e.g. `"z.object({ name: z.string() })"`).
 * @returns The parsed Zod schema, or `null` if the code is invalid.
 */
export function parseZodSchema(schemaCode: string): z.ZodType | null {
	try {
		// Create a function that takes z as a parameter and returns the schema
		const fn = new Function("z", `return ${schemaCode}`);
		const schema = fn(z);

		// Verify it's a valid Zod schema by checking if it has the parse method
		if (schema && typeof schema.parse === "function") {
			return schema;
		}
		return null;
	} catch {
		return null;
	}
}

/**
 * Validates a JSON string against a Zod schema.
 * @param schema - A compiled Zod schema (from {@link parseZodSchema}).
 * @param value - A JSON string to parse and validate.
 * @returns A {@link ValidationResult} indicating success or describing the error.
 */
export function validateAgainstSchema(
	schema: z.ZodType,
	value: string,
): ValidationResult {
	try {
		const parsed = JSON.parse(value);
		schema.parse(parsed);
		return { valid: true };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				valid: false,
				error: error.errors.map((e) => e.message).join(", "),
			};
		}
		if (error instanceof SyntaxError) {
			return { valid: false, error: "Invalid JSON" };
		}
		return { valid: false, error: "Validation failed" };
	}
}

/**
 * Extracts top-level field names from a Zod object schema.
 * @param schemaCode - Zod schema source code.
 * @returns An array of field name strings, or an empty array if extraction fails.
 */
export function extractSchemaFields(schemaCode: string): string[] {
	const schema = parseZodSchema(schemaCode);
	if (!schema) return [];

	try {
		// Try to get shape from object schemas
		if ("shape" in schema && schema.shape) {
			return Object.keys(schema.shape as object);
		}
	} catch {
		// If we can't extract fields, return empty array
	}

	return [];
}
