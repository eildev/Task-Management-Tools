import MasterLayout from "@/layout/MasterLayout";
import React from "react";
import { Breadcrumb } from "react-bootstrap";
import UserUpdateForm from "./UserUpdateForm";
import UserForm from "./UserForm";
import { usePage } from "@inertiajs/react";

const Edit = () => {
    const { props } = usePage();
    const { user } = props;
    return (
        <MasterLayout>
            <Breadcrumb title="User Update" />
            {/* <UserUpdateForm /> */}

            <UserForm user={user} />
        </MasterLayout>
    );
};

export default Edit;
