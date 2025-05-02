import { Layout } from "@/components/layout/layout";
import StepperComponents from "@/components/stepper/stepperComponents";
import LocationPage from "@/components/stepper/locationpage";
import { ModeToggle } from "@/components/stepper/mode-toggle";
export default function Location(){
  return(
    <>
    <Layout>
      <ModeToggle/>
      <StepperComponents/>
      <LocationPage/>
    </Layout>
    </>
  )
}

