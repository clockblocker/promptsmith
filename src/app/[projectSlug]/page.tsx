"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { PromptList } from "~/components/prompts/prompt-list";
import { useProject } from "~/db/hooks/use-projects";

interface ProjectPageProps {
	params: Promise<{ projectSlug: string }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
	const { projectSlug } = use(params);
	const project = useProject(projectSlug);

	// Wait for query to resolve
	if (project === undefined) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	if (project === null) {
		notFound();
	}

	return <PromptList project={project} />;
}
