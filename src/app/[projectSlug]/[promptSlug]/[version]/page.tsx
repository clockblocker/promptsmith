"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { PromptEditor } from "~/components/editor/prompt-editor";
import { useProject } from "~/db/hooks/use-projects";
import { usePrompt } from "~/db/hooks/use-prompts";
import { useVersion } from "~/db/hooks/use-versions";

interface VersionPageProps {
	params: Promise<{ projectSlug: string; promptSlug: string; version: string }>;
}

export default function VersionPage({ params }: VersionPageProps) {
	const { projectSlug, promptSlug, version: versionParam } = use(params);
	const versionNumber = parseInt(versionParam, 10);

	const project = useProject(projectSlug);
	const prompt = usePrompt(project?.id, promptSlug);
	const version = useVersion(prompt?.id, versionNumber);

	// Wait for queries to resolve
	if (project === undefined || prompt === undefined || version === undefined) {
		return (
			<div className="flex min-h-[50vh] items-center justify-center">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		);
	}

	if (!project || !prompt || !version) {
		notFound();
	}

	return <PromptEditor project={project} prompt={prompt} version={version} />;
}
