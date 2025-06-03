

import Breadcrumb from "@/components/Breadcrumb";
import DashboardLayerOne from "@/dashboard/DashboardLayerOne";
import MasterLayout from "@/layout/MasterLayout";
import UserTable from "./UserTable";
// import MasterLayout from "../layout/MasterLayout";


const UserIndex=({ users})=> {
      const user = users;
    //   console.log("users:",data);
    return (
        <>
            <MasterLayout>
                {/* <a href="/task">This is Task</a> */}
                <Breadcrumb title="Dashboard" />

                {/* Layout */}
                {/* <DashboardLayerOne /> */}
                <UserTable users={user}/>
            </MasterLayout>
        </>
    );
}

export default UserIndex;
