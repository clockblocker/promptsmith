import type { Example } from "~/db";

/** Input data for assembling an XML-formatted prompt. */
interface PromptGeneratorInput {
	agentRole: string;
	schema: string;
	examples: Example[];
	instructions: string;
	userInput: Record<string, string>;
}

/**
 * Assembles a complete XML-formatted prompt string from structured input.
 *
 * The output contains up to five XML sections in order:
 * `<agent_role>`, `<schema_of_expected_result>`, `<examples>`, `<instructions>`, and `<user_input>`.
 * Empty sections are omitted.
 *
 * @param input - The prompt components to assemble.
 * @returns A multi-section XML string ready to send to an AI model.
 */
export function generateXmlPrompt(input: PromptGeneratorInput): string {
	const parts: string[] = [];

	if (input.agentRole.trim()) {
		parts.push(`<agent_role>\n${input.agentRole.trim()}\n</agent_role>`);
	}

	if (input.schema.trim()) {
		parts.push(
			`<schema_of_expected_result>\n${input.schema.trim()}\n</schema_of_expected_result>`,
		);
	}

	if (input.examples.length > 0) {
		const examplesXml = input.examples
			.filter((e) => e.input.trim() || e.output.trim())
			.map(
				(e) =>
					`  <example>\n    <user_input>${escapeXml(e.input)}</user_input>\n    <expected_output>${escapeXml(e.output)}</expected_output>\n  </example>`,
			)
			.join("\n");

		if (examplesXml) {
			parts.push(`<examples>\n${examplesXml}\n</examples>`);
		}
	}

	if (input.instructions.trim()) {
		parts.push(`<instructions>\n${input.instructions.trim()}\n</instructions>`);
	}

	// Add user input as the actual request
	const userInputEntries = Object.entries(input.userInput).filter(([, value]) =>
		value.trim(),
	);
	if (userInputEntries.length > 0) {
		const inputXml = userInputEntries
			.map(([key, value]) => `  <${key}>${escapeXml(value)}</${key}>`)
			.join("\n");
		parts.push(`<user_input>\n${inputXml}\n</user_input>`);
	}

	return parts.join("\n\n");
}

/**
 * Escapes XML special characters (`&`, `<`, `>`, `"`, `'`) in a string.
 * @param str - Raw string to escape.
 * @returns The XML-safe string.
 */
function escapeXml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}
