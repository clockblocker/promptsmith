"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Result } from "~/db";

/**
 * Returns all results for a given version, ordered by creation date (newest first).
 * @param versionId - UUID of the parent version, or `undefined` to return an empty array.
 * @returns An array of {@link Result} objects, or an empty array while loading.
 */
export function useResults(versionId: string | undefined) {
	const results = useLiveQuery(
		() =>
			versionId
				? db.results
						.where("versionId")
						.equals(versionId)
						.reverse()
						.sortBy("createdAt")
				: [],
		[versionId],
	);

	return results ?? [];
}

/**
 * Persists a new AI model result.
 * @param versionId - UUID of the version that produced this result.
 * @param inputValues - Key-value map of user-supplied inputs fed into the prompt.
 * @param model - Identifier of the AI model used (e.g. "gpt-4o-mini").
 * @param output - Raw text output returned by the model.
 * @returns The newly created {@link Result}.
 */
export async function createResult(
	versionId: string,
	inputValues: Record<string, string>,
	model: string,
	output: string,
): Promise<Result> {
	const id = crypto.randomUUID();
	const result: Result = {
		id,
		versionId,
		inputValues,
		model,
		output,
		createdAt: new Date(),
	};

	await db.results.add(result);
	return result;
}

/**
 * Deletes a single result by its UUID.
 * @param id - UUID of the result to delete.
 */
export async function deleteResult(id: string): Promise<void> {
	await db.results.delete(id);
}
