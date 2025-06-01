import Breadcrumb from "../components/Breadcrumb";
import DashboardLayerOne from "../dashboard/DashboardLayerOne";
import MasterLayout from "../layout/MasterLayout";

export default function Home() {
    return (
        <>
            <MasterLayout>
                <Breadcrumb title="Dashboard" />
                <DashboardLayerOne />
            </MasterLayout>
        </>
    );
}
