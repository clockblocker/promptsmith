"use client";

import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { MODELS, type ModelId } from "~/lib/ai";

interface ModelSelectorProps {
	selectedModels: ModelId[];
	onChange: (models: ModelId[]) => void;
}

export function ModelSelector({
	selectedModels,
	onChange,
}: ModelSelectorProps) {
	const toggleModel = (modelId: ModelId) => {
		if (selectedModels.includes(modelId)) {
			onChange(selectedModels.filter((id) => id !== modelId));
		} else {
			onChange([...selectedModels, modelId]);
		}
	};

	return (
		<div className="space-y-3">
			<Label>Models</Label>
			<div className="space-y-2">
				{MODELS.map((model) => (
					<div className="flex items-center space-x-2" key={model.id}>
						<Checkbox
							checked={selectedModels.includes(model.id)}
							id={model.id}
							onCheckedChange={() => toggleModel(model.id)}
						/>
						<label
							className="cursor-pointer font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							htmlFor={model.id}
						>
							{model.name}
						</label>
					</div>
				))}
			</div>
		</div>
	);
}
