'use client';

import Link from 'next/link';
import { useTransitionNavigation } from './useTransitionNavigation';
import '@/styles/transitions.css';

type TransitionLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function TransitionLink({ href, children, className = '' }: TransitionLinkProps) {
  const { handleLinkClick } = useTransitionNavigation();

  return (
    <Link 
      href={href} 
      onClick={(e) => handleLinkClick(e, href)} 
      className={className}
    >
      {children}
    </Link>
  );
}