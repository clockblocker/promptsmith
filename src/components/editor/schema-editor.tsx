"use client";

import Editor from "@monaco-editor/react";
import { useCallback } from "react";
import { Label } from "~/components/ui/label";

interface SchemaEditorProps {
	value: string;
	onChange: (value: string) => void;
}

export function SchemaEditor({ value, onChange }: SchemaEditorProps) {
	const handleChange = useCallback(
		(newValue: string | undefined) => {
			onChange(newValue ?? "");
		},
		[onChange],
	);

	return (
		<div className="space-y-2">
			<Label>Zod Schema</Label>
			<div className="h-[200px] overflow-hidden rounded-md border">
				<Editor
					height="100%"
					language="typescript"
					onChange={handleChange}
					options={{
						minimap: { enabled: false },
						fontSize: 13,
						lineNumbers: "off",
						scrollBeyondLastLine: false,
						padding: { top: 8, bottom: 8 },
						folding: false,
						wordWrap: "on",
						automaticLayout: true,
					}}
					theme="vs-dark"
					value={value}
				/>
			</div>
			<p className="text-muted-foreground text-xs">
				Define the expected output schema using Zod syntax
			</p>
		</div>
	);
}
