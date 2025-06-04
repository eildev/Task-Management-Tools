import { Icon } from "@iconify/react";
import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import ThemeToggleButton from "../helper/ThemeToggleButton";

const MasterLayout = ({ children }) => {
    const [sidebarActive, setSidebarActive] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const { url } = usePage();
    const user = usePage().props.auth.user;

    // Enhanced logging to debug
    console.info("MasterLayout: Component loaded");
    console.debug("MasterLayout: Current URL:", url);
    console.debug("MasterLayout: User:", user);

    useEffect(() => {
        console.info("MasterLayout: useEffect triggered with url:", url);

        const handleDropdownClick = (event) => {
            event.preventDefault();
            const clickedLink = event.currentTarget;
            const clickedDropdown = clickedLink.closest(".dropdown");

            if (!clickedDropdown) return;

            const isActive = clickedDropdown.classList.contains("open");

            const allDropdowns = document.querySelectorAll(
                ".sidebar-menu .dropdown"
            );
            allDropdowns.forEach((dropdown) => {
                dropdown.classList.remove("open");
            });

            if (!isActive) {
                clickedDropdown.classList.add("open");
            }
        };

        const dropdownTriggers = document.querySelectorAll(
            ".sidebar-menu .dropdown > a, .sidebar-menu .dropdown > Link"
        );

        dropdownTriggers.forEach((trigger) => {
            trigger.addEventListener("click", handleDropdownClick);
        });

        const openActiveDropdown = () => {
            const allDropdowns = document.querySelectorAll(
                ".sidebar-menu .dropdown"
            );
            allDropdowns.forEach((dropdown) => {
                const submenuLinks = dropdown.querySelectorAll(
                    ".sidebar-submenu li a"
                );
                submenuLinks.forEach((link) => {
                    if (
                        link.getAttribute("href") === url ||
                        link.getAttribute("to") === url
                    ) {
                        dropdown.classList.add("open");
                    }
                });
            });
        };

        openActiveDropdown();

        return () => {
            dropdownTriggers.forEach((trigger) => {
                trigger.removeEventListener("click", handleDropdownClick);
            });
        };
    }, [url]);

    const sidebarControl = () => {
        setSidebarActive(!sidebarActive);
    };

    const mobileMenuControl = () => {
        setMobileMenu(!mobileMenu);
    };

    return (
        <section className={mobileMenu ? "overlay active" : "overlay"}>
            <aside
                className={
                    sidebarActive
                        ? "sidebar active"
                        : mobileMenu
                        ? "sidebar sidebar-open"
                        : "sidebar"
                }
            >
                <button
                    onClick={mobileMenuControl}
                    type="button"
                    className="sidebar-close-btn"
                >
                    <Icon icon="radix-icons:cross-2" />
                </button>
                <div>
                    <Link href="/admindashboard" className="sidebar-logo">
                        <img
                            src="/assets/images/logo.png"
                            alt="site logo"
                            className="light-logo"
                        />
                        <img
                            src="/assets/images/logo-light.png"
                            alt="site logo"
                            className="dark-logo"
                        />
                        <img
                            src="/assets/images/logo-icon.png"
                            alt="site logo"
                            className="logo-icon"
                        />
                    </Link>
                </div>
                <div className="sidebar-menu-area">
                    <ul className="sidebar-menu" id="sidebar-menu">
                        <li className="sidebar-menu-group-title">Dashboard</li>
                        <li>
                            <Link
                                href="/admindashboard"
                                className={
                                    url === "/admindashboard"
                                        ? "active-page"
                                        : ""
                                }
                            >
                                <Icon icon="mage:email" className="menu-icon" />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li className="dropdown">
                            <Link href="#">
                                <Icon
                                    icon="solar:home-smile-angle-outline"
                                    className="menu-icon"
                                />
                                <span>Task Management</span>
                            </Link>
                            <ul className="sidebar-submenu">
                                <li>
                                    <Link
                                        href="/task"
                                        className={
                                            url === "/task" ? "active-page" : ""
                                        }
                                    >
                                        <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />
                                        Create Task
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/task-manage"
                                        className={
                                            url === "/task-manage"
                                                ? "active-page"
                                                : ""
                                        }
                                    >
                                        <i className="ri-circle-fill circle-icon text-warning-main w-auto" />
                                        Manage Task
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        {(user?.role === "admin" ||
                            user?.role === "superadmin") && (
                            <li className="dropdown">
                                <Link href="#">
                                    <Icon
                                        icon="solar:home-smile-angle-outline"
                                        className="menu-icon"
                                    />
                                    <span>User Management</span>
                                </Link>
                                <ul className="sidebar-submenu">
                                    <li>
                                        <Link
                                            href="/users/index"
                                            className={
                                                url === "/users/index"
                                                    ? "active-page"
                                                    : ""
                                            }
                                        >
                                            <i className="ri-circle-fill circle-icon text-primary-600 w-auto" />
                                            Manage User
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        )}
                    </ul>
                </div>
            </aside>

            <main
                className={
                    sidebarActive ? "dashboard-main active" : "dashboard-main"
                }
            >
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
                                    <Icon
                                        icon="ion:search-outline"
                                        className="icon"
                                    />
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
                                                            Your profile has
                                                            been Verified. Your
                                                            profile has been
                                                            Verified
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
                                                    {user.name ||
                                                        "Shaidul Islam"}
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

                <div className="dashboard-main-body">{children}</div>

                <footer className="d-footer">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-auto">
                            <p className="mb-0">
                                © 2024 WowDash. All Rights Reserved.
                            </p>
                        </div>
                        <div className="col-auto">
                            <p className="mb-0">
                                Made by{" "}
                                <span className="text-primary-600">
                                    wowtheme7
                                </span>
                            </p>
                        </div>
                    </div>
                </footer>
            </main>
        </section>
    );
};

export default MasterLayout;
