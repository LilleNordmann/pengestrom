'use client';

import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-black">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="h-14 flex items-center justify-between">
          {/* Venstre: LOGO */}
          <div className="min-w-20">
            <Link href="/dashboard" className="text-sm tracking-wide opacity-90">
              LOGO
            </Link>
          </div>

          {/* Midt: Tittel */}
          <div className="text-2xl md:text-3xl font-semibold leading-none text-white">
            Pengestrøm
          </div>

          {/* Høyre: Loggut */}
          <div className="min-w-24 flex justify-end">
            <SignOutButton />
          </div>
        </nav>
      </div>
    </header>
  );
}
