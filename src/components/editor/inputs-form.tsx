"use client";

import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

interface InputsFormProps {
	inputs: Record<string, string>;
	onChange: (inputs: Record<string, string>) => void;
}

export function InputsForm({ inputs, onChange }: InputsFormProps) {
	const handleChange = (key: string, value: string) => {
		onChange({ ...inputs, [key]: value });
	};

	// For now, we use a single "input" field
	// This could be extended to parse schema and create dynamic fields
	const inputValue = inputs.input ?? "";

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label>Test Input</Label>
				<Textarea
					className="min-h-[150px]"
					onChange={(e) => handleChange("input", e.target.value)}
					placeholder="Enter test input to generate with..."
					value={inputValue}
				/>
				<p className="text-muted-foreground text-xs">
					The input that will be sent to the AI along with your prompt
				</p>
			</div>
		</div>
	);
}
