"use client";

import { GitBranch, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import type { Example, Project, Prompt, Version } from "~/db";
import { createResult } from "~/db/hooks/use-results";
import { getSetting } from "~/db/hooks/use-settings";
import { createVersion, updateVersion } from "~/db/hooks/use-versions";
import { generate, type ModelId } from "~/lib/ai";
import { generateXmlPrompt } from "~/lib/prompt-generator";
import { AgentRoleEditor } from "./agent-role-editor";
import { ExamplesEditor } from "./examples-editor";
import { InputsForm } from "./inputs-form";
import { InstructionsEditor } from "./instructions-editor";
import { ModelSelector } from "./model-selector";
import { PromptPreview } from "./prompt-preview";
import { ResultsDisplay } from "./results-display";
import { SchemaEditor } from "./schema-editor";

interface PromptEditorProps {
	project: Project;
	prompt: Prompt;
	version: Version;
}

export function PromptEditor({ project, prompt, version }: PromptEditorProps) {
	const router = useRouter();

	// Local state for editing
	const [schema, setSchema] = useState(version.schema);
	const [examples, setExamples] = useState<Example[]>(version.examples);
	const [instructions, setInstructions] = useState(version.instructions);
	const [agentRole, setAgentRole] = useState(version.agentRole);

	// Test state
	const [inputs, setInputs] = useState<Record<string, string>>({});
	const [selectedModels, setSelectedModels] = useState<ModelId[]>([
		"gemini-2.5-flash",
	]);
	const [results, setResults] = useState<
		Partial<
			Record<ModelId, { output: string; loading: boolean; error?: string }>
		>
	>({});
	const [isGenerating, setIsGenerating] = useState(false);

	// Auto-save with debounce
	useEffect(() => {
		const timeout = setTimeout(() => {
			updateVersion(version.id, {
				schema,
				examples,
				instructions,
				agentRole,
			});
		}, 500);

		return () => clearTimeout(timeout);
	}, [version.id, schema, examples, instructions, agentRole]);

	// Generate XML prompt for preview
	const generatedPrompt = useMemo(() => {
		return generateXmlPrompt({
			agentRole,
			schema,
			examples,
			instructions,
			userInput: inputs,
		});
	}, [agentRole, schema, examples, instructions, inputs]);

	// Handle generation
	const handleGenerate = useCallback(async () => {
		if (selectedModels.length === 0) return;

		setIsGenerating(true);

		// Initialize results with loading state
		const initialResults: Partial<
			Record<ModelId, { output: string; loading: boolean; error?: string }>
		> = {};
		for (const modelId of selectedModels) {
			initialResults[modelId] = { output: "", loading: true };
		}
		setResults(initialResults);

		// Get API keys
		const [openaiKey, geminiKey] = await Promise.all([
			getSetting("openai_api_key"),
			getSetting("gemini_api_key"),
		]);

		// Generate for each model in parallel
		await Promise.all(
			selectedModels.map(async (modelId) => {
				try {
					const output = await generate({
						model: modelId,
						prompt: generatedPrompt,
						openaiApiKey: openaiKey,
						geminiApiKey: geminiKey,
					});

					setResults((prev) => ({
						...prev,
						[modelId]: { output, loading: false },
					}));

					// Save result to database
					await createResult(version.id, inputs, modelId, output);
				} catch (error) {
					setResults((prev) => ({
						...prev,
						[modelId]: {
							output: "",
							loading: false,
							error:
								error instanceof Error ? error.message : "Generation failed",
						},
					}));
				}
			}),
		);

		setIsGenerating(false);
	}, [selectedModels, generatedPrompt, version.id, inputs]);

	// Handle fork (new version)
	const handleFork = useCallback(async () => {
		const newVersion = await createVersion(prompt.id, version);
		router.push(`/${project.slug}/${prompt.slug}/${newVersion.versionNumber}`);
	}, [prompt.id, version, project.slug, prompt.slug, router]);

	return (
		<div className="h-[calc(100vh-3.5rem)] overflow-hidden">
			<div className="grid h-full grid-cols-3 gap-4 p-4">
				{/* Left Panel - Prompt Configuration */}
				<div className="space-y-4 overflow-y-auto pr-2">
					<SchemaEditor onChange={setSchema} value={schema} />
					<ExamplesEditor
						examples={examples}
						onChange={setExamples}
						schema={schema}
					/>
					<InstructionsEditor onChange={setInstructions} value={instructions} />
					<AgentRoleEditor onChange={setAgentRole} value={agentRole} />
				</div>

				{/* Middle Panel - Test Inputs & Controls */}
				<div className="space-y-4 overflow-y-auto px-2">
					<InputsForm inputs={inputs} onChange={setInputs} />
					<ModelSelector
						onChange={setSelectedModels}
						selectedModels={selectedModels}
					/>
					<div className="flex gap-2">
						<PromptPreview prompt={generatedPrompt} />
						<Button
							className="flex-1"
							disabled={isGenerating || selectedModels.length === 0}
							onClick={handleGenerate}
						>
							<Play className="mr-2 h-4 w-4" />
							{isGenerating ? "Generating..." : "Generate"}
						</Button>
					</div>
				</div>

				{/* Right Panel - Results */}
				<div className="space-y-4 overflow-y-auto pl-2">
					<ResultsDisplay results={results} />
					<Button className="w-full" onClick={handleFork} variant="outline">
						<GitBranch className="mr-2 h-4 w-4" />
						New Version (Fork)
					</Button>
				</div>
			</div>
		</div>
	);
}
