"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Project } from "~/db";
import { slugify } from "~/lib/utils";

export function useProjects() {
	const projects = useLiveQuery(() =>
		db.projects.orderBy("createdAt").reverse().toArray(),
	);

	return projects ?? [];
}

export function useProject(slug: string) {
	const project = useLiveQuery(
		() => db.projects.where("slug").equals(slug).first(),
		[slug],
	);

	return project;
}

export async function createProject(name: string): Promise<Project> {
	const id = crypto.randomUUID();
	const slug = slugify(name);
	const project: Project = {
		id,
		name,
		slug,
		createdAt: new Date(),
	};

	await db.projects.add(project);
	return project;
}

export async function deleteProject(id: string): Promise<void> {
	const prompts = await db.prompts.where("projectId").equals(id).toArray();
	for (const prompt of prompts) {
		const versions = await db.versions
			.where("promptId")
			.equals(prompt.id)
			.toArray();
		for (const version of versions) {
			await db.results.where("versionId").equals(version.id).delete();
		}
		await db.versions.where("promptId").equals(prompt.id).delete();
	}
	await db.prompts.where("projectId").equals(id).delete();
	await db.projects.delete(id);
}
