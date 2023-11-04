import AuthForm from '@/components/auth/AuthForm';

export default function Login() {
  return (
    <div className='flex items-center justify-center w-screen h-screen bg-gray-50'>
      <div className='z-10 w-full max-w-md overflow-hidden border border-gray-100 shadow-xl rounded-2xl'>
        <div className='flex flex-col items-center justify-center px-4 py-6 pt-8 space-y-3 text-center bg-white border-b border-gray-200 sm:px-16'>
          <h3 className='text-xl font-semibold'>Giriş Yap</h3>
          <p className='text-sm text-gray-500'>
            E-posta adresiniz ve şifreniz ile giriş yapın
          </p>
        </div>
        <AuthForm type='login' />
      </div>
    </div>
  );
}
