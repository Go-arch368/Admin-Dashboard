import { Layout } from "@/components/layout/layout";
import { ModeToggle } from "@/components/stepper/mode-toggle";
import ServicesPage from "@/components/stepper/servicespage";
import StepperComponents from "@/components/stepper/stepperComponents";
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

