'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import LoadingDots from '@/components/placeholder/LoadingDots';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Form({ type }: { type: 'login' | 'register' }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setLoading(true);
        if (type === 'login') {
          signIn('credentials', {
            redirect: false,
            email: e.currentTarget.email.value,
            password: e.currentTarget.password.value,
            // @ts-ignore
          }).then(({ error }) => {
            if (error) {
              setLoading(false);
              console.error(error);
              toast.error('Bilgilerinizi kontrol edin.');
            } else {
              router.refresh();
              router.push('/');
            }
          });
        } else {
          fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: e.currentTarget.email.value,
              password: e.currentTarget.password.value,
            }),
          }).then(async (res) => {
            setLoading(false);
            if (res.status === 200) {
              toast.success(
                'Hesabınız oluşturuldu. Giriş sayfasına yönlendiriliyorsunuz...'
              );
              setTimeout(() => {
                router.push('/giris');
              }, 2000);
            } else {
              const { error } = await res.json();
              console.error(error);
              toast.error('Hesap oluşturulamadı');
            }
          });
        }
      }}
      className='flex flex-col px-4 py-8 space-y-4 bg-gray-50 sm:px-16'
    >
      <div>
        <label htmlFor='email' className='block text-xs text-gray-600'>
          E-posta Adresi
        </label>
        <input
          id='email'
          name='email'
          type='email'
          placeholder='panic@thedis.co'
          autoComplete='email'
          required
          className='block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-black focus:outline-none focus:ring-black sm:text-sm'
        />
      </div>
      <div>
        <label htmlFor='password' className='block text-xs text-gray-600'>
          Şifre
        </label>
        <input
          id='password'
          name='password'
          type='password'
          required
          className='block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:border-black focus:outline-none focus:ring-black sm:text-sm'
        />
      </div>
      <button
        disabled={loading}
        className={`${
          loading
            ? 'cursor-not-allowed border-gray-200 bg-gray-100'
            : 'border-black bg-black text-white hover:bg-white hover:text-black'
        } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
      >
        {loading ? (
          <LoadingDots color='#808080' />
        ) : (
          <p>{type === 'login' ? 'Giriş Yap' : 'Kaydol'}</p>
        )}
      </button>
      {type === 'login' ? (
        <p className='text-sm text-center text-gray-600'>
          {`Hesabınız yok mu? `}
          <Link href='/kayit' className='font-semibold text-gray-800'>
            Üye ol
          </Link>{' '}
        </p>
      ) : (
        <p className='text-sm text-center text-gray-600'>
          {`Hesabınız var mı? `}
          <Link href='/giris' className='font-semibold text-gray-800'>
            Giriş Yap
          </Link>{' '}
        </p>
      )}
    </form>
  );
}
