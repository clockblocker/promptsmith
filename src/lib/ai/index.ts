import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

/** Supported AI model identifiers. */
export type ModelId = "gemini-2.5-flash" | "gpt-4o-mini";

/** Configuration entry describing an available AI model. */
export interface ModelConfig {
	id: ModelId;
	name: string;
	provider: "google" | "openai";
}

/** Registry of all models available for prompt testing. */
export const MODELS: ModelConfig[] = [
	{
		id: "gemini-2.5-flash",
		name: "Gemini 2.5 Flash",
		provider: "google",
	},
	{
		id: "gpt-4o-mini",
		name: "GPT-4o Mini",
		provider: "openai",
	},
];

/** Options for the {@link generate} function. */
interface GenerateOptions {
	model: ModelId;
	prompt: string;
	openaiApiKey?: string;
	geminiApiKey?: string;
}

/**
 * Generates text from the specified AI model using the Vercel AI SDK.
 * @param options - Model selection, prompt text, and API keys.
 * @returns The model's text response.
 * @throws {Error} If the model is unknown, the required API key is missing, or the provider is unsupported.
 */
export async function generate(options: GenerateOptions): Promise<string> {
	const { model, prompt, openaiApiKey, geminiApiKey } = options;
	const modelConfig = MODELS.find((m) => m.id === model);

	if (!modelConfig) {
		throw new Error(`Unknown model: ${model}`);
	}

	if (modelConfig.provider === "openai") {
		if (!openaiApiKey) {
			throw new Error("OpenAI API key is required");
		}

		const openai = createOpenAI({ apiKey: openaiApiKey });
		const result = await generateText({
			model: openai("gpt-4o-mini"),
			prompt,
		});

		return result.text;
	}

	if (modelConfig.provider === "google") {
		if (!geminiApiKey) {
			throw new Error("Gemini API key is required");
		}

		const google = createGoogleGenerativeAI({ apiKey: geminiApiKey });
		const result = await generateText({
			model: google("gemini-2.5-flash-preview-04-17"),
			prompt,
		});

		return result.text;
	}

	throw new Error(`Unsupported provider: ${modelConfig.provider}`);
}
