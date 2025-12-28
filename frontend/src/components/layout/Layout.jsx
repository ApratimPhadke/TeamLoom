import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function Layout() {
    return (
        <div className="min-h-screen bg-dark-950">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 ml-0 lg:ml-64 pt-16 pb-20 lg:pb-0">
                    <Outlet />
                </main>
            </div>
            <BottomNav />
        </div>
    )
}
