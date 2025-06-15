import ThemeToggleButton from "@/helper/ThemeToggleButton";
import { Icon } from "@iconify/react";
import { Link } from "@inertiajs/react";
import React from "react";

const Navbar = ({ sidebarControl, sidebarActive, mobileMenuControl, user }) => {
    return (
        <div className="navbar-header">
            <div className="row align-items-center justify-content-between">
                <div className="col-auto">
                    <div className="d-flex flex-wrap align-items-center gap-4">
                        <button
                            type="button"
                            className="sidebar-toggle"
                            onClick={sidebarControl}
                        >
                            {sidebarActive ? (
                                <Icon
                                    icon="iconoir:arrow-right"
                                    className="icon text-2xl non-active"
                                />
                            ) : (
                                <Icon
                                    icon="heroicons:bars-3-solid"
                                    className="icon text-2xl non-active"
                                />
                            )}
                        </button>
                        <button
                            onClick={mobileMenuControl}
                            type="button"
                            className="sidebar-mobile-toggle"
                        >
                            <Icon
                                icon="heroicons:bars-3-solid"
                                className="icon"
                            />
                        </button>
                        <form className="navbar-search">
                            <input
                                type="text"
                                name="search"
                                placeholder="Search"
                            />
                            <Icon icon="ion:search-outline" className="icon" />
                        </form>
                    </div>
                </div>
                <div className="col-auto">
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        <ThemeToggleButton />
                        <div className="dropdown">
                            <button
                                className="has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center"
                                type="button"
                                data-bs-toggle="dropdown"
                            >
                                <Icon
                                    icon="mage:email"
                                    className="text-primary-light text-xl"
                                />
                            </button>
                            <div className="dropdown-menu to-top dropdown-menu-lg p-0">
                                <div className="m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                                    <div>
                                        <h6 className="text-lg text-primary-light fw-semibold mb-0">
                                            Message
                                        </h6>
                                    </div>
                                    <span className="text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center">
                                        05
                                    </span>
                                </div>
                                <div className="max-h-400-px overflow-y-auto scroll-sm pe-4">
                                    <Link
                                        href="#"
                                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between"
                                    >
                                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                                            <span className="w-40-px h-40-px rounded-circle flex-shrink-0 position-relative">
                                                <img
                                                    src="assets/images/notification/profile-3.png"
                                                    alt=""
                                                />
                                                <span className="w-8-px h-8-px bg-success-main rounded-circle position-absolute end-0 bottom-0" />
                                            </span>
                                            <div>
                                                <h6 className="text-md fw-semibold mb-4">
                                                    Kathryn Murphy
                                                </h6>
                                                <p className="mb-0 text-sm text-secondary-light text-w-100-px">
                                                    hey! there i’m...
                                                </p>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column align-items-end">
                                            <span className="text-sm text-secondary-light flex-shrink-0">
                                                12:30 PM
                                            </span>
                                            <span className="mt-4 text-xs text-base w-16-px h-16-px d-flex justify-content-center align-items-center bg-warning-main rounded-circle">
                                                8
                                            </span>
                                        </div>
                                    </Link>
                                    {/* Other message links omitted for brevity */}
                                </div>
                                <div className="text-center py-12 px-16">
                                    <Link
                                        href="#"
                                        className="text-primary-600 fw-semibold text-md"
                                    >
                                        See All Message
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="dropdown">
                            <button
                                className="has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center"
                                type="button"
                                data-bs-toggle="dropdown"
                            >
                                <Icon
                                    icon="iconoir:bell"
                                    className="text-primary-light text-xl"
                                />
                            </button>
                            <div className="dropdown-menu to-top dropdown-menu-lg p-0">
                                <div className="m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                                    <div>
                                        <h6 className="text-lg text-primary-light fw-semibold mb-0">
                                            Notifications
                                        </h6>
                                    </div>
                                    <span className="text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center">
                                        05
                                    </span>
                                </div>
                                <div className="max-h-400-px overflow-y-auto scroll-sm pe-4">
                                    <Link
                                        href="#"
                                        className="px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between"
                                    >
                                        <div className="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
                                            <span className="w-44-px h-44-px bg-success-subtle text-success-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                                                <Icon
                                                    icon="bitcoin-icons:verify-outline"
                                                    className="icon text-xxl"
                                                />
                                            </span>
                                            <div>
                                                <h6 className="text-md fw-semibold mb-4">
                                                    Congratulations
                                                </h6>
                                                <p className="mb-0 text-sm text-secondary-light text-w-200-px">
                                                    Your profile has been
                                                    Verified. Your profile has
                                                    been Verified
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-secondary-light flex-shrink-0">
                                            23 Mins ago
                                        </span>
                                    </Link>
                                    {/* Other notification links omitted for brevity */}
                                </div>
                                <div className="text-center py-12 px-16">
                                    <Link
                                        href="#"
                                        className="text-primary-600 fw-semibold text-md"
                                    >
                                        See All Notification
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="dropdown">
                            <button
                                className="d-flex justify-content-center align-items-center rounded-circle"
                                type="button"
                                data-bs-toggle="dropdown"
                            >
                                <img
                                    src={
                                        user.image
                                            ? `${user.image}`
                                            : "assets/images/user.png"
                                    }
                                    alt="image_user"
                                    className="w-40-px h-40-px object-fit-cover rounded-circle"
                                />
                            </button>
                            <div className="dropdown-menu to-top dropdown-menu-sm">
                                <div className="py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                                    <div>
                                        <h6 className="text-lg text-primary-light fw-semibold mb-2">
                                            {user.name || "Shaidul Islam"}
                                        </h6>
                                        <span className="text-secondary-light fw-medium text-sm">
                                            Admin
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="hover-text-danger"
                                    >
                                        <Icon
                                            icon="radix-icons:cross-1"
                                            className="icon text-xl"
                                        />
                                    </button>
                                </div>
                                <ul className="to-top-list">
                                    <li>
                                        <Link
                                            href={route("profile.edit")}
                                            className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                                        >
                                            <Icon
                                                icon="solar:user-linear"
                                                className="icon text-xl"
                                            />
                                            My Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/email"
                                            className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                                        >
                                            <Icon
                                                icon="tabler:message-check"
                                                className="icon text-xl"
                                            />
                                            Inbox
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/company"
                                            className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3"
                                        >
                                            <Icon
                                                icon="icon-park-outline:setting-two"
                                                className="icon text-xl"
                                            />
                                            Setting
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3"
                                        >
                                            <Icon
                                                icon="lucide:power"
                                                className="icon text-xl"
                                            />
                                            Log Out
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
