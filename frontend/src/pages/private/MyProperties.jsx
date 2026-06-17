import SellerDashboard from "./SellerDashboard";
import BuilderDashboard from "./BuilderDashboard";

export default function MyProperties() {

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role = user?.role;

  if (role === "builder") {
    return <BuilderDashboard />;
  }

  return <SellerDashboard />;
}