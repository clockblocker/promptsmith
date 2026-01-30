"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Prompt } from "~/db";
import { slugify } from "~/lib/utils";

export function usePrompts(projectId: string | undefined) {
	const prompts = useLiveQuery(
		() =>
			projectId
				? db.prompts
						.where("projectId")
						.equals(projectId)
						.reverse()
						.sortBy("createdAt")
				: [],
		[projectId],
	);

	return prompts ?? [];
}

export function usePrompt(projectId: string | undefined, slug: string) {
	const prompt = useLiveQuery(
		() =>
			projectId
				? db.prompts
						.where("projectId")
						.equals(projectId)
						.filter((p) => p.slug === slug)
						.first()
				: undefined,
		[projectId, slug],
	);

	return prompt;
}

export async function createPrompt(
	projectId: string,
	name: string,
): Promise<Prompt> {
	const id = crypto.randomUUID();
	const slug = slugify(name);
	const prompt: Prompt = {
		id,
		projectId,
		name,
		slug,
		createdAt: new Date(),
	};

	await db.prompts.add(prompt);
	return prompt;
}

export async function deletePrompt(id: string): Promise<void> {
	const versions = await db.versions.where("promptId").equals(id).toArray();
	for (const version of versions) {
		await db.results.where("versionId").equals(version.id).delete();
	}
	await db.versions.where("promptId").equals(id).delete();
	await db.prompts.delete(id);
}
