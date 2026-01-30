"use client";

import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { MODELS, type ModelId } from "~/lib/ai";

interface ResultsDisplayProps {
	results: Partial<
		Record<ModelId, { output: string; loading: boolean; error?: string }>
	>;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
	const modelIds = Object.keys(results) as ModelId[];

	if (modelIds.length === 0) {
		return (
			<div className="space-y-2">
				<Label>Results</Label>
				<div className="rounded-md border p-8 text-center">
					<p className="text-muted-foreground">
						Select models and click Generate to see results
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<Label>Results</Label>
			<Tabs className="w-full" defaultValue={modelIds[0]}>
				<TabsList className="w-full">
					{modelIds.map((modelId) => {
						const model = MODELS.find((m) => m.id === modelId);
						return (
							<TabsTrigger className="flex-1" key={modelId} value={modelId}>
								{model?.name ?? modelId}
							</TabsTrigger>
						);
					})}
				</TabsList>
				{modelIds.map((modelId) => {
					const result = results[modelId];
					return (
						<TabsContent key={modelId} value={modelId}>
							<div className="max-h-[500px] min-h-[300px] overflow-auto rounded-md border p-4">
								{result?.loading ? (
									<div className="flex h-full items-center justify-center">
										<p className="text-muted-foreground">Generating...</p>
									</div>
								) : result?.error ? (
									<div className="text-destructive">
										<p className="font-medium">Error</p>
										<p className="text-sm">{result.error}</p>
									</div>
								) : result?.output ? (
									<pre className="whitespace-pre-wrap font-mono text-sm">
										{result.output}
									</pre>
								) : (
									<p className="text-center text-muted-foreground">
										No output yet
									</p>
								)}
							</div>
						</TabsContent>
					);
				})}
			</Tabs>
		</div>
	);
}
