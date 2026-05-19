import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Route, Switch } from "wouter";
import PropertiesPage from "./PropertiesPage";
import LeadsPage from "./LeadsPage";
import SetupGuidePage from "./SetupGuidePage";
import SpatialRemote from "../components/SpatialRemote";

export default function Dashboard() {
  const { user, loading } = useAuth();
  // Show WebGL Remote overlayed for all logged in users on Dashboard
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Not authenticated</div>;
  }
  return (
    <div style={{ position: "relative" }}>
      <DashboardLayout>
        <Switch>
          <Route path={`/dashboard`} component={PropertiesPage} />
          <Route path={`/dashboard/properties`} component={PropertiesPage} />
          <Route path={`/dashboard/leads`} component={LeadsPage} />
          <Route path={`/dashboard/setup`} component={SetupGuidePage} />
        </Switch>
      </DashboardLayout>
      {/* Auto-integrate the SpatialRemote overlay here */}
      <SpatialRemote />
    </div>
  );
}