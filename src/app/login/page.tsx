// app/login/[[...rest]]/page.tsx

'use client'; // Ensure this is a client component

import { SignIn } from '@clerk/nextjs';

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn redirectUrl="/dashboard" />
    </div>
  );
};

export default LoginPage;
