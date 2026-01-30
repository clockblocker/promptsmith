"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "~/db";

export type SettingKey = "openai_api_key" | "gemini_api_key";

export function useSettings() {
	const settings = useLiveQuery(() => db.settings.toArray());
	return settings ?? [];
}

export function useSetting(key: SettingKey) {
	const setting = useLiveQuery(
		() => db.settings.where("key").equals(key).first(),
		[key],
	);

	return setting?.value;
}

export async function setSetting(
	key: SettingKey,
	value: string,
): Promise<void> {
	const existing = await db.settings.where("key").equals(key).first();

	if (existing) {
		await db.settings.update(existing.id, { value });
	} else {
		await db.settings.add({
			id: crypto.randomUUID(),
			key,
			value,
		});
	}
}

export async function getSetting(key: SettingKey): Promise<string | undefined> {
	const setting = await db.settings.where("key").equals(key).first();
	return setting?.value;
}
