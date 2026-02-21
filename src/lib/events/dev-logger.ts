import { onAll } from "./emitter";

export function initDevLogger(): () => void {
	if (process.env.NODE_ENV !== "development") {
		return () => {};
	}

	return onAll((event, payload) => {
		console.debug(`[event] ${event}`, payload);
	});
}
