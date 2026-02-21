import type { Project, Prompt, Result, Version } from "~/db";
import type { SettingKey } from "~/db/hooks/use-settings";

export interface EventMap {
	"project:created": { project: Project };
	"project:deleted": { projectId: string };
	"prompt:created": { prompt: Prompt };
	"prompt:deleted": { promptId: string };
	"version:created": { version: Version };
	"version:updated": {
		versionId: string;
		updates: Partial<
			Pick<Version, "schema" | "examples" | "instructions" | "agentRole">
		>;
	};
	"version:deleted": { versionId: string };
	"result:created": { result: Result };
	"setting:updated": { key: SettingKey; value: string };
}

export type EventName = keyof EventMap;
