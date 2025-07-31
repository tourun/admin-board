/**
 * useUsers Hook
 * 用户数据状态管理，处理用户列表的获取、创建、分页、排序和筛选
 */

import { useState, useEffect, useCallback } from 'react';
import '../services/userService';
import { fetchUsersData } from '../services/userDataService';

/**
 * 用户数据管理Hook
 * @param {Object} initialData - 从 loader 获取的初始数据
 * @returns {Object} 用户数据状态和操作方法
 */
export const useUsers = (initialData = null) => {
    // 用户数据状态 - 使用初始数据或默认值
    const [users, setUsers] = useState(initialData?.users || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(initialData?.error || null);

    // 分页状态 - 使用初始数据或默认值
    const [pagination, setPagination] = useState(
        initialData?.pagination || {
            current: 1,
            pageSize: 10,
            total: 0
        }
    );

    // 筛选状态
    const [filters, setFilters] = useState({});

    // 排序状态
    const [sorter, setSorter] = useState({});

    // 监听initialData变化，更新状态
    useEffect(() => {
        if (initialData) {
            setUsers(initialData.users || []);
            setError(initialData.error || null);
            setPagination(initialData.pagination || {
                current: 1,
                pageSize: 10,
                total: 0
            });
        }
    }, [initialData]);

    /**
     * 获取用户数据
     * @param {Object} params - 查询参数（可选）
     */
    const fetchUsers = useCallback(async (params = {}) => {
        // 合并当前状态和传入参数
        const queryParams = {
            pagination: params.pagination || pagination,
            filters: params.filters || filters,
            sorter: params.sorter || sorter
        };

        setLoading(true);
        setError(null);

        try {
            const result = await fetchUsersData(queryParams);

            if (result.success) {
                setUsers(result.users);
                setPagination(result.pagination);

                // 更新状态（如果是从参数传入的）
                if (params.filters) setFilters(params.filters);
                if (params.sorter) setSorter(params.sorter);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message || '获取用户数据失败');
            console.error('获取用户数据错误:', err);
        } finally {
            setLoading(false);
        }
    }, [pagination, filters, sorter]); // 添加正确的依赖项

    // createUser 功能已移除，现在使用独立的 NewUser 页面

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

    // 初始加载 - 只在没有初始数据时执行
    useEffect(() => {
        if (!initialData) {
            fetchUsers();
        }
    }, [initialData, fetchUsers]); // 添加正确的依赖项

    return {
        users,
        loading,
        error,
        pagination,
        filters,
        sorter,
        fetchUsers,
        handleTableChange
    };
};

export default useUsers;