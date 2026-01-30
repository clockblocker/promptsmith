"use client";

import { useProjects } from "~/db/hooks/use-projects";
import { CreateProjectDialog } from "./create-project-dialog";
import { ProjectCard } from "./project-card";

export function ProjectList() {
	const projects = useProjects();

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl">Projects</h1>
					<p className="text-muted-foreground">
						Organize your prompts into projects
					</p>
				</div>
				<CreateProjectDialog />
			</div>

			{projects.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<p className="mb-4 text-muted-foreground">
						No projects yet. Create your first project to get started.
					</p>
					<CreateProjectDialog />
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{projects.map((project) => (
						<ProjectCard key={project.id} project={project} />
					))}
				</div>
			)}
		</div>
	);
}
