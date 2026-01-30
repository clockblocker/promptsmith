import Dexie, { type EntityTable } from "dexie";

export interface Project {
	id: string;
	name: string;
	slug: string;
	createdAt: Date;
}

export interface Prompt {
	id: string;
	projectId: string;
	name: string;
	slug: string;
	createdAt: Date;
}

export interface Version {
	id: string;
	promptId: string;
	versionNumber: number;
	schema: string;
	examples: Example[];
	instructions: string;
	agentRole: string;
	createdAt: Date;
}

export interface Example {
	id: string;
	input: string;
	output: string;
}

export interface Result {
	id: string;
	versionId: string;
	inputValues: Record<string, string>;
	model: string;
	output: string;
	createdAt: Date;
}

export interface Setting {
	id: string;
	key: string;
	value: string;
}

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
