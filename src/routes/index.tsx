import UserPage from "../pages/UserPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { MainPage } from "../pages/MainPage";
import { AdminPanel } from "../pages/AdminPanel";

interface Routes {
    path: string,
    element: () => JSX.Element
}

export const userRoutes:Routes[] = [
    {path: '/user', element: UserPage},
    {path: '/', element: MainPage},

]
export const adminRoutes:Routes[] = [
    {path: '/user', element: UserPage},
    {path: '/admin', element: AdminPanel},
    {path: '/', element: MainPage},
]
export const publicRoutes:Routes[] = [
    {path: '/login', element: Login},
    {path: '/signup', element: Register},
    {path: '/', element: MainPage},
]