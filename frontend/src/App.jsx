import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import Explore from './pages/Explore'
import ExploreNew from './pages/ExploreNew'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import MyProfile from './pages/MyProfile'
import GroupDetail from './pages/GroupDetail'
import CreateGroup from './pages/CreateGroup'
import MyGroups from './pages/MyGroups'
import Notifications from './pages/Notifications'
import Chat from './pages/Chat'
import About from './pages/About'


// Protected route wrapper
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth)

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

// Public only route (redirect if logged in)
const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth)

    if (isAuthenticated) {
        return <Navigate to="/explore" replace />
    }

    return children
}

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            {/* Onboarding */}
            <Route
                path="/onboarding"
                element={
                    <ProtectedRoute>
                        <Onboarding />
                    </ProtectedRoute>
                }
            />

            {/* Protected routes with layout */}
            <Route
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route path="/explore" element={<Explore />} />
                <Route path="/app/explore" element={<ExploreNew />} />
                <Route path="/app/discover" element={<Discover />} />
                <Route path="/profile" element={<MyProfile />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/groups/create" element={<CreateGroup />} />
                <Route path="/app/groups/create" element={<CreateGroup />} />
                <Route path="/groups/my" element={<MyGroups />} />
                <Route path="/app/my-groups" element={<MyGroups />} />
                <Route path="/groups/:id" element={<GroupDetail />} />
                <Route path="/app/groups/:id" element={<GroupDetail />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/app/notifications" element={<Notifications />} />
                <Route path="/chat" element={<Chat />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App
