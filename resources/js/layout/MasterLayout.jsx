import { Icon } from "@iconify/react";
import { Link, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MasterLayout = ({ children }) => {
    const [sidebarActive, setSidebarActive] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const { url } = usePage();
    const user = usePage().props.auth.user;

    // Enhanced logging to debug
    // console.info("MasterLayout: Component loaded");
    // console.debug("MasterLayout: Current URL:", url);
    // console.debug("MasterLayout: User:", user);

    useEffect(() => {
        // console.info("MasterLayout: useEffect triggered with url:", url);

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
            <Sidebar
                sidebarActive={sidebarActive}
                mobileMenuControl={mobileMenuControl}
                url={url}
                user={user}
                mobileMenu={mobileMenu}
            />

            <main
                className={
                    sidebarActive ? "dashboard-main active" : "dashboard-main"
                }
            >
                <Navbar
                    sidebarControl={sidebarControl}
                    sidebarActive={sidebarActive}
                    mobileMenuControl={mobileMenuControl}
                    user={user}
                />

                <ToastContainer />
                <Toaster position="top-center" reverseOrder={false} />

                <div className="dashboard-main-body">{children}</div>

                <Footer />
            </main>
        </section>
    );
};

export default MasterLayout;
