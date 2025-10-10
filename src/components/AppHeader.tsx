'use client';

import Link from 'next/link';
import Image from 'next/image';
import SignOutButton from '@/components/SignOutButton';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-black">
      <div className="mx-auto max-w-6xl px-4">
        <nav className="h-16 flex items-center justify-between">
          {/* Venstre: Logo + tittel */}
          <Link href="/dashboard" className="flex items-center gap-3 shrink-0" aria-label="Gå til dashboard">
            <Image
              src="/icons/pengestrom-monokrom.svg"
              alt="Pengestrøm"
              width={44}          // intrinsic (for Next/Image)
              height={44}
              priority
              className="h-10 w-auto md:h-11"   // faktisk visningsstørrelse
            />
            <span className="text-2xl md:text-[28px] font-semibold leading-none text-white">
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
