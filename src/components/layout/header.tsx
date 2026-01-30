"use client";

import { ChevronRight, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";

interface BreadcrumbItem {
	label: string;
	href: string;
}

export function Header() {
	const pathname = usePathname();
	const breadcrumbs = getBreadcrumbs(pathname);

	return (
		<header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-14 items-center justify-between px-4">
				<div className="flex items-center gap-2">
					<Link className="font-semibold text-lg" href="/">
						Promptsmith
					</Link>
					{breadcrumbs.length > 0 &&
						breadcrumbs.map((crumb, index) => (
							<span className="flex items-center gap-2" key={crumb.href}>
								<ChevronRight className="h-4 w-4 text-muted-foreground" />
								<Link
									className={
										index === breadcrumbs.length - 1
											? "text-foreground"
											: "text-muted-foreground hover:text-foreground"
									}
									href={crumb.href}
								>
									{crumb.label}
								</Link>
							</span>
						))}
				</div>
				<Button asChild size="icon" variant="ghost">
					<Link href="/settings">
						<Settings className="h-5 w-5" />
						<span className="sr-only">Settings</span>
					</Link>
				</Button>
			</div>
		</header>
	);
}

function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
	if (pathname === "/" || pathname === "/settings") {
		return [];
	}

	const parts = pathname.split("/").filter(Boolean);
	const crumbs: BreadcrumbItem[] = [];

	// Project page: /[projectSlug]
	if (parts.length >= 1 && parts[0] !== "settings") {
		crumbs.push({
			label: decodeURIComponent(parts[0] ?? ""),
			href: `/${parts[0]}`,
		});
	}

	// Prompt page: /[projectSlug]/[promptSlug]
	if (parts.length >= 2) {
		crumbs.push({
			label: decodeURIComponent(parts[1] ?? ""),
			href: `/${parts[0]}/${parts[1]}`,
		});
	}

	// Version page: /[projectSlug]/[promptSlug]/[version]
	if (parts.length >= 3) {
		crumbs.push({
			label: `v${parts[2]}`,
			href: `/${parts[0]}/${parts[1]}/${parts[2]}`,
		});
	}

	return crumbs;
}
