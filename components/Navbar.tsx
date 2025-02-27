"use client";

import { Dictionary } from "@/types/dictionary";
import { NavDock } from "./NavDock";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SettingsPanel } from "@/components/SettingsPanel";

type NavbarProps = {
  dictionary: Dictionary;
};

export function Navbar({ dictionary }: NavbarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <div className="pointer-events-auto fixed inset-x-0 z-30 mx-auto flex origin-bottom h-full max-h-14 bottom-10 md:top-0 md:bottom-auto mb-4 md:mb-0 md:mt-0 transition-all duration-300">
        <NavDock
          dictionary={dictionary}
          onSettingsClick={() => setIsSettingsOpen(true)}
        />
      </div>

      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent>
          <SheetHeader className="border-b">
            <SheetTitle>{dictionary.settings.title}</SheetTitle>
            <SheetDescription>
              {dictionary.settings.description}
            </SheetDescription>
          </SheetHeader>
          <SettingsPanel dictionary={dictionary} />
        </SheetContent>
      </Sheet>
    </>
  );
}
