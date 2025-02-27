import { Logo } from "@/components/Logo";
import { Dictionary } from "@/types/dictionary";
import { Navbar } from "@/components/Navbar";

type HeaderProps = {
  dictionary: Dictionary;
};

export const Header = ({ dictionary }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-4xl px-8 py-8 sm:px-16">
      <Logo size="m" icon href="/" />
      <Navbar dictionary={dictionary} />
    </div>
  );
};
