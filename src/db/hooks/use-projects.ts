"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Project } from "~/db";
import { slugify } from "~/lib/utils";

/**
 * Returns all projects ordered by creation date (newest first).
 * Re-renders automatically when the projects table changes.
 * @returns An array of {@link Project} objects, or an empty array while loading.
 */
export function useProjects() {
	const projects = useLiveQuery(() =>
		db.projects.orderBy("createdAt").reverse().toArray(),
	);

	return projects ?? [];
}

/**
 * Returns a single project matching the given slug.
 * @param slug - URL-safe slug identifying the project.
 * @returns The matching {@link Project}, or `undefined` if not found or still loading.
 */
export function useProject(slug: string) {
	const project = useLiveQuery(
		() => db.projects.where("slug").equals(slug).first(),
		[slug],
	);

	return project;
}

/**
 * Creates a new project with an auto-generated slug and UUID.
 * @param name - Human-readable project name.
 * @returns The newly created {@link Project}.
 */
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

/**
 * Deletes a project and all of its child prompts, versions, and results.
 * @param id - UUID of the project to delete.
 */
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
