import React from "react";

import ChatUI from "@/components/chat/ChatUi.tsx";
import { Layout } from "@/components/layout/layout";
function page() {
  return (
    <div>
     <Layout><ChatUI /></Layout> 
    </div>
  );
}

export default page;
