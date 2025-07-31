/**
 * 用户页面数据加载器
 * 用于 React Router Data Router 的 loader 函数
 */

import { json } from 'react-router-dom';
import { fetchUsersData } from '../services/userDataService';
import userService from '../services/userService';

/**
 * 获取用户数据的异步函数
 */
const getUsersData = async () => {
    console.log('🚀 getUsersData started at:', new Date().toISOString());

    const result = await fetchUsersData({
        pagination: { current: 1, pageSize: 10 },
        filters: {},
        sorter: {}
    });

    console.log('✅ getUsersData completed at:', new Date().toISOString());

    return {
        users: result.users,
        pagination: result.pagination,
        error: result.error
    };
};

/**
 * 加载用户数据的 loader 函数 - 直接等待数据加载完成
 * @returns {Object} 用户数据
 */
export const loadUsers = async () => {
    console.log('📦 loadUsers called, loading data...');

    const usersData = await getUsersData();
    console.log('✅ loadUsers completed');

    return { usersData };
};
/**
 * 获取单个用户数据的异步函数
 */
const getUserData = async (userId) => {
    console.log('🚀 getUserData started for user:', userId);

    try {
        const user = await userService.getUserById(userId);
        console.log('✅ getUserData completed for user:', userId);
        return user;
    } catch (error) {
        console.error('Error loading user:', error);
        return null;
    }
};

/**
 * 加载单个用户详情的 loader 函数 - 直接等待数据加载完成
 * @param {Object} params - 路由参数
 * @param {string} params.params.id - 用户ID
 * @returns {Object} 用户数据
 */
export const loadUser = async ({ params }) => {
    console.log('📦 loadUser called for user:', params.id);

    const userData = await getUserData(params.id);
    console.log('✅ loadUser completed for user:', params.id);

    return { userData };
};/**
 * 删除
用户的 action 函数
 * @param {Object} params - 路由参数
 * @param {string} params.params.id - 用户ID
 * @returns {Promise<Response>} 重定向响应
 */
export const deleteAction = async ({ request }) => {
    try {
        const formData = await request.formData();
        const action = formData.get('action');

        // 只处理删除操作
        if (action !== 'delete') {
            return json({ error: 'Invalid action' }, { status: 400 });
        }

        const userId = formData.get('userId');
        const result = await userService.deleteUser(userId);

        if (result.success) {
            // 删除成功，返回成功状态（不重定向，让React Router自动重新加载当前路由的loader）
            return json({ success: true, message: 'User deleted successfully' });
        } else {
            throw new Error('Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        // 可以返回错误信息或重定向到错误页面
        throw new Response('Failed to delete user', { status: 500 });
    }
};
/**
 * 创建
用户的 action 函数
 * @param {Object} request - 请求对象
 * @returns {Promise<Response>} 重定向响应或错误响应
 */
export const createUserAction = async ({ request }) => {
    try {
        const formData = await request.formData();

        // 从 FormData 中提取数据
        const userData = {
            staff_id: formData.get('staff_id'),
            first_name: formData.get('first_name'),
            last_name: formData.get('last_name'),
            location: formData.get('location'),
            is_active: formData.get('is_active') === 'true'
        };

        console.log('Creating user with data:', userData);

        // 调用服务创建用户
        const newUser = await userService.createUser(userData);

        console.log('User created successfully:', newUser);

        // 创建成功，返回成功状态
        return json(
            { success: true, user: newUser },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error creating user:', error);

        // 如果是验证错误，返回错误信息
        if (error.type === 'ValidationError') {
            return json(
                { errors: error.errors },
                { status: 400 }
            );
        }

        // 其他错误
        return json(
            { errors: { general: error.message || 'Failed to create user' } },
            { status: 500 }
        );
    }
};