"use client";

import { GitBranch, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import type { Version } from "~/db";
import { deleteVersion } from "~/db/hooks/use-versions";

interface VersionCardProps {
	version: Version;
	projectSlug: string;
	promptSlug: string;
}

export function VersionCard({
	version,
	projectSlug,
	promptSlug,
}: VersionCardProps) {
	const handleDelete = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (confirm("Are you sure you want to delete this version?")) {
			await deleteVersion(version.id);
		}
	};

	return (
		<Link href={`/${projectSlug}/${promptSlug}/${version.versionNumber}`}>
			<Card className="group cursor-pointer transition-colors hover:bg-accent/50">
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<GitBranch className="h-5 w-5 text-muted-foreground" />
							<div>
								<CardTitle className="text-base">
									Version {version.versionNumber}
								</CardTitle>
								<CardDescription>
									Created {version.createdAt.toLocaleDateString()}
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
