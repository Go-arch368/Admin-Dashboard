import { Layout } from "@/components/layout/layout";
import StepperComponents from "@/components/stepper/stepperComponents";
import ContactAndTimings from "@/components/stepper/contactndtimings";
import { ModeToggle } from "@/components/stepper/mode-toggle";
export default function ContactndTimings(){
  return(
    <>
    <Layout>
      <ModeToggle/>
      <StepperComponents/>
      <ContactAndTimings/>
    </Layout>
    </>
  )
}

