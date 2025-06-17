import Checkbox from "@/components/Checkbox";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Icon } from "@iconify/react";

const Login = ({ status, canResetPassword, canRegister }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <section className="auth bg-base d-flex flex-wrap">
                <div className="auth-left d-lg-block d-none">
                    <div className="d-flex align-items-center flex-column h-100 justify-content-center">
                        <img src="assets/images/login/auth-img.png" alt="" />
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

                        <form onSubmit={submit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value="Email Address"
                                />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-1 text-red-500 text-sm"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.password}
                                    className="mt-1 text-red-500 text-sm"
                                />
                            </div>

                            {/* Remember + Forgot */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <span className="ml-2 text-gray-600">
                                        Remember me
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-indigo-600 hover:underline font-medium"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary text-sm btn-sm px-12 py-16 w-100 radius-12 mt-32"
                            >
                                {" "}
                                Sign In
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Login;
