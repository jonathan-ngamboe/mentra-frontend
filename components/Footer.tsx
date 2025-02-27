import { DockIcon } from "@/components/magicui/dock";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { contact, siteName } from "@/resources/config";
import { Dictionary } from "@/types/dictionary";
import TransitionLink from "@/components/transitions/TransitionLink";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type FooterProps = {
  dictionary: Dictionary;
};

export function Footer({ dictionary }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full flex flex-col items-center">
      <div className="w-full max-w-4xl px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="flex flex-wrap items-center justify-center sm:justify-start">
          <span>© {currentYear} /</span>
          <TransitionLink className="mx-[0.25rem]" href="/">
            {siteName}
          </TransitionLink>
          <span>/ {dictionary.footer.rights}</span>
        </p>

        <div className="flex gap-16">
          {Object.entries(contact.social)
            .filter(([_name, social]) => social.navbar)
            .map(([name, social]) => (
              <DockIcon key={name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TransitionLink
                      href={social.url}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-12"
                      )}
                    >
                      <social.icon className="size-4" />
                    </TransitionLink>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{name}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            ))}
        </div>
        {/* Spacer visible only on small screens */}
        <div className="h-16 block sm:hidden" />
      </div>
    </footer>
  );
}
