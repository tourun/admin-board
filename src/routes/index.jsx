import { Navigate, createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import {
  loadUsers,
  loadUser,
  deleteAction,
  createUserAction,
} from '../loaders/userLoader';

// 懒加载页面组件
const UserPage = lazy(() => import('../pages/UserPage'));
const UserDetail = lazy(() => import('../pages/UserDetail'));
const NewUser = lazy(() => import('../pages/NewUser'));
const RolePage = lazy(() => import('../pages/RolePage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'users',
        element: <UserPage />,
        loader: loadUsers,
        action: deleteAction,
      },
      {
        path: 'users/new',
        element: <NewUser />,
        action: createUserAction,
      },
      {
        path: 'users/:id',
        element: <UserDetail />,
        loader: loadUser,
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
