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
        image: null, // File input, not pre-filled
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h6 className="text-lg font-semibold text-gray-700 mb-6">
                    Update User
                </h6>

                <form onSubmit={submit} className="space-y-6">
                    {/* Image Upload */}
                    <div className="mb-6">
                        <InputLabel value="Profile Image" />
                        <div className="relative w-32 h-32">
                            <div
                                className="w-full h-full rounded-full bg-gray-200 bg-cover bg-center"
                                style={{
                                    backgroundImage: `url(${
                                        data.image instanceof File
                                            ? URL.createObjectURL(data.image)
                                            : user.image ||
                                              "/assets/images/user-grid/user-grid-img14.png"
                                    })`,
                                }}
                            />
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg"
                                hidden
                                id="image-upload"
                                onChange={readURL}
                            />
                            <label
                                htmlFor="image-upload"
                                className="absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full cursor-pointer hover:bg-blue-200"
                            >
                                <Icon
                                    icon="ri:camera-line"
                                    className="text-lg"
                                />
                            </label>
                        </div>
                        <InputError message={errors.image} className="mt-2" />
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="name" value="Full Name" />
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                autoComplete="name"
                                className="mt-1 block w-full"
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                autoComplete="username"
                                className="mt-1 block w-full"
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="phone" value="Phone" />
                            <TextInput
                                id="phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                                className="mt-1 block w-full"
                            />
                            <InputError
                                message={errors.phone}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="role" value="Role" />
                            <select
                                id="role"
                                value={data.role}
                                onChange={(e) =>
                                    setData("role", e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                            >
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="superadmin">Super Admin</option>
                                <option value="user">User</option>
                            </select>
                            <InputError
                                message={errors.role}
                                className="mt-2"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <InputLabel htmlFor="bio_data" value="Bio" />
                            <textarea
                                id="bio_data"
                                value={data.bio_data}
                                onChange={(e) =>
                                    setData("bio_data", e.target.value)
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                rows="4"
                                placeholder="Write your bio..."
                            />
                            <InputError
                                message={errors.bio_data}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type={passwordVisible ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    autoComplete="new-password"
                                    className="mt-1 block w-full"
                                    placeholder="Leave blank to keep unchanged"
                                />
                                <span
                                    onClick={togglePasswordVisibility}
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
                            />
                            <div className="relative">
                                <TextInput
                                    id="password_confirmation"
                                    type={
                                        confirmPasswordVisible
                                            ? "text"
                                            : "password"
                                    }
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    autoComplete="new-password"
                                    className="mt-1 block w-full"
                                    placeholder="Leave blank to keep unchanged"
                                />
                                <span
                                    onClick={toggleConfirmPasswordVisibility}
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
                                message={errors.password_confirmation}
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
    );
};

export default UserUpdateForm;
