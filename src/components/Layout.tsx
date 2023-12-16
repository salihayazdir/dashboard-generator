import Link from 'next/link';
import MainMenu from './MainMenu';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className='flex border-b border-slate-200 justify-between px-8 py-3 items-center shadow-xl shadow-slate-200 bg-white'>
        <Link href='/'>
          <h1 className='text-lg font-bold'>Logo</h1>
        </Link>
        <MainMenu />
      </header>
      {children}
    </>
  );
}
