"use client";

import React from "react";
import { forwardRef, useState, useEffect, useCallback, useMemo } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dictionary } from "@/types/dictionary";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

interface LanguageConfig {
  flag: string;
  name: string;
  path: string;
}

const CONFIG = {
  languages: {
    en: {
      flag: "/flags/gb.svg",
      name: "english",
      path: "en",
    },
    fr: {
      flag: "/flags/fr.svg",
      name: "french",
      path: "fr",
    },
  } as const satisfies Record<string, LanguageConfig>,

  themes: {
    light: "light",
    dark: "dark",
  } as const,
} as const;

type Theme = keyof typeof CONFIG.themes;
type Language = keyof typeof CONFIG.languages;

interface SettingsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  style?: React.CSSProperties;
  className?: string;
  dictionary: Dictionary;
}

const SettingsPanel = forwardRef<HTMLDivElement, SettingsPanelProps>(
  ({ dictionary, className, ...rest }, ref) => {
    const router = useRouter();

    // Initialize with default values
    const [selectedLanguage, setSelectedLanguage] = useState<Language>("en");
    const { theme, setTheme } = useTheme();

    // Initialize language based on path after component mounts
    useEffect(() => {
      const path = window.location.pathname;
      const initialLanguage =
        (Object.entries(CONFIG.languages).find(([_langKey, config]) =>
          path.startsWith(`/${config.path}`)
        )?.[0] as Language) || "en";

      setSelectedLanguage(initialLanguage);
    }, []);

    const themeButtons = useMemo(
      () => [
        {
          size: "l" as const,
          label: dictionary.settings.theme.light,
          value: CONFIG.themes.light,
          prefixIcon: "light",
        },
        {
          size: "l" as const,
          label: dictionary.settings.theme.dark,
          value: CONFIG.themes.dark,
          prefixIcon: "dark",
        },
      ],
      [dictionary]
    );

    const handleThemeChange = useCallback(
      (value: string) => {
        setTheme(value as Theme);
      },
      [setTheme]
    );

    const handleLanguageChange = useCallback(
      (value: string) => {
        const newLanguage = value as Language;
        setSelectedLanguage(newLanguage);

        const currentPath = window.location.pathname;
        const newPath = currentPath.replace(
          /^\/[^/]*/,
          `/${CONFIG.languages[newLanguage].path}`
        );

        router.push(newPath);
      },
      [router]
    );

    const selectedFlag = useMemo(
      () => (
        <Image
          src={CONFIG.languages[selectedLanguage].flag}
          alt={CONFIG.languages[selectedLanguage].name}
          width={24}
          height={16}
        />
      ),
      [selectedLanguage]
    );

    return (
      <div
        className={`flex flex-col w-full gap-4 ${className || ""}`}
        ref={ref}
        {...rest}
      >
        {/* Theme */}
        <div className="flex flex-col w-full px-4 pt-4 gap-2">
          <h3 className="text-md font-medium text-foreground">
            {dictionary.settings.theme.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {dictionary.settings.theme.description}
          </p>
          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={handleThemeChange}
            className="flex w-full"
          >
            {themeButtons.map((button) => (
              <ToggleGroupItem
                key={button.value}
                value={button.value}
                aria-label={button.label}
                className="flex-1 flex items-center justify-center gap-2 cursor-pointer"
              >
                {button.prefixIcon === "light" ? (
                  <SunIcon className="h-4 w-4" />
                ) : (
                  <MoonIcon className="h-4 w-4" />
                )}
                <span>{button.label}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Language */}
        <div className="flex flex-col w-full px-4 pt-2 gap-2">
          <h3 className="text-md font-medium text-foreground">
            {dictionary.settings.language.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {dictionary.settings.language.description}
          </p>
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full cursor-pointer">
              <div className="flex items-center gap-2">
                {selectedFlag}
                <SelectValue>
                  {
                    dictionary.settings.language[
                      CONFIG.languages[selectedLanguage].name
                    ]
                  }
                </SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent>
              {Object.keys(CONFIG.languages).map((lang) => (
                <SelectItem key={lang} value={lang} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Image
                      src={CONFIG.languages[lang as Language].flag}
                      alt={CONFIG.languages[lang as Language].name}
                      width={24}
                      height={16}
                    />
                    <span>
                      {
                        dictionary.settings.language[
                          CONFIG.languages[lang as Language].name
                        ]
                      }
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }
);

SettingsPanel.displayName = "SettingsPanel";

export { SettingsPanel };
