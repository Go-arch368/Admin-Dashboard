"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Layout } from '@/components/layout/layout';
import { ModeToggle } from '@/components/stepper/mode-toggle';
import StepperComponents from '@/components/stepper/stepperComponents';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const excludeStepperPaths = ['/dashboard', '/chats',"/crud"];
  const showStepper = !excludeStepperPaths.includes(pathname);

  useEffect(() => {
    console.log(`Navigated to ${pathname} at ${performance.now()}`);
    router.prefetch("/welcome");
    router.prefetch("/business-info");
    router.prefetch("/location");
    router.prefetch("/contact&timings");
    router.prefetch("/services");
    router.prefetch("/review&publish");
  }, [router, pathname]);

  return (
    <Layout>
      {showStepper && (
        <>
          <ModeToggle />
          <StepperComponents />
        </>
      )}
      {children}
    </Layout>
  );
}