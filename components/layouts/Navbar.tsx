'use client';

import Link from 'next/link';
import { CartButton } from '@/components/shopcart';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const navbarClassName: string = `header-container-content`;

  return (
    <header className={cn('header-container', 'bg-white', 'shadow-sm', 'w-full')}>
      <div
        className={cn(
          `${navbarClassName}-content`,
          'w-full',
          'px-4',
          'py-3',
          'flex',
          'justify-between',
          'items-center'
        )}
      >
        <div className={cn(`${navbarClassName}-content-logo`, 'text-xl', 'font-bold', 'text-blue-600')}>
          <Link
            className={cn(`${navbarClassName}-content-logo-link`, 'text-xl', 'font-bold', 'text-blue-600')}
            href="/"
          >
            Uni Bet
          </Link>
        </div>

        <nav className={cn(`${navbarClassName}-content-nav`, 'hidden', 'md:flex', 'space-x-6')}>
          <Link
            className={cn(
              `${navbarClassName}-content-nav-link`,
              'text-gray-700',
              'hover:text-blue-600',
              'transition-colors'
            )}
            href="/events"
          >
            Event Search
          </Link>
        </nav>

        <div className={cn(`${navbarClassName}-content-cart`, 'flex', 'items-center', 'space-x-4')}>
          <CartButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
