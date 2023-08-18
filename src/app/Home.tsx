import React from "react";
import { RedirectType } from "next/dist/client/components/redirect";

import { redirect } from "next/navigation";

const Home: React.FC = () => {
  redirect("/dashboard", RedirectType.replace);
};

export default Home;
