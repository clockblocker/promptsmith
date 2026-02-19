"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "~/db";

/** Union of recognized setting keys for API key storage. */
export type SettingKey = "openai_api_key" | "gemini_api_key";

/**
 * Returns all stored settings as a live-updating array.
 * @returns An array of {@link Setting} objects, or an empty array while loading.
 */
export function useSettings() {
	const settings = useLiveQuery(() => db.settings.toArray());
	return settings ?? [];
}

/**
 * Returns the value of a single setting by key, updating reactively.
 * @param key - The setting key to look up.
 * @returns The setting value string, or `undefined` if not set or still loading.
 */
export function useSetting(key: SettingKey) {
	const setting = useLiveQuery(
		() => db.settings.where("key").equals(key).first(),
		[key],
	);

	return setting?.value;
}

/**
 * Creates or updates a setting. If a setting with the given key already exists,
 * its value is updated in place; otherwise a new record is inserted.
 * @param key - The setting key.
 * @param value - The value to store.
 */
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

/**
 * Reads a setting value directly from the database (non-reactive).
 * @param key - The setting key to look up.
 * @returns The setting value, or `undefined` if not set.
 */
export async function getSetting(key: SettingKey): Promise<string | undefined> {
	const setting = await db.settings.where("key").equals(key).first();
	return setting?.value;
}
