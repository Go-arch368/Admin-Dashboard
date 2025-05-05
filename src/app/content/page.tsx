import React from "react";
import { Layout } from "@/components/layout/layout";
import { ModeToggle } from "@/components/stepper/mode-toggle";
import StepperComponents from "@/components/stepper/stepperComponents";
import WelcomePage from "@/components/stepper/welcomepage";


const Page = () => (
  <Layout>
     {/* <ModeToggle/>
         <StepperComponents/> */}
         <WelcomePage/>
  </Layout>
);

export default Page;