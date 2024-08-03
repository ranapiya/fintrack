import { Loader2 } from 'lucide-react';
import { SignIn , ClerkLoaded ,ClerkLoading } from '@clerk/nextjs';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full lg:flex lg:flex-col items-center justify-center px-4">
        <div className="text-center space-y-4 pt-16">
          <h1 className="font-bold text-3xl text-[#2EA47]">
            Welcome Back!
          </h1>
          <p className="text-base text-[#8f38a4]">
              Log in to your Account!
          </p>
        </div>
        <div className='text-base text-[#3d6398]'>
            <ClerkLoaded>
        <SignIn  />
        </ClerkLoaded>
        <ClerkLoading>
            <Loader2 className='animate-spin text-muted-foreground'></Loader2>
        </ClerkLoading>
        </div>
      </div>
      <div className="h-full bg-purple-500 hidden lg:flex items-center justify-center">
        <Image src="/logo.svg" height={100} width={100} alt="Logo" />
      </div>
    </div>
  );
}
