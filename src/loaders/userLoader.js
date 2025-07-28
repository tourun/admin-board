/**
 * 用户页面数据加载器
 * 用于 React Router Data Router 的 loader 函数
 */

import { defer } from 'react-router-dom';
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
 * 加载用户数据的 loader 函数 - 使用 defer 延迟加载
 * @returns {Object} 包含 deferred Promise 的对象
 */
export const loadUsers = () => {
    console.log('📦 loadUsers called, returning deferred promise');

    return defer({
        usersData: getUsersData() // 返回 Promise，不等待它完成
    });
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
 * 加载单个用户详情的 loader 函数 - 使用 defer 延迟加载
 * @param {Object} params - 路由参数
 * @param {string} params.params.id - 用户ID
 * @returns {Object} 包含 deferred Promise 的对象
 */
export const loadUser = ({ params }) => {
    console.log('📦 loadUser called for user:', params.id);

    return defer({
        userData: getUserData(params.id) // 返回 Promise，不等待它完成
    });
};/**
 * 删除
用户的 action 函数
 * @param {Object} params - 路由参数
 * @param {string} params.params.id - 用户ID
 * @returns {Promise<Response>} 重定向响应
 */
export const deleteAction = async ({ params }) => {
    try {
        const userId = params.id;
        const result = await userService.deleteUser(userId);

        if (result.success) {
            // 删除成功，重定向到用户列表页面
            return new Response(null, {
                status: 302,
                headers: {
                    Location: '/users'
                }
            });
        } else {
            throw new Error('Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        // 可以返回错误信息或重定向到错误页面
        throw new Response('Failed to delete user', { status: 500 });
    }
};