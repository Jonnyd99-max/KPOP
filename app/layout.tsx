import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KPOP — Your daily K-pop pulse',
  description: 'Artist fact files, member guides, trusted buzz and tour dates—all in one vibrant K-pop app.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

