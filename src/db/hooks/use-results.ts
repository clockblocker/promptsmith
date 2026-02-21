"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Result } from "~/db";
import { emit } from "~/lib/events";

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
	emit("result:created", { result });
	return result;
}

export async function deleteResult(id: string): Promise<void> {
	await db.results.delete(id);
}
