"use client";

import { Dock, DockIcon } from "@/components/magicui/dock";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { navbar } from "@/resources/config";
import Link from "next/link";
import { SlidersVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getNestedValue } from "@/lib/utils";

type NavDockProps = {
  dictionary: any;
  onSettingsClick: () => void;
};

export function NavDock({ dictionary, onSettingsClick }: NavDockProps) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if a link is active, considering language prefixes
  const isActive = (href: string) => {
    // Extract language code from pathname (e.g., /en/about -> en)
    const pathParts = pathname.split("/").filter(Boolean);
    const langPrefix = pathParts.length > 0 ? `/${pathParts[0]}` : "";

    // For home page (root of a language)
    if (href === "/" && pathParts.length === 1) {
      return true;
    }

    // For other pages, we need to check if the path after the language prefix matches
    if (href === "/") {
      return false; // Already handled above
    }

    // If href includes language code already
    if (href.startsWith(langPrefix)) {
      return (
        pathname === href ||
        (pathname.startsWith(href) && pathname.charAt(href.length) === "/")
      );
    }

    // If href doesn't include language code (e.g., /about)
    // We need to check against the path without language prefix
    const pathWithoutLang = pathname.substring(langPrefix.length) || "/";
    return (
      pathWithoutLang === href ||
      (pathWithoutLang.startsWith(href) &&
        pathWithoutLang.charAt(href.length) === "/")
    );
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dock
      iconMagnification={60}
      iconDistance={100}
      className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] rounded-2xl border"
    >
      {navbar.map((item) => {
        const active = isActive(item.href);
        return (
          <DockIcon key={item.href}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 relative"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <item.icon className="size-4" />
                  {active && (
                    <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {getNestedValue(dictionary, item.labelKey) || item.labelKey}
                </p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        );
      })}
      <Separator orientation="vertical" className="h-full py-2" />
      <DockIcon>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-12 cursor-pointer"
              onClick={onSettingsClick}
            >
              <SlidersVertical className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{dictionary.settings.title}</p>
          </TooltipContent>
        </Tooltip>
      </DockIcon>
    </Dock>
  );
}
