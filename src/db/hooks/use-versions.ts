"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Example, type Version } from "~/db";
import { emit } from "~/lib/events";

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

export function useVersionById(id: string | undefined) {
	const version = useLiveQuery(
		() => (id ? db.versions.get(id) : undefined),
		[id],
	);

	return version;
}

const DEFAULT_SCHEMA = `z.object({
  result: z.string(),
})`;

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
	emit("version:created", { version });
	return version;
}

export async function updateVersion(
	id: string,
	updates: Partial<
		Pick<Version, "schema" | "examples" | "instructions" | "agentRole">
	>,
): Promise<void> {
	await db.versions.update(id, updates);
	emit("version:updated", { versionId: id, updates });
}

export async function deleteVersion(id: string): Promise<void> {
	await db.results.where("versionId").equals(id).delete();
	await db.versions.delete(id);
	emit("version:deleted", { versionId: id });
}

export function createExample(): Example {
	return {
		id: crypto.randomUUID(),
		input: "",
		output: "",
	};
}
