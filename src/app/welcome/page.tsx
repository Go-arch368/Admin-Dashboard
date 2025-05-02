import { Layout } from "@/components/layout/layout";
import { ModeToggle } from "@/components/stepper/mode-toggle";
import StepperComponents from "@/components/stepper/stepperComponents";
import WelcomePage from "@/components/stepper/welcomepage";
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

