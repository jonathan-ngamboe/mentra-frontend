'use client';

import React from 'react';
import { useTransitionNavigation } from './useTransitionNavigation';

interface TransitionAnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

export function TransitionAnchor({ href, children, ...props }: TransitionAnchorProps) {
  const { handleLinkClick } = useTransitionNavigation();

  return (
    <a href={href} onClick={(e) => handleLinkClick(e, href)} {...props}>
      {children}
    </a>
  );
}
