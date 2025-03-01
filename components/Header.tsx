import { Logo } from '@/components/Logo';
import { Dictionary } from '@/types/dictionary';
import { Navbar } from '@/components/Navbar';

type HeaderProps = {
  dictionary: Dictionary;
};

export const Header = ({ dictionary }: HeaderProps) => {
  return (
    <div className="z-50 flex items-center justify-between w-full max-w-4xl pt-4 fixed px-8 sm:px-16">
      <Logo size="m" icon href="/" hideOnScroll />
      <Navbar dictionary={dictionary} />
    </div>
  );
};
