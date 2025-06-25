import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import TextInput from "@/components/TextInput";
import { Icon } from "@iconify/react";
import { useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import toast from "react-hot-toast";

const UserUpdateForm = () => {
    const { props } = usePage();
    const { user } = props; // User data passed from the backend

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    // Initialize form with user data
    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        image: user.image || "", // File input, not pre-filled
        bio_data: user.bio_data || "",
        password: "",
        password_confirmation: "",
        role: user.role || "",
    });

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPasswordVisibility = () =>
        setConfirmPasswordVisible(!confirmPasswordVisible);

    const readURL = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        // Use PUT method for updating the user
        put(route("users.update", user.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("User updated successfully!");
                reset("password", "password_confirmation"); // Reset password fields after success
            },
            onError: () => {
                toast.error("Please check the form for errors.");
            },
        });
    };

    console.log(data.image);

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-body p-24">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="card border">
                            <div className="card-header">
                                <h6 className="text-md text-primary-light mb-16 font-semibold">
                                    Update User
                                </h6>
                            </div>
                            <div className="card-body">
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Upload Image Start */}
                                    <div className="mb-24 mt-16">
                                        <h6 className="text-sm text-primary-light mb-16">
                                            Profile Image
                                        </h6>
                                        <div className="avatar-upload">
                                            <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                                                <input
                                                    type="file"
                                                    id="imageUpload"
                                                    accept=".png, .jpg, .jpeg"
                                                    hidden
                                                    onChange={readURL}
                                                />
                                                <label
                                                    htmlFor="imageUpload"
                                                    className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                                                >
                                                    <Icon
                                                        icon="solar:camera-outline"
                                                        className="icon"
                                                    ></Icon>
                                                </label>
                                            </div>
                                            <div className="avatar-preview">
                                                <div
                                                    id="imagePreview"
                                                    style={{
                                                        backgroundImage: `url(${
                                                            data.image
                                                                ? user.image
                                                                : "/assets/images/user-grid/user-grid-img14.png"
                                                        })`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <InputError
                                            message={errors.image}
                                            className="mt-2"
                                        />
                                    </div>
                                    {/* Upload Image End */}

                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel
                                                htmlFor="name"
                                                value="Full Name"
                                                className="form-label fw-semibold text-primary-light text-sm mb-8 "
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
                                                autoComplete="name"
                                                className="mt-1 block w-full bg-transparent"
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
                                                className="form-label fw-semibold text-primary-light text-sm mb-8"
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
                                                autoComplete="username"
                                                className="mt-1 block w-full bg-transparent"
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
                                                className="form-label fw-semibold text-primary-light text-sm mb-8"
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
                                                className="mt-1 block w-full bg-transparent"
                                            />
                                            <InputError
                                                message={errors.phone}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="role"
                                                value="Role"
                                                className="form-label fw-semibold text-primary-light text-sm mb-8"
                                            />
                                            <select
                                                id="role"
                                                value={data.role}
                                                onChange={(e) =>
                                                    setData(
                                                        "role",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500 bg-transparent"
                                            >
                                                <option value="">
                                                    Select Role
                                                </option>
                                                <option value="admin">
                                                    Admin
                                                </option>
                                                <option value="superadmin">
                                                    Super Admin
                                                </option>
                                                <option value="user">
                                                    User
                                                </option>
                                            </select>
                                            <InputError
                                                message={errors.role}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <InputLabel
                                                htmlFor="bio_data"
                                                value="Bio"
                                                className="form-label fw-semibold text-primary-light text-sm mb-8"
                                            />
                                            <textarea
                                                id="bio_data"
                                                value={data.bio_data}
                                                onChange={(e) =>
                                                    setData(
                                                        "bio_data",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-transparent"
                                                rows="4"
                                                placeholder="Write your bio..."
                                            />
                                            <InputError
                                                message={errors.bio_data}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div>
                                            <InputLabel
                                                htmlFor="password"
                                                value="Password"
                                                className="form-label fw-semibold text-primary-light text-sm mb-8"
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
                                                    autoComplete="new-password"
                                                    className="mt-1 block w-full bg-transparent"
                                                    placeholder="Leave blank to keep unchanged"
                                                />
                                                <span
                                                    onClick={
                                                        togglePasswordVisibility
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
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
                                                className="form-label fw-semibold text-primary-light text-sm mb-8"
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
                                                    autoComplete="new-password"
                                                    className="mt-1 block w-full bg-transparent"
                                                    placeholder="Leave blank to keep unchanged"
                                                />
                                                <span
                                                    onClick={
                                                        toggleConfirmPasswordVisibility
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
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
                                    </div>

                                    {/* Submit */}
                                    <div className="flex items-center justify-center">
                                        <button
                                            className="w-full px-6 py-3 text-center text-lg bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
                                            disabled={processing}
                                        >
                                            Update
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

export default UserUpdateForm;
