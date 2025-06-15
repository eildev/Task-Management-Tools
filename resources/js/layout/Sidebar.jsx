import { Icon } from "@iconify/react";
import { Link } from "@inertiajs/react";

const Sidebar = ({
    sidebarActive,
    mobileMenuControl,
    url,
    user,
    mobileMenu,
}) => {
    return (
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
                                url === "/admindashboard" ? "active-page" : ""
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
    );
};

export default Sidebar;
