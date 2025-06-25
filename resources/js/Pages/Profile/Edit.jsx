import MasterLayout from "@/layout/MasterLayout";
import { Breadcrumb } from "react-bootstrap";
import Myprofile from "@/ProfileUp/Myprofile";

const Edit = ({ mustVerifyEmail, status }) => {
    return (
        <>
            <MasterLayout>
                <Breadcrumb></Breadcrumb>
                <Myprofile> </Myprofile>
            </MasterLayout>
        </>
    );
};

export default Edit;
