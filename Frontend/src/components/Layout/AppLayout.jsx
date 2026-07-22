import TextInput from "../Form/TextInput"
import Profile from "../../assets/profile.png"
import { LogOut, Search, LayoutDashboard, Folder, ListChecks, User } from 'lucide-react';
import SidebarItem from './SidebarItem'
import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] relative">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-30 flex justify-between px-8 py-3 border border-2 border-b-[var(--color-border)] bg-[var(--color-background)]">
                <div className="ml-50 relative">
                    <Search className="absolute left-4 top-2 h-4 w-4 text-[var(--color-text-muted)]" />
                    <TextInput
                        id="search"
                        name="search"
                        type="text"
                        value={""}
                        onChange={""}
                        placeholder="Search projects..."
                        required
                        className="pl-[38px]"
                    />
                </div>
                <div className="h-[40px] w-[40px] rounded-full">
                    <img src={Profile} alt="Profile Pic" className="w-full h-full object-cover" />
                </div>
            </header>

            {/* Main Section */}
            <div className="flex pt-[64px]">
                <aside className="fixed top-[64px] left-0 bottom-0 w-[240px] border-r border-[var(--color-border)] px-2 py-10 flex flex-col justify-between bg-[var(--color-sidebar)]">
                    <div className="space-y-2">
                        <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <SidebarItem to="/projects" icon={Folder} label="Projects" />
                        <SidebarItem to="/tasks" icon={ListChecks} label="Tasks" />
                        <SidebarItem to="/profile" icon={User} label="Profile" />
                    </div>
                    <div className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-black">
                        <LogOut className="h-4 w-4" />
                        Logout
                    </div>
                </aside>
                <main className="ml-[240px] flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AppLayout
