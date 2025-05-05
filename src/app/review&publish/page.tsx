import { Layout } from "@/components/layout/layout";
import { ModeToggle } from "@/components/stepper/mode-toggle";
import ReviewAndPublishPage from "@/components/stepper/reviewndpublishpage";
import StepperComponents from "@/components/stepper/stepperComponents";
export default function ReviewndPublish(){
  return(
    <>
    <Layout>
      {/* <ModeToggle/>
      <StepperComponents/> */}
      <ReviewAndPublishPage/>
    </Layout>
    </>
  )
}

