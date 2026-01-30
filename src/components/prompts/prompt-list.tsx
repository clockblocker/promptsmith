"use client";

import type { Project } from "~/db";
import { usePrompts } from "~/db/hooks/use-prompts";
import { CreatePromptDialog } from "./create-prompt-dialog";
import { PromptCard } from "./prompt-card";

interface PromptListProps {
	project: Project;
}

export function PromptList({ project }: PromptListProps) {
	const prompts = usePrompts(project.id);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl">{project.name}</h1>
					<p className="text-muted-foreground">
						Manage prompts in this project
					</p>
				</div>
				<CreatePromptDialog projectId={project.id} projectSlug={project.slug} />
			</div>

			{prompts.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<p className="mb-4 text-muted-foreground">
						No prompts yet. Create your first prompt to get started.
					</p>
					<CreatePromptDialog
						projectId={project.id}
						projectSlug={project.slug}
					/>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{prompts.map((prompt) => (
						<PromptCard
							key={prompt.id}
							projectSlug={project.slug}
							prompt={prompt}
						/>
					))}
				</div>
			)}
		</div>
	);
}
