import { ServiceItem } from '@/types/service';

export interface WordScrollerProps {
  /**
   * The prefix text that appears before the scrolling words
   */
  prefix?: string;

  /**
   * Array of words to scroll through
   */
  words: ServiceItem[] | string[];

  /**
   * Color theme ('dark', 'light', or 'system')
   */
  theme?: 'dark' | 'light' | 'system';

  /**
   * Whether to animate the words
   */
  animate?: boolean;

  /**
   * Whether to enable scroll snapping
   */
  snap?: boolean;

  /**
   * Starting hue value (0-1000)
   */
  startHue?: number;

  /**
   * Ending hue value (0-1000)
   */
  endHue?: number;

  /**
   * Whether to show the scrollbar
   */
  showScrollbar?: boolean;

  /**
   * Whether to show debug outlines
   */
  debug?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * The last word to display for accessibility
   */
  endWord: string;

  /**
   * Title
   */
  title: string;

  /**
   * Description
   */
  description: string;

  /**
   * Action
   */
  action: string;
}
