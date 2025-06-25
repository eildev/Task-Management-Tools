import { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import "react-toastify/dist/ReactToastify.css";
import { Icon } from "@iconify/react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";

const Myprofile = ({ status, mustVerifyEmail, className = "" }) => {
    const user = usePage().props.auth.user;

    // State for password visibility toggles
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    // Form data and Inertia.js form handling
    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            image: null, // Changed to null to avoid string issues
            bio: user.bio_data || "",
            password: "",
            password_confirmation: "",
        });

    // Toggle password visibility
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPasswordVisibility = () =>
        setConfirmPasswordVisible(!confirmPasswordVisible);

    // Form submission
    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("phone", data.phone);
        formData.append("bio_data", data.bio);
        if (data.password) {
            formData.append("password", data.password);
            formData.append(
                "password_confirmation",
                data.password_confirmation
            ); // Added
        }
        if (data.image instanceof File) {
            formData.append("image", data.image);
        }

        router.post(route("profile.update"), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Profile updated successfully!");
            },
            onError: (errors) => {
                if (errors.password) {
                    toast.error(errors.password); // ✅ show password error directly
                } else {
                    toast.error(
                        "Something went wrong! Check the form for errors."
                    );
                }
            },
        });
    };

    // Image upload preview
    const readURL = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file); // Update form data with file
            const preview = document.getElementById("imagePreview");
            preview.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
        }
    };

    return (
        <div className="row gy-4">
            {/* User Info Card */}
            <div className="col-lg-4">
                <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
                    <img
                        src="/assets/images/user-grid/user-grid-bg1.jpg"
                        alt="Background"
                        className="w-100 h-40 object-fit-cover"
                    />
                    <div className="pb-24 ms-16 mb-24 me-16  mt--100">
                        <div className="text-center border border-top-0 border-start-0 border-end-0">
                            <img
                                src={
                                    user.image
                                        ? `${user.image}`
                                        : "/assets/images/user-grid/user-grid-img14.png"
                                }
                                alt="Profile"
                                className="border br-white border-width-2-px w-200-px h-200-px rounded-circle object-fit-cover mx-auto"
                            />
                            <h6 className="mb-0 mt-16">{user?.name ?? ""}</h6>
                            <span className="text-secondary-light mb-16">
                                {user?.email ?? ""}
                            </span>
                        </div>
                        <div className="mt-24">
                            <h6 className="text-xl mb-16">Personal Info</h6>
                            <ul>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        Full Name
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {user?.name ?? "N/A"}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        {" "}
                                        Email
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {user?.email ?? ""}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1 mb-12">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        {" "}
                                        Phone Number
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {user.phone || "N/A"}
                                    </span>
                                </li>
                                <li className="d-flex align-items-center gap-1">
                                    <span className="w-30 text-md fw-semibold text-primary-light">
                                        {" "}
                                        Bio
                                    </span>
                                    <span className="w-70 text-secondary-light fw-medium">
                                        : {user.bio_data || "N/A"}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Edit Card */}
            <div className="col-lg-8">
                <div className="card h-100">
                    <div className="card-body p-24">
                        {/* Tabs */}
                        <ul
                            className="nav border-gradient-tab nav-pills mb-20 d-inline-flex"
                            id="pills-tab"
                            role="tablist"
                        >
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center px-24 active"
                                    id="pills-edit-profile-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-edit-profile"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-edit-profile"
                                    aria-selected="true"
                                >
                                    Edit Profile
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center px-24"
                                    id="pills-change-passwork-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-change-passwork"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-change-passwork"
                                    aria-selected="false"
                                    tabIndex={-1}
                                >
                                    Change Password
                                </button>
                            </li>
                        </ul>

                        {/* Tab Content */}
                        <div className="tab-content" id="pills-tabContent">
                            {/* Edit Profile Tab */}
                            <div
                                className="tab-pane fade show active"
                                id="pills-edit-profile"
                                role="tabpanel"
                                aria-labelledby="pills-edit-profile-tab"
                                tabIndex={0}
                            >
                                <h6 className="text-md text-primary-light mb-16">
                                    Profile Image
                                </h6>
                                <div className="mb-6">
                                    <div className="relative w-32 h-32">
                                        <div
                                            id="imagePreview"
                                            className="w-full h-full rounded-full bg-gray-200 bg-cover bg-center"
                                            style={{
                                                backgroundImage: `url(${
                                                    data.image instanceof File
                                                        ? URL.createObjectURL(
                                                              data.image
                                                          )
                                                        : user.image
                                                        ? `${user.image}`
                                                        : "/assets/images/user-grid/user-grid-img14.png"
                                                })`,
                                            }}
                                        />
                                        <input
                                            type="file"
                                            id="imageUpload"
                                            accept=".png, .jpg, .jpeg"
                                            hidden
                                            onChange={readURL}
                                        />
                                        <label
                                            htmlFor="imageUpload"
                                            className="absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full cursor-pointer hover:bg-blue-200"
                                        >
                                            <Icon
                                                icon="ri:camera-line"
                                                className="text-lg"
                                            />
                                        </label>
                                    </div>
                                </div>

                                <form onSubmit={submit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel
                                                htmlFor="name"
                                                value="Full Name"
                                            />
                                            <TextInput
                                                id="name"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                required
                                                autoComplete="name"
                                            />
                                            <InputError
                                                message={errors.name}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel
                                                htmlFor="email"
                                                value="Email"
                                            />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                required
                                                autoComplete="username"
                                            />
                                            <InputError
                                                message={errors.email}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel
                                                htmlFor="phone"
                                                value="Phone"
                                            />
                                            <TextInput
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) =>
                                                    setData(
                                                        "phone",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                            />
                                            <InputError
                                                message={errors.phone}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <InputLabel
                                                htmlFor="bio"
                                                value="Bio"
                                            />
                                            <textarea
                                                id="bio"
                                                value={data.bio}
                                                onChange={(e) =>
                                                    setData(
                                                        "bio",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                rows="4"
                                                placeholder="Write your bio..."
                                            />
                                            <InputError
                                                message={errors.bio}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    {mustVerifyEmail &&
                                        user.email_verified_at === null && (
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Your email address is
                                                    unverified.{" "}
                                                    <Link
                                                        href={route(
                                                            "verification.send"
                                                        )}
                                                        method="post"
                                                        as="button"
                                                        className="text-blue-600 underline hover:text-blue-800"
                                                    >
                                                        Click here to re-send
                                                        the verification email.
                                                    </Link>
                                                </p>
                                                {status ===
                                                    "verification-link-sent" && (
                                                    <div className="mt-2 text-sm text-green-600">
                                                        A new verification link
                                                        has been sent to your
                                                        email address.
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            className="w-full px-6 py-3 text-lg bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-center"
                                            disabled={processing}
                                        >
                                            Save
                                        </button>
                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out duration-200"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out duration-200"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-gray-600">
                                                Saved.
                                            </p>
                                        </Transition>
                                    </div>
                                </form>
                            </div>

                            {/* Change Password Tab */}
                            <div
                                className="tab-pane fade"
                                id="pills-change-passwork"
                                role="tabpanel"
                                aria-labelledby="pills-change-passwork-tab"
                                tabIndex="0"
                            >
                                <form onSubmit={submit} className="space-y-6">
                                    <div>
                                        <InputLabel
                                            htmlFor="password"
                                            value="New Password"
                                        />
                                        <div className="relative">
                                            <TextInput
                                                id="password"
                                                type={
                                                    passwordVisible
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        "password",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                autoComplete="new-password"
                                            />
                                            <span
                                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                                onClick={
                                                    togglePasswordVisibility
                                                }
                                            >
                                                <Icon
                                                    icon={
                                                        passwordVisible
                                                            ? "ri:eye-off-line"
                                                            : "ri:eye-line"
                                                    }
                                                />
                                            </span>
                                        </div>
                                        <InputError
                                            message={errors.password}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="password_confirmation"
                                            value="Confirm Password"
                                        />
                                        <div className="relative">
                                            <TextInput
                                                id="password_confirmation"
                                                type={
                                                    confirmPasswordVisible
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={
                                                    data.password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "password_confirmation",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                autoComplete="new-password"
                                            />
                                            <span
                                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                                onClick={
                                                    toggleConfirmPasswordVisibility
                                                }
                                            >
                                                <Icon
                                                    icon={
                                                        confirmPasswordVisible
                                                            ? "ri:eye-off-line"
                                                            : "ri:eye-line"
                                                    }
                                                />
                                            </span>
                                        </div>
                                        <InputError
                                            message={
                                                errors.password_confirmation
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            className="w-full px-6 py-3 bg-blue-600 text-lg text-white rounded-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed text-center"
                                            disabled={processing}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Myprofile;
