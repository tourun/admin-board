/**
 * useUsers Hook
 * 用户数据状态管理，处理用户列表的获取、创建、分页、排序和筛选
 */

import { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';

/**
 * 用户数据管理Hook
 * @returns {Object} 用户数据状态和操作方法
 */
export const useUsers = () => {
    // 用户数据状态
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 分页状态
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    // 筛选状态
    const [filters, setFilters] = useState({});

    // 排序状态
    const [sorter, setSorter] = useState({});

    /**
     * 获取用户数据
     * @param {Object} params - 查询参数（可选）
     */
    const fetchUsers = useCallback(async (params = {}) => {
        // 合并默认参数和传入参数
        const queryParams = {
            pagination: params.pagination || pagination,
            filters: params.filters || filters,
            sorter: params.sorter || sorter
        };

        setLoading(true);
        setError(null);

        try {
            const response = await userService.getUsers(queryParams);

            setUsers(response.data);
            setPagination({
                ...queryParams.pagination,
                total: response.total
            });

            // 更新状态（如果是从参数传入的）
            if (params.filters) setFilters(params.filters);
            if (params.sorter) setSorter(params.sorter);
            if (params.pagination) setPagination({
                ...params.pagination,
                total: response.total
            });

        } catch (err) {
            setError(err.message || '获取用户数据失败');
            console.error('获取用户数据错误:', err);
        } finally {
            setLoading(false);
        }
    }, []); // 移除依赖项，避免无限循环

    /**
     * 创建新用户
     * @param {Object} userData - 用户数据
     * @returns {Promise} - 创建结果
     */
    const createUser = async (userData) => {
        setLoading(true);
        setError(null);

        try {
            const newUser = await userService.createUser(userData);

            // 刷新用户列表（回到第一页）
            await fetchUsers({
                pagination: { current: 1, pageSize: pagination.pageSize },
                filters,
                sorter
            });

            return { success: true, data: newUser };
        } catch (err) {
            setError(err.message || '创建用户失败');
            console.error('创建用户错误:', err);
            return {
                success: false,
                error: err.type === 'ValidationError' ? err.errors : { general: err.message || '创建用户失败' }
            };
        } finally {
            setLoading(false);
        }
    };

    /**
     * 处理表格变化（分页、筛选、排序）
     * @param {Object} newPagination - 新的分页设置
     * @param {Object} newFilters - 新的筛选设置
     * @param {Object} newSorter - 新的排序设置
     */
    const handleTableChange = (newPagination, newFilters, newSorter) => {
        // 处理筛选变化时重置到第一页
        const updatedPagination = {
            ...newPagination,
            current: Object.keys(newFilters || {}).some(key =>
                newFilters[key] !== filters[key]
            ) ? 1 : newPagination.current
        };

        fetchUsers({
            pagination: updatedPagination,
            filters: newFilters || {},
            sorter: newSorter || {}
        });
    };

    // 初始加载 - 只在组件挂载时执行一次
    useEffect(() => {
        fetchUsers();
    }, []); // 空依赖数组，只在挂载时执行

    return {
        users,
        loading,
        error,
        pagination,
        filters,
        sorter,
        fetchUsers,
        createUser,
        handleTableChange
    };
};

export default useUsers;