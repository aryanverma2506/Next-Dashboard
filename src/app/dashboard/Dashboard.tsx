import { redirect } from "next/navigation";
import { RedirectType } from "next/dist/client/components/redirect";

const Dashboard: React.FC = () => {
  redirect("/dashboard/my-profile", RedirectType.replace);
};

export default Dashboard;
