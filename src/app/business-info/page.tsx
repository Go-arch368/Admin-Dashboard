import { Layout } from "@/components/layout/layout";
import StepperComponents from "@/components/stepper/stepperComponents";
import BusinessInformation from "@/components/stepper/businessInfopage";
import { ModeToggle } from "@/components/stepper/mode-toggle";
export default function Business(){
  return(
    <>
    <Layout>
      <ModeToggle/>
      <StepperComponents/>
      <BusinessInformation/>
    </Layout>
    </>
  )
}

