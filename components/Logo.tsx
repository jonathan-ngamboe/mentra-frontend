"use client";

import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { siteName } from "@/resources/config";
import { useState, useEffect } from "react";

type LogoProps = {
  size?: "xs" | "s" | "m" | "l" | "xl" | "2xl" | "3xl";
  icon?: boolean;
  href?: string;
  className?: string;
  alt?: string;
};

export const Logo = ({
  size = "m",
  icon = false,
  href = "/",
  className = "",
  alt = `${siteName} logo`,
}: LogoProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Size mapping to pixel dimensions for icon
  const sizeMap = {
    xs: { width: 40, height: 40, textSize: "text-base" },
    s: { width: 60, height: 60, textSize: "text-lg" },
    m: { width: 80, height: 80, textSize: "text-xl" },
    l: { width: 100, height: 100, textSize: "text-2xl" },
    xl: { width: 120, height: 120, textSize: "text-3xl" },
    "2xl": { width: 160, height: 160, textSize: "text-4xl" },
    "3xl": { width: 200, height: 200, textSize: "text-5xl" },
  };

  // Get dimensions based on size prop
  const dimensions = sizeMap[size];

  // Determine logo path based on theme
  const getLogoPath = () => {
    if (!mounted) return "/logo-light.svg"; // Default for SSR
    const theme = resolvedTheme === "dark" ? "dark" : "light";
    return `/logo-${theme}.svg`;
  };

  const logoPath = getLogoPath();

  // Create the appropriate logo element based on icon prop
  const logoElement = icon ? (
    // Icon version - show the SVG logo
    <div className={`relative ${className}`}>
      <Image
        src={logoPath}
        width={dimensions.width}
        height={dimensions.height}
        alt={alt}
        priority
        className="transition-opacity duration-300"
      />
    </div>
  ) : (
    // Text version - show the site name as text
    <div className={`${dimensions.textSize} font-bold ${className}`}>
      {siteName}
    </div>
  );

  // If href is provided, wrap in Link
  if (href) {
    return (
      <Link href={href} aria-label={alt}>
        {logoElement}
      </Link>
    );
  }

  // Otherwise return the logo without a link
  return logoElement;
};