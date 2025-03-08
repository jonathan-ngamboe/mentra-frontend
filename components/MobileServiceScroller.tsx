'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { AnimatedList } from '@/components/magicui/animated-list';
import { ServiceCard } from '@/components/ServiceCard';
import { useTransitionNavigation } from './transitions';
import { ServiceItem } from '@/types/service';

export interface MobileServiceScrollerProps {
  title: string;
  description: string;
  prefix: string;
  services: (ServiceItem | string)[];
  cta: string;
  excludeLabelKeys?: string[];
}

export default function MobileServiceScroller({
  title,
  description,
  prefix = 'you can',
  services = [],
  cta,
  excludeLabelKeys = [],
}: MobileServiceScrollerProps) {
  const { navigateWithTransition } = useTransitionNavigation();

  const filteredServices = services.filter((item) => {
    if (typeof item === 'string') return true;
    return !excludeLabelKeys.includes(item.labelKey || '');
  });

  // Normalize services and add default icons/colors if needed
  const normalizedWords: ServiceItem[] = filteredServices.map((item, index) => {
    const wordItem = typeof item === 'string' ? { text: item } : item;

    // Default icons and colors if not provided
    const defaultIcons = ['💼', '🚀', '💡', '🔧', '📊', '🛠️', '📱', '🌐'];
    const defaultColors = [
      '#00C9A7',
      '#FFB800',
      '#FF3D71',
      '#1E86FF',
      '#9747FF',
      '#38B000',
      '#F94144',
      '#4361EE',
    ];

    return {
      ...wordItem,
      icon: wordItem.icon || defaultIcons[index % defaultIcons.length],
      color: wordItem.color || defaultColors[index % defaultColors.length],
    };
  });

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <div className="w-full content-center px-4 py-8 max-w-md mx-auto">
      {/* Header section */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: -20 }}
        animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-3">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base pb-4 border-b-4 border-foreground">
          {description}
        </p>
      </motion.div>

      {/* Prefix header */}
      <h2 className="text-xl sm:text-2xl font-bold mb-6 sticky top-0 border-gray-100 dark:border-gray-800 z-10 first-letter:uppercase">
        {prefix}:
      </h2>

      {/* Services list using AnimatedList */}
      <div className="relative w-full overflow-hidden">
        <AnimatedList>
          {normalizedWords.reverse().map((word, idx) => (
            <ServiceCard
              key={idx}
              word={word}
              cta={cta}
              onClick={() => {
                if (word.link) {
                  navigateWithTransition(word.link);
                }
              }}
            />
          ))}
        </AnimatedList>
      </div>
    </div>
  );
}
