import type { EventMap, EventName } from "./types";

type Listener<T extends EventName> = (payload: EventMap[T]) => void;

const listeners = new Map<EventName, Set<Listener<never>>>();

export function on<T extends EventName>(
	event: T,
	listener: Listener<T>,
): () => void {
	let set = listeners.get(event);
	if (!set) {
		set = new Set();
		listeners.set(event, set);
	}
	set.add(listener as Listener<never>);

	return () => {
		set.delete(listener as Listener<never>);
	};
}

export function emit<T extends EventName>(
	event: T,
	payload: EventMap[T],
): void {
	const set = listeners.get(event);
	if (!set) return;
	for (const listener of set) {
		(listener as Listener<T>)(payload);
	}
}

export function onAll(
	listener: <T extends EventName>(event: T, payload: EventMap[T]) => void,
): () => void {
	const unsubscribers: (() => void)[] = [];
	const events: EventName[] = [
		"project:created",
		"project:deleted",
		"prompt:created",
		"prompt:deleted",
		"version:created",
		"version:updated",
		"version:deleted",
		"result:created",
		"setting:updated",
	];
	for (const event of events) {
		unsubscribers.push(on(event, (payload) => listener(event, payload)));
	}
	return () => {
		for (const unsub of unsubscribers) unsub();
	};
}
