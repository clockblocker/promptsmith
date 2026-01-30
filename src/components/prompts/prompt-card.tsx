"use client";

import { FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import type { Prompt } from "~/db";
import { deletePrompt } from "~/db/hooks/use-prompts";

interface PromptCardProps {
	prompt: Prompt;
	projectSlug: string;
}

export function PromptCard({ prompt, projectSlug }: PromptCardProps) {
	const handleDelete = async (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (
			confirm(
				"Are you sure you want to delete this prompt? This will delete all versions.",
			)
		) {
			await deletePrompt(prompt.id);
		}
	};

	return (
		<Link href={`/${projectSlug}/${prompt.slug}`}>
			<Card className="group cursor-pointer transition-colors hover:bg-accent/50">
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<FileText className="h-5 w-5 text-muted-foreground" />
							<div>
								<CardTitle className="text-base">{prompt.name}</CardTitle>
								<CardDescription>
									Created {prompt.createdAt.toLocaleDateString()}
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
