import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function AppShell() {
    return (
        <>
            <Navbar />

            <Sidebar />

            <main>
                <Outlet />
            </main>
        </>
    );
}

export default AppShell;