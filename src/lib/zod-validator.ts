import { z } from "zod";

export interface ValidationResult {
	valid: boolean;
	error?: string;
}

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
