import { Layout } from "@/components/layout/layout";
import StepperComponents from "@/components/stepper/stepperComponents";
import ServicesPage from "@/components/stepper/servicespage";
import { ModeToggle } from "@/components/stepper/mode-toggle";
export default function Services(){
  return(
    <>
    <Layout>
      <ModeToggle/>
      <StepperComponents/>
      <ServicesPage/>
    </Layout>
    </>
  )
}

