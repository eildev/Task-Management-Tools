import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Icon } from '@iconify/react';
import { router } from '@inertiajs/react';

const Myprofile = ({ status, mustVerifyEmail, className = '' }) => {
    const user = usePage().props.auth.user;

    // State for password visibility toggles
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    // Form data and Inertia.js form handling
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        image: null, // Changed to null to avoid string issues
        bio: user.bio_data || '',
        password: '',
        password_confirmation: '',
    });

    // Toggle password visibility
    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

    // Form submission
    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phone', data.phone);
        formData.append('bio_data', data.bio);
        if (data.password) {
            formData.append('password', data.password);
            formData.append('password_confirmation', data.password_confirmation); // Added
        }
        if (data.image instanceof File) {
            formData.append('image', data.image);
        }

        router.post(route('profile.update'), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Profile updated successfully!');
            },
           onError: (errors) => {
            if (errors.password) {
                toast.error(errors.password); // ✅ show password error directly
            } else {
                toast.error('Something went wrong! Check the form for errors.');
            }
        },
        });
    };

    // Image upload preview
    const readURL = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file); // Update form data with file
            const preview = document.getElementById('imagePreview');
            preview.style.backgroundImage = `url(${URL.createObjectURL(file)})`;
        }
    };

    return (
        <div className={`container mx-auto px-4 py-8 ${className}`}>
            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* User Info Card */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                        <img
                            src={user.image ? `${user.image}` : '/assets/images/user-grid/user-grid-bg1.png'}
                            alt="Background"
                            className="w-full h-32 object-cover"
                        />
                        <div className="p-6 mt-[-80px] text-center">
                            <img
                                src={user.image ? `${user.image}` : '/assets/images/user-grid/user-grid-img14.png'}
                                alt="Profile"
                                className="w-32 h-32 rounded-full border-4 border-white mx-auto object-cover"
                            />
                            <h6 className="mt-4 text-lg font-semibold text-gray-800">{user.name}</h6>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <div className="mt-6 text-left">
                                <h6 className="text-md font-semibold text-gray-700 mb-4">Personal Info</h6>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex">
                                        <span className="w-1/3 font-medium text-gray-600">Full Name:</span>
                                        <span className="w-2/3 text-gray-500">{user.name}</span>
                                    </li>
                                    <li className="flex">
                                        <span className="w-1/3 font-medium text-gray-600">Email:</span>
                                        <span className="w-2/3 text-gray-500">{user.email}</span>
                                    </li>
                                    <li className="flex">
                                        <span className="w-1/3 font-medium text-gray-600">Phone:</span>
                                        <span className="w-2/3 text-gray-500">{user.phone || 'N/A'}</span>
                                    </li>
                                    <li className="flex">
                                        <span className="w-1/3 font-medium text-gray-600">Bio:</span>
                                        <span className="w-2/3 text-gray-500">{user.bio_data || 'N/A'}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Edit Card */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
                        {/* Tabs */}
                        <ul className="nav nav-pills mb-6 flex space-x-2 border-b" id="pills-tab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link px-4 py-2 text-lg font-medium text-gray-700 active bg-blue-50 rounded-md"
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
                                    className="nav-link px-4 py-2 text-lg font-medium text-gray-700 hover:bg-blue-50 rounded-md"
                                    id="pills-change-password-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-change-password"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-change-password"
                                    aria-selected="false"
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
                            >
                                <h6 className="text-lg font-semibold text-gray-700 mb-4">Profile Image</h6>
                                <div className="mb-6">
                                    <div className="relative w-32 h-32">
                                        <div
                                            id="imagePreview"
                                            className="w-full h-full rounded-full bg-gray-200 bg-cover bg-center"
                                            style={{
                                                backgroundImage: `url(${
                                                    data.image instanceof File
                                                        ? URL.createObjectURL(data.image)
                                                        : user.image
                                                        ? `${user.image}`
                                                        : '/assets/images/user-grid/user-grid-img14.png'
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
                                            <Icon icon="ri:camera-line" className="text-lg" />
                                        </label>
                                    </div>
                                </div>

                                <form onSubmit={submit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="name" value="Full Name" />
                                            <TextInput
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                required
                                                autoComplete="name"
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="email" value="Email" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                required
                                                autoComplete="username"
                                            />
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="phone" value="Phone" />
                                            <TextInput
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                            />
                                            <InputError message={errors.phone} className="mt-2" />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <InputLabel htmlFor="bio" value="Bio" />
                                            <textarea
                                                id="bio"
                                                value={data.bio}
                                                onChange={(e) => setData('bio', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                rows="4"
                                                placeholder="Write your bio..."
                                            />
                                            <InputError message={errors.bio} className="mt-2" />
                                        </div>
                                    </div>

                                    {mustVerifyEmail && user.email_verified_at === null && (
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Your email address is unverified.{' '}
                                                <Link
                                                    href={route('verification.send')}
                                                    method="post"
                                                    as="button"
                                                    className="text-blue-600 underline hover:text-blue-800"
                                                >
                                                    Click here to re-send the verification email.
                                                </Link>
                                            </p>
                                            {status === 'verification-link-sent' && (
                                                <div className="mt-2 text-sm text-green-600">
                                                    A new verification link has been sent to your email address.
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
                                            <p className="text-sm text-gray-600">Saved.</p>
                                        </Transition>
                                    </div>
                                </form>
                            </div>

                            {/* Change Password Tab */}
                            <div
                                className="tab-pane fade"
                                id="pills-change-password"
                                role="tabpanel"
                                aria-labelledby="pills-change-password-tab"
                            >
                                <form onSubmit={submit} className="space-y-6">
                                    <div>
                                        <InputLabel htmlFor="password" value="New Password" />
                                        <div className="relative">
                                            <TextInput
                                                id="password"
                                                type={passwordVisible ? 'text' : 'password'}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                autoComplete="new-password"
                                            />
                                            <span
                                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                                onClick={togglePasswordVisibility}
                                            >
                                                <Icon icon={passwordVisible ? 'ri:eye-off-line' : 'ri:eye-line'} />
                                            </span>
                                        </div>
                                        <InputError message={errors.password} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                        <div className="relative">
                                            <TextInput
                                                id="password_confirmation"
                                                type={confirmPasswordVisible ? 'text' : 'password'}
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                                                autoComplete="new-password"
                                            />
                                            <span
                                                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                                onClick={toggleConfirmPasswordVisibility}
                                            >
                                                <Icon icon={confirmPasswordVisible ? 'ri:eye-off-line' : 'ri:eye-line'} />
                                            </span>
                                        </div>
                                        <InputError message={errors.password_confirmation} className="mt-2" />
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
