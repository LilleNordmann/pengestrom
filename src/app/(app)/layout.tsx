import type { Metadata } from 'next';
import AppHeader from '@/components/AppHeader';

export const metadata: Metadata = {
  title: 'Pengestrøm',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <main>{children}</main>
    </>
  );
}
