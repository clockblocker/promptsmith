"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Example, type Version } from "~/db";

/**
 * Returns all versions for a given prompt, ordered by version number (highest first).
 * @param promptId - UUID of the parent prompt, or `undefined` to return an empty array.
 * @returns An array of {@link Version} objects, or an empty array while loading.
 */
export function useVersions(promptId: string | undefined) {
	const versions = useLiveQuery(
		() =>
			promptId
				? db.versions
						.where("promptId")
						.equals(promptId)
						.reverse()
						.sortBy("versionNumber")
				: [],
		[promptId],
	);

	return versions ?? [];
}

/**
 * Returns a single version matching the given prompt and version number.
 * @param promptId - UUID of the parent prompt.
 * @param versionNumber - Sequential version number within the prompt.
 * @returns The matching {@link Version}, or `undefined` if not found or still loading.
 */
export function useVersion(
	promptId: string | undefined,
	versionNumber: number,
) {
	const version = useLiveQuery(
		() =>
			promptId
				? db.versions
						.where("promptId")
						.equals(promptId)
						.filter((v) => v.versionNumber === versionNumber)
						.first()
				: undefined,
		[promptId, versionNumber],
	);

	return version;
}

/**
 * Returns a single version by its UUID.
 * @param id - UUID of the version, or `undefined` to skip the query.
 * @returns The matching {@link Version}, or `undefined` if not found or still loading.
 */
export function useVersionById(id: string | undefined) {
	const version = useLiveQuery(
		() => (id ? db.versions.get(id) : undefined),
		[id],
	);

	return version;
}

/** Default Zod schema source code used when creating a new version from scratch. */
const DEFAULT_SCHEMA = `z.object({
  result: z.string(),
})`;

/**
 * Creates a new version for the given prompt. If `fromVersion` is provided,
 * the new version is forked from it (copying schema, examples, instructions, and role).
 * @param promptId - UUID of the parent prompt.
 * @param fromVersion - Optional existing version to fork from.
 * @returns The newly created {@link Version}.
 */
export async function createVersion(
	promptId: string,
	fromVersion?: Version,
): Promise<Version> {
	const existing = await db.versions
		.where("promptId")
		.equals(promptId)
		.toArray();
	const maxVersion = existing.reduce(
		(max, v) => Math.max(max, v.versionNumber),
		0,
	);

	const id = crypto.randomUUID();
	const version: Version = {
		id,
		promptId,
		versionNumber: maxVersion + 1,
		schema: fromVersion?.schema ?? DEFAULT_SCHEMA,
		examples:
			fromVersion?.examples.map((e) => ({ ...e, id: crypto.randomUUID() })) ??
			[],
		instructions: fromVersion?.instructions ?? "",
		agentRole: fromVersion?.agentRole ?? "",
		createdAt: new Date(),
	};

	await db.versions.add(version);
	return version;
}

/**
 * Applies a partial update to a version's mutable fields.
 * @param id - UUID of the version to update.
 * @param updates - An object containing any combination of `schema`, `examples`, `instructions`, and `agentRole`.
 */
export async function updateVersion(
	id: string,
	updates: Partial<
		Pick<Version, "schema" | "examples" | "instructions" | "agentRole">
	>,
): Promise<void> {
	await db.versions.update(id, updates);
}

/**
 * Deletes a version and all of its associated results.
 * @param id - UUID of the version to delete.
 */
export async function deleteVersion(id: string): Promise<void> {
	await db.results.where("versionId").equals(id).delete();
	await db.versions.delete(id);
}

/**
 * Creates a new blank {@link Example} with a generated UUID.
 * @returns An example with empty input and output strings.
 */
export function createExample(): Example {
	return {
		id: crypto.randomUUID(),
		input: "",
		output: "",
	};
}
