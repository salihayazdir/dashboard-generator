import Link from 'next/link';
import MainMenu from './MainMenu';
import Image from 'next/image';
import logo from '../../public/dashboard_logo.png';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className='flex border-b border-slate-200 justify-between px-8 py-3 items-center shadow-xl shadow-slate-200 bg-white'>
        <Link href='/'>
          <Image src={logo} alt='logo' height={30} />
        </Link>
        <MainMenu />
      </header>
      {children}
    </>
  );
}
