import Dexie, { type EntityTable } from "dexie";

/** A top-level container for organizing related prompts. */
export interface Project {
	/** UUID primary key. */
	id: string;
	/** Human-readable project name. */
	name: string;
	/** URL-safe slug derived from the name. */
	slug: string;
	/** Timestamp when the project was created. */
	createdAt: Date;
}

/** A named prompt belonging to a {@link Project}. */
export interface Prompt {
	/** UUID primary key. */
	id: string;
	/** Foreign key referencing the owning {@link Project.id}. */
	projectId: string;
	/** Human-readable prompt name. */
	name: string;
	/** URL-safe slug derived from the name. */
	slug: string;
	/** Timestamp when the prompt was created. */
	createdAt: Date;
}

/**
 * An immutable snapshot of a prompt's configuration.
 * Versions belong to a {@link Prompt} and are numbered sequentially.
 */
export interface Version {
	/** UUID primary key. */
	id: string;
	/** Foreign key referencing the owning {@link Prompt.id}. */
	promptId: string;
	/** Incrementing version number within the parent prompt. */
	versionNumber: number;
	/** Zod schema source code defining the expected output shape. */
	schema: string;
	/** Input/output example pairs used for few-shot prompting. */
	examples: Example[];
	/** Free-text instructions appended to the generated prompt. */
	instructions: string;
	/** System-level role description for the AI agent. */
	agentRole: string;
	/** Timestamp when the version was created. */
	createdAt: Date;
}

/** A single input/output example pair attached to a {@link Version}. */
export interface Example {
	/** UUID identifier. */
	id: string;
	/** Example user input text. */
	input: string;
	/** Expected model output text. */
	output: string;
}

/** The output produced by running a {@link Version} against an AI model. */
export interface Result {
	/** UUID primary key. */
	id: string;
	/** Foreign key referencing the {@link Version.id} that produced this result. */
	versionId: string;
	/** Key-value map of user-supplied input values fed into the prompt. */
	inputValues: Record<string, string>;
	/** Identifier of the AI model used (e.g. "gemini-2.5-flash", "gpt-4o-mini"). */
	model: string;
	/** Raw text output returned by the model. */
	output: string;
	/** Timestamp when the result was generated. */
	createdAt: Date;
}

/** A persisted key-value setting (e.g. API keys). */
export interface Setting {
	/** UUID primary key. */
	id: string;
	/** Setting identifier (e.g. "openai_api_key"). */
	key: string;
	/** Setting value. */
	value: string;
}

/**
 * Dexie database instance for Promptsmith.
 * Uses IndexedDB for local-only, client-side storage.
 */
const db = new Dexie("promptsmith") as Dexie & {
	projects: EntityTable<Project, "id">;
	prompts: EntityTable<Prompt, "id">;
	versions: EntityTable<Version, "id">;
	results: EntityTable<Result, "id">;
	settings: EntityTable<Setting, "id">;
};

db.version(1).stores({
	projects: "id, slug, createdAt",
	prompts: "id, projectId, slug, createdAt",
	versions: "id, promptId, versionNumber, createdAt",
	results: "id, versionId, model, createdAt",
	settings: "id, key",
});

export { db };
