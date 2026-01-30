"use client";

import { Eye } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";

interface PromptPreviewProps {
	prompt: string;
}

export function PromptPreview({ prompt }: PromptPreviewProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Eye className="mr-2 h-4 w-4" />
					Show Prompt
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[80vh] max-w-3xl">
				<DialogHeader>
					<DialogTitle>Generated Prompt</DialogTitle>
				</DialogHeader>
				<div className="overflow-auto">
					<pre className="whitespace-pre-wrap rounded-md bg-muted p-4 font-mono text-sm">
						{prompt ||
							"No prompt generated yet. Fill in the fields and add test input."}
					</pre>
				</div>
			</DialogContent>
		</Dialog>
	);
}
