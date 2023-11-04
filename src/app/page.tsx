import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { authOptions } from './api/auth/[...nextauth]/route';
import SignOut from '@/components/auth/SignOut';
import UserInfo from '@/components/auth/UserInfo';

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <div className='min-h-screen flex flex-col p-10 gap-10'>
      <div>
        <h2>Server Session</h2>
        <pre>{JSON.stringify(session)}</pre>
      </div>
      <div>
        <h2>Client Session</h2>
        <UserInfo />
      </div>
      <SignOut />
    </div>
  );
}
