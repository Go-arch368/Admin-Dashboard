import { Layout } from "@/components/layout/layout";
import StepperComponents from "@/components/stepper/stepperComponents";
import WelcomePage from "@/components/stepper/welcomepage";
import { ModeToggle } from "@/components/stepper/mode-toggle";
export default function Welcome(){
  return(
    <>
    <Layout>
      <ModeToggle/>
      <StepperComponents/>
      <WelcomePage/>
    </Layout>
    </>
  )
}

