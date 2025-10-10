'use client';

import Link from 'next/link';
import Image from 'next/image';
import SignOutButton from '@/components/SignOutButton';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-black">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="h-14 flex items-center justify-between">
          {/* Venstre: Logo + tittel */}
          <Link href="/dashboard" className="flex items-center gap-3 shrink-0" aria-label="Gå til dashboard">
            {/* Bruk monokrom (hvit) logo for mørk bakgrunn */}
            <Image
              src="/icons/pengestrom-monokrom.svg"
              alt="Pengestrøm"
              width={28}
              height={28}
              priority
              className="h-7 w-auto"
            />
            <span className="text-xl md:text-2xl font-semibold leading-none text-white">
              Pengestrøm
            </span>
          </Link>

          {/* Høyre: Loggut */}
          <div className="min-w-24 flex justify-end">
            <SignOutButton />
          </div>
        </nav>
      </div>
    </header>
  );
}
