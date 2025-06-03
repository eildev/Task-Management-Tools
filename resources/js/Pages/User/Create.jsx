import React from 'react';

import MasterLayout from '@/layout/MasterLayout';
import Breadcrumb from '@/components/Breadcrumb';

import CreateForm from './CreateForm';

import 'react-toastify/dist/ReactToastify.css';

const UserCreate=()=>{


    return(
        <>
            <MasterLayout>
                <Breadcrumb title="User Create" />

                 <CreateForm></CreateForm>


                </MasterLayout>

        </>
    )

}

export default UserCreate;
