import { Layout } from "@/components/layout/layout";
import LocationPage from "@/components/stepper/locationpage";
import { ModeToggle } from "@/components/stepper/mode-toggle";
import StepperComponents from "@/components/stepper/stepperComponents";
export default function Location(){
  return(
    <>
    <Layout>
      {/* <ModeToggle/>
      <StepperComponents/> */}
      <LocationPage/>
    </Layout>
    </>
  )
}

