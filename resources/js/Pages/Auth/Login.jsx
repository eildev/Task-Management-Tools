import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Icon } from "@iconify/react";


const Login = ({ status, canResetPassword ,canRegister }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

//    return (
//     <>
//         <Head title="Login" />
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4">
//             <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
//                 <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
//                     Welcome Back 👋
//                 </h2>
//                 <p className="text-sm text-center text-gray-500 mb-6">
//                     Please login to your account
//                 </p>

//                 {status && (
//                     <div className="mb-4 text-sm font-medium text-green-600">
//                         {status}
//                     </div>
//                 )}

                // <form onSubmit={submit} className="space-y-5">
                //     {/* Email */}
                //     <div>
                //         <InputLabel htmlFor="email" value="Email Address" />
                //         <TextInput
                //             id="email"
                //             type="email"
                //             name="email"
                //             value={data.email}
                //             className="mt-1 block w-full"
                //             autoComplete="username"
                //             isFocused={true}
                //             onChange={(e) => setData('email', e.target.value)}
                //         />
                //         <InputError message={errors.email} className="mt-1 text-red-500 text-sm" />
                //     </div>

                //     {/* Password */}
                //     <div>
                //         <InputLabel htmlFor="password" value="Password" />
                //         <TextInput
                //             id="password"
                //             type="password"
                //             name="password"
                //             value={data.password}
                //             className="mt-1 block w-full"
                //             autoComplete="current-password"
                //             onChange={(e) => setData('password', e.target.value)}
                //         />
                //         <InputError message={errors.password} className="mt-1 text-red-500 text-sm" />
                //     </div>

                //     {/* Remember + Forgot */}
                //     <div className="flex items-center justify-between text-sm">
                //         <label className="flex items-center">
                //             <Checkbox
                //                 name="remember"
                //                 checked={data.remember}
                //                 onChange={(e) => setData('remember', e.target.checked)}
                //             />
                //             <span className="ml-2 text-gray-600">Remember me</span>
                //         </label>

                //         {canResetPassword && (
                //             <Link
                //                 href={route('password.request')}
                //                 className="text-indigo-600 hover:underline font-medium"
                //             >
                //                 Forgot password?
                //             </Link>
                //         )}
                //     </div>

                //     {/* Submit Button */}
                //     <div>
                //         <PrimaryButton
                //             className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                //             disabled={processing}
                //         >
                //             Log in
                //         </PrimaryButton>
                //     </div>
                // </form>

//                 {/* Sign up */}
//                 <div className="mt-6 text-center text-sm text-gray-600">
//                     Don’t have an account?{' '}
//                     {canRegister && (
//                         <Link
//                             href={route('register')}
//                             className="text-indigo-600 font-medium hover:underline"
//                         >
//                             Sign up
//                         </Link>
//                     )}
//                 </div>
//             </div>
//         </div>
//     </>
// );
   return(
    <>
       {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
            )}

        <section className="auth bg-base d-flex flex-wrap">
                    <div className="auth-left d-lg-block d-none">
                        <div className="d-flex align-items-center flex-column h-100 justify-content-center">
                            <img src="assets/images/auth/auth-img.png" alt="" />
                        </div>
                    </div>
                    <div className="auth-right py-32 px-24 d-flex flex-column justify-content-center">
                        <div className="max-w-464-px mx-auto w-100">
                            <div>
                                <Link href="/" className="mb-40 max-w-290-px">
                                    <img src="assets/images/logo.png" alt="" />
                                </Link>
                                <h4 className="mb-12">Sign In to your Account</h4>
                                <p className="mb-32 text-secondary-light text-lg">
                                    Welcome back! please enter your detail
                                </p>
                            </div>
                            {/* <form action="#">
                                <div className="icon-field mb-16">
                                    <span className="icon top-50 translate-middle-y">
                                        <Icon icon="mage:email" />
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control h-56-px bg-neutral-50 radius-12"
                                        placeholder="Email"
                                    />
                                </div>
                                <div className="position-relative mb-20">
                                    <div className="icon-field">
                                        <span className="icon top-50 translate-middle-y">
                                            <Icon icon="solar:lock-password-outline" />
                                        </span>
                                        <input
                                            type="password"
                                            className="form-control h-56-px bg-neutral-50 radius-12"
                                            id="your-password"
                                            placeholder="Password"
                                        />
                                    </div>
                                    <span
                                        className="toggle-password ri-eye-line cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light"
                                        data-toggle="#your-password"
                                    />
                                </div>
                                <div className="">
                                    <div className="d-flex justify-content-between gap-2">
                                        <div className="form-check style-check d-flex align-items-center">
                                            <input
                                                className="form-check-input border border-neutral-300"
                                                type="checkbox"
                                                defaultValue=""
                                                id="remeber"
                                            />
                                            <label className="form-check-label" htmlFor="remeber">
                                                Remember me{" "}
                                            </label>
                                        </div>
                                        <Link to="#" className="text-primary-600 fw-medium">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
                                >
                                    {" "}
                                    Sign In
                                </button>
                                <div className="mt-32 center-border-horizontal text-center">
                                    <span className="bg-base z-1 px-4">Or sign in with</span>
                                </div>
                                <div className="mt-32 d-flex align-items-center gap-3">
                                    <button
                                        type="button"
                                        className="fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50"
                                    >
                                        <Icon
                                            icon="ic:baseline-facebook"
                                            className="text-primary-600 text-xl line-height-1"
                                        />
                                        Google
                                    </button>
                                    <button
                                        type="button"
                                        className="fw-semibold text-primary-light py-16 px-24 w-50 border radius-12 text-md d-flex align-items-center justify-content-center gap-12 line-height-1 bg-hover-primary-50"
                                    >
                                        <Icon
                                            icon="logos:google-icon"
                                            className="text-primary-600 text-xl line-height-1"
                                        />
                                        Google
                                    </button>
                                </div>
                                <div className="mt-32 text-center text-sm">
                                    <p className="mb-0">
                                        Don’t have an account?{" "}
                                        <Link to="/sign-up" className="text-primary-600 fw-semibold">
                                            Sign Up
                                        </Link>
                                    </p>
                                </div>
                            </form> */}
                <form onSubmit={submit} className="space-y-5">
                    {/* Email */}
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-1 text-red-500 text-sm" />
                    </div>

                    {/* Password */}
                    <div>
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-1 text-red-500 text-sm" />
                    </div>

                    {/* Remember + Forgot */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="ml-2 text-gray-600">Remember me</span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-indigo-600 hover:underline font-medium"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    {/* Submit Button */}
                    {/* <div>
                        <PrimaryButton
                            className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                            disabled={processing}
                        >
                            Log in
                        </PrimaryButton>
                    </div> */}

                     <button
                                    type="submit"
                                    className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
                                >
                                    {" "}
                                    Sign In
                                </button>
                                <div className="mt-32 center-border-horizontal text-center">
                                    <span className="bg-base z-1 px-4">Or sign in with</span>
                                </div>
                               
                        </form>
                        </div>
                    </div>
                </section>

    </>
   )

};

export default Login;
