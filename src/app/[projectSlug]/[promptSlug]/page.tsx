"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { VersionList } from "~/components/versions/version-list";
import { useProject } from "~/db/hooks/use-projects";
import { usePrompt } from "~/db/hooks/use-prompts";

interface PromptPageProps {
	params: Promise<{ projectSlug: string; promptSlug: string }>;
}

export default function PromptPage({ params }: PromptPageProps) {
	const { projectSlug, promptSlug } = use(params);
	const project = useProject(projectSlug);
	const prompt = usePrompt(project?.id, promptSlug);

	// Wait for queries to resolve
	if (project === undefined || prompt === undefined) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	if (!project || !prompt) {
		notFound();
	}

	return <VersionList project={project} prompt={prompt} />;
}
