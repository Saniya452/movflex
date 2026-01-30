'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import SearchBar from '@/components/ui/SearchBar';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/movies', label: 'Movies' },
  { href: '/tv-shows', label: 'TV Shows' },
  { href: '/watchlist', label: 'Watchlist' },
];

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open (avoid layout shift from scrollbar)
  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, Math.abs(parseInt(scrollY, 10)));
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full min-w-0 max-w-[100vw] bg-black/80 backdrop-blur-lg border-b border-zinc-800/50">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 min-w-0">
        {/* Main row: logo | search (md+) | nav (lg+) | hamburger (md-) */}
        <div className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto] lg:grid-cols-[auto_1fr_auto] h-16 items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
          {/* Logo */}
          <Link href="/" className="shrink-0 -ml-1 sm:ml-0 flex items-center min-w-0">
            <Image
              src="/images/logo-dark-transparent.png"
              alt="Moviflex"
              width={176}
              height={56}
              className="object-contain h-6 sm:h-7 w-auto max-w-[140px] sm:max-w-none"
            />
          </Link>

          {/* Search: visible on tablet+ in center; hidden on mobile (moved to menu) */}
          <div className="hidden md:block flex-1 min-w-0 w-full max-w-none justify-self-stretch lg:justify-self-stretch">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>

          {/* Right column: desktop nav (md+) or hamburger (mobile only) */}
          <div className="flex items-center justify-end shrink-0">
            <div className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-6">
              {navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`text-sm font-medium transition-colors rounded-lg px-2 py-2 sm:px-3 hover:bg-white/10 whitespace-nowrap ${
                    pathname === href
                      ? 'text-emerald-400'
                      : 'text-white hover:text-emerald-400'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu: portal into body so it always appears above hero section */}
      {typeof document !== 'undefined' &&
        mobileMenuOpen &&
        createPortal(
          <div
            className="md:hidden fixed inset-0 top-16 z-[100] bg-black/95 backdrop-blur-md overflow-hidden"
            aria-hidden={false}
          >
            <div className="flex flex-col min-h-0 h-full overflow-y-auto overflow-x-hidden px-4 pt-6 pb-8 w-full max-w-full">
              {/* Search in menu (mobile) */}
              <div className="mb-6 shrink-0">
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </div>
              {/* Nav links — hero section ke upar dikhenge */}
              <nav className="flex flex-col gap-1 shrink-0 pt-2" aria-label="Mobile navigation">
                {navItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-base font-medium transition-colors rounded-xl px-4 py-3 hover:bg-white/10 border border-transparent ${
                      pathname === href
                        ? 'text-emerald-400 bg-white/5 border-white/10'
                        : 'text-white hover:text-emerald-400'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>,
          document.body
        )}
    </nav>
  );
}
