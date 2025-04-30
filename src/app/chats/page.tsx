import ChatUI from "@/components/chat/ChatUi.tsx";
import React from "react";
import { Layout } from "@/components/layout/layout";
function page() {
  return (
    <div>
     <Layout><ChatUI /></Layout> 
    </div>
  );
}

export default page;
