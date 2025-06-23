import MasterLayout from "@/layout/MasterLayout";
import React from "react";
import { Breadcrumb } from "react-bootstrap";
import UserUpdateForm from "./UserUpdateForm";

const Edit = () => {
    return (
        <MasterLayout>
            <Breadcrumb title="User Update" />
            <UserUpdateForm />
        </MasterLayout>
    );
};

export default Edit;
