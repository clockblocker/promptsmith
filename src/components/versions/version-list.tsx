"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import type { Project, Prompt } from "~/db";
import { createVersion, useVersions } from "~/db/hooks/use-versions";
import { VersionCard } from "./version-card";

interface VersionListProps {
	project: Project;
	prompt: Prompt;
}

export function VersionList({ project, prompt }: VersionListProps) {
	const versions = useVersions(prompt.id);
	const router = useRouter();

	const handleCreateVersion = async () => {
		const version = await createVersion(prompt.id);
		router.push(`/${project.slug}/${prompt.slug}/${version.versionNumber}`);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="font-bold text-2xl">{prompt.name}</h1>
					<p className="text-muted-foreground">Version history</p>
				</div>
				<Button onClick={handleCreateVersion}>
					<Plus className="mr-2 h-4 w-4" />
					New Version
				</Button>
			</div>

			{versions.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<p className="mb-4 text-muted-foreground">
						No versions yet. Create your first version to get started.
					</p>
					<Button onClick={handleCreateVersion}>
						<Plus className="mr-2 h-4 w-4" />
						New Version
					</Button>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{versions.map((version) => (
						<VersionCard
							key={version.id}
							projectSlug={project.slug}
							promptSlug={prompt.slug}
							version={version}
						/>
					))}
				</div>
			)}
		</div>
	);
}
