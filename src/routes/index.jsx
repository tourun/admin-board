import { Navigate, createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { loadUsers, loadUser, deleteAction } from '../loaders/userLoader';

// 懒加载页面组件
const UserPage = lazy(() => import('../pages/UserPage'));
const UserDetail = lazy(() => import('../pages/UserDetail'));
const NewUser = lazy(() => import('../pages/NewUser'));
const RolePage = lazy(() => import('../pages/RolePage'));

/**
 * 应用路由配置 - 使用 Data Router
 * 
 * 主要路由结构:
 * - 根路由 (/) 使用MainLayout作为布局组件
 * - 子路由包括用户管理 (/users) 和角色管理 (/roles)
 * - 用户页面使用 loader 预加载数据
 * - 默认路由重定向到用户管理页面
 * - 404路由重定向到用户管理页面
 */
const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: 'users',
                element: <UserPage />,
                loader: loadUsers,
            },
            {
                path: 'users/new',
                element: <NewUser />,
            },
            {
                path: 'users/:id',
                element: <UserDetail />,
                loader: loadUser,
            },
            {
                path: 'users/:id/delete',
                action: deleteAction,
            },
            {
                path: 'roles',
                element: <RolePage />,
            },
            {
                // 默认路由重定向到用户页面
                index: true,
                element: <Navigate to="/users" replace />,
            },
            {
                // 404路由重定向到用户页面
                path: '*',
                element: <Navigate to="/users" replace />,
            },
        ],
    },
]);

export default router;