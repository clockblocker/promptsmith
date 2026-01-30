"use client";

import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

interface AgentRoleEditorProps {
	value: string;
	onChange: (value: string) => void;
}

export function AgentRoleEditor({ value, onChange }: AgentRoleEditorProps) {
	return (
		<div className="space-y-2">
			<Label>Agent Role</Label>
			<Textarea
				className="min-h-[80px]"
				onChange={(e) => onChange(e.target.value)}
				placeholder="You are an expert..."
				value={value}
			/>
			<p className="text-muted-foreground text-xs">
				Define the persona and expertise of the AI agent
			</p>
		</div>
	);
}
