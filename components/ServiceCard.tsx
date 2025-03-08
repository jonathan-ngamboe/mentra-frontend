import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ServiceItem } from '@/types/service';

interface ServiceCardProps {
  word: ServiceItem;
  cta: string;
  onClick: () => void;
}

export function ServiceCard({ cta, word, onClick }: ServiceCardProps) {
  const isClickable = !!word.link;

  return (
    <figure
      className={cn(
        'relative mx-auto min-h-fit w-full max-w-[400px] overflow-hidden rounded-2xl p-4 mb-3',
        // animation styles
        'transition-all duration-200 ease-in-out',
        isClickable && 'cursor-pointer hover:scale-[103%]',
        // light styles
        'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
        // dark styles
        'transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]'
      )}
      onClick={onClick}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: word.color,
          }}
        >
          <span className="text-lg">{word.icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden flex-grow">
          <figcaption className="flex flex-row items-center justify-between whitespace-pre text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-lg first-letter:uppercase">{word.text}</span>
            {word.badge && (
              <Badge variant="destructive" className="text-xs font-normal ml-2">
                {word.badge}
              </Badge>
            )}
          </figcaption>

          <div className="flex justify-between items-center">
            <p className="text-sm font-normal dark:text-white/60">{isClickable ? cta : ''}</p>
            {isClickable && (
              <ChevronRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
            )}
          </div>
        </div>
      </div>
    </figure>
  );
}
