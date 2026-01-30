"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createPrompt } from "~/db/hooks/use-prompts";
import { createVersion } from "~/db/hooks/use-versions";

interface CreatePromptDialogProps {
	projectId: string;
	projectSlug: string;
}

export function CreatePromptDialog({
	projectId,
	projectSlug,
}: CreatePromptDialogProps) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim()) return;

		setIsLoading(true);
		try {
			const prompt = await createPrompt(projectId, name.trim());
			// Create initial version
			const version = await createVersion(prompt.id);
			setOpen(false);
			setName("");
			router.push(`/${projectSlug}/${prompt.slug}/${version.versionNumber}`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					New Prompt
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>Create Prompt</DialogTitle>
						<DialogDescription>Create a new prompt template.</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								autoFocus
								id="name"
								onChange={(e) => setName(e.target.value)}
								placeholder="My Prompt"
								value={name}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button disabled={!name.trim() || isLoading} type="submit">
							{isLoading ? "Creating..." : "Create"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
