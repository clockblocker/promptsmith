"use client";

import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

interface InstructionsEditorProps {
	value: string;
	onChange: (value: string) => void;
}

export function InstructionsEditor({
	value,
	onChange,
}: InstructionsEditorProps) {
	return (
		<div className="space-y-2">
			<Label>Instructions</Label>
			<Textarea
				className="min-h-[120px]"
				onChange={(e) => onChange(e.target.value)}
				placeholder="Provide detailed instructions for the AI..."
				value={value}
			/>
			<p className="text-muted-foreground text-xs">
				Step-by-step instructions for how the AI should process the input
			</p>
		</div>
	);
}
