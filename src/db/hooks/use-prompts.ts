"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Prompt } from "~/db";
import { slugify } from "~/lib/utils";

/**
 * Returns all prompts for a given project, ordered by creation date (newest first).
 * @param projectId - UUID of the parent project, or `undefined` to return an empty array.
 * @returns An array of {@link Prompt} objects, or an empty array while loading.
 */
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

/**
 * Returns a single prompt matching the given project and slug.
 * @param projectId - UUID of the parent project.
 * @param slug - URL-safe slug identifying the prompt within the project.
 * @returns The matching {@link Prompt}, or `undefined` if not found or still loading.
 */
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

/**
 * Creates a new prompt under the specified project.
 * @param projectId - UUID of the parent project.
 * @param name - Human-readable prompt name (used to derive the slug).
 * @returns The newly created {@link Prompt}.
 */
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

/**
 * Deletes a prompt and all of its child versions and results.
 * @param id - UUID of the prompt to delete.
 */
export async function deletePrompt(id: string): Promise<void> {
	const versions = await db.versions.where("promptId").equals(id).toArray();
	for (const version of versions) {
		await db.results.where("versionId").equals(version.id).delete();
	}
	await db.versions.where("promptId").equals(id).delete();
	await db.prompts.delete(id);
}
