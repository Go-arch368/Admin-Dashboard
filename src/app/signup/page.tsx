'use client'; // Ensure this is a client component

import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => (
    <div className="flex justify-center items-center h-screen">
      <SignUp redirectUrl="/dashboard" />
    </div>
  );

export default SignUpPage;