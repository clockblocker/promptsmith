"use client";

import { Eye, EyeOff, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
	type SettingKey,
	setSetting,
	useSetting,
} from "~/db/hooks/use-settings";

export default function SettingsPage() {
	return (
		<div className="container mx-auto max-w-2xl px-4 py-8">
			<div className="mb-8">
				<h1 className="font-bold text-2xl">Settings</h1>
				<p className="text-muted-foreground">
					Configure your API keys for AI providers
				</p>
			</div>

			<div className="space-y-6">
				<ApiKeyCard
					description="API key for GPT-4o Mini"
					placeholder="sk-..."
					settingKey="openai_api_key"
					title="OpenAI"
				/>
				<ApiKeyCard
					description="API key for Gemini 2.5 Flash"
					placeholder="AIza..."
					settingKey="gemini_api_key"
					title="Google AI"
				/>
			</div>
		</div>
	);
}

interface ApiKeyCardProps {
	title: string;
	description: string;
	settingKey: SettingKey;
	placeholder: string;
}

function ApiKeyCard({
	title,
	description,
	settingKey,
	placeholder,
}: ApiKeyCardProps) {
	const storedValue = useSetting(settingKey);
	const [value, setValue] = useState("");
	const [showKey, setShowKey] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [saved, setSaved] = useState(false);

	useEffect(() => {
		if (storedValue !== undefined) {
			setValue(storedValue);
		}
	}, [storedValue]);

	const handleSave = async () => {
		setIsSaving(true);
		try {
			await setSetting(settingKey, value);
			setSaved(true);
			setTimeout(() => setSaved(false), 2000);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex gap-2">
					<div className="relative flex-1">
						<Input
							className="pr-10"
							onChange={(e) => setValue(e.target.value)}
							placeholder={placeholder}
							type={showKey ? "text" : "password"}
							value={value}
						/>
						<Button
							className="absolute top-0 right-0 h-full"
							onClick={() => setShowKey(!showKey)}
							size="icon"
							type="button"
							variant="ghost"
						>
							{showKey ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</Button>
					</div>
					<Button disabled={isSaving} onClick={handleSave}>
						{saved ? (
							"Saved!"
						) : isSaving ? (
							"Saving..."
						) : (
							<>
								<Save className="mr-2 h-4 w-4" />
								Save
							</>
						)}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
