"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import type { Example } from "~/db";
import { createExample } from "~/db/hooks/use-versions";
import { cn } from "~/lib/utils";
import { parseZodSchema, validateAgainstSchema } from "~/lib/zod-validator";

interface ExamplesEditorProps {
	examples: Example[];
	schema: string;
	onChange: (examples: Example[]) => void;
}

export function ExamplesEditor({
	examples,
	schema,
	onChange,
}: ExamplesEditorProps) {
	const parsedSchema = useMemo(() => parseZodSchema(schema), [schema]);

	const addExample = () => {
		onChange([...examples, createExample()]);
	};

	const removeExample = (id: string) => {
		onChange(examples.filter((e) => e.id !== id));
	};

	const updateExample = (
		id: string,
		field: "input" | "output",
		value: string,
	) => {
		onChange(examples.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<Label>Examples</Label>
				<Button onClick={addExample} size="sm" variant="outline">
					<Plus className="mr-1 h-3 w-3" />
					Add
				</Button>
			</div>

			{examples.length === 0 ? (
				<p className="rounded-md border py-4 text-center text-muted-foreground text-sm">
					No examples yet. Add examples to improve prompt quality.
				</p>
			) : (
				<div className="max-h-[300px] space-y-4 overflow-y-auto">
					{examples.map((example, index) => (
						<ExampleItem
							example={example}
							index={index}
							key={example.id}
							onRemove={removeExample}
							onUpdate={updateExample}
							schema={parsedSchema}
						/>
					))}
				</div>
			)}
		</div>
	);
}

interface ExampleItemProps {
	example: Example;
	index: number;
	schema: ReturnType<typeof parseZodSchema>;
	onUpdate: (id: string, field: "input" | "output", value: string) => void;
	onRemove: (id: string) => void;
}

function ExampleItem({
	example,
	index,
	schema,
	onUpdate,
	onRemove,
}: ExampleItemProps) {
	const [validation, setValidation] = useState<{
		valid: boolean;
		error?: string;
	}>({
		valid: true,
	});

	// Debounced validation
	useEffect(() => {
		if (!schema || !example.output.trim()) {
			setValidation({ valid: true });
			return;
		}

		const timeout = setTimeout(() => {
			const result = validateAgainstSchema(schema, example.output);
			setValidation(result);
		}, 300);

		return () => clearTimeout(timeout);
	}, [schema, example.output]);

	return (
		<div className="space-y-2 rounded-md border p-3">
			<div className="flex items-center justify-between">
				<span className="font-medium text-sm">Example {index + 1}</span>
				<Button
					className="h-6 w-6"
					onClick={() => onRemove(example.id)}
					size="icon"
					variant="ghost"
				>
					<Trash2 className="h-3 w-3" />
				</Button>
			</div>
			<div className="space-y-2">
				<div>
					<Label className="text-xs">Input</Label>
					<Textarea
						className="mt-1 min-h-[60px]"
						onChange={(e) => onUpdate(example.id, "input", e.target.value)}
						placeholder="User input..."
						value={example.input}
					/>
				</div>
				<div>
					<Label className="text-xs">Expected Output (JSON)</Label>
					<Textarea
						className={cn(
							"mt-1 min-h-[60px] font-mono text-sm",
							!validation.valid && "border-destructive",
						)}
						onChange={(e) => onUpdate(example.id, "output", e.target.value)}
						placeholder='{"result": "..."}'
						value={example.output}
					/>
					{!validation.valid && validation.error && (
						<p className="mt-1 text-destructive text-xs">{validation.error}</p>
					)}
				</div>
			</div>
		</div>
	);
}
