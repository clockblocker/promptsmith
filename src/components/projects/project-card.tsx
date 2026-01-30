"use client";

import { FolderOpen, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import type { Project } from "~/db";
import { deleteProject } from "~/db/hooks/use-projects";

interface ProjectCardProps {
	project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
	const handleDelete = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (
			confirm(
				"Are you sure you want to delete this project? This will delete all prompts and versions.",
			)
		) {
			await deleteProject(project.id);
		}
	};

	return (
		<Link href={`/${project.slug}`}>
			<Card className="group cursor-pointer transition-colors hover:bg-accent/50">
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<FolderOpen className="h-5 w-5 text-muted-foreground" />
							<div>
								<CardTitle className="text-base">{project.name}</CardTitle>
								<CardDescription>
									Created {project.createdAt.toLocaleDateString()}
								</CardDescription>
							</div>
						</div>
						<Button
							className="opacity-0 transition-opacity group-hover:opacity-100"
							onClick={handleDelete}
							size="icon"
							variant="ghost"
						>
							<Trash2 className="h-4 w-4 text-destructive" />
						</Button>
					</div>
				</CardHeader>
			</Card>
		</Link>
	);
}
