import { Navigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import UserPage from '../pages/UserPage';
import RolePage from '../pages/RolePage';

/**
 * 应用路由配置
 * 
 * 主要路由结构:
 * - 根路由 (/) 使用MainLayout作为布局组件
 * - 子路由包括用户管理 (/users) 和角色管理 (/roles)
 * - 默认路由重定向到用户管理页面
 * - 404路由重定向到用户管理页面
 */
const routes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                path: 'users',
                element: <UserPage />,
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
];

export default routes;