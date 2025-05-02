import { Layout } from "@/components/layout/layout";
import StepperComponents from "@/components/stepper/stepperComponents";
import ReviewAndPublishPage from "@/components/stepper/reviewndpublishpage";
import { ModeToggle } from "@/components/stepper/mode-toggle";
export default function ReviewndPublish(){
  return(
    <>
    <Layout>
      <ModeToggle/>
      <StepperComponents/>
      <ReviewAndPublishPage/>
    </Layout>
    </>
  )
}

