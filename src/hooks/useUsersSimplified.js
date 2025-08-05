/**
 * 简化版的 useUsers Hook
 * 参考 useUserNew.js 的设计理念，提供清晰简洁的API
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchUsersData } from '../services/userDataService';

export const useUsersSimplified = (initialData = null, actionData = null) => {
  const [users, setUsers] = useState(initialData?.users || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialData?.error || null);
  const [pagination, setPagination] = useState(
    initialData?.pagination || { page: 1, size: 10, total: 0 }
  );
  const [sorting, setSorting] = useState({ field: '', order: '' });

  // 用于跟踪已处理的 actionData，避免重复处理
  const processedActionRef = useRef(null);

  // 统一的数据加载函数
  const loadUsers = async (
    page = 1,
    pageSize = 10,
    sortField = '',
    sortOrder = ''
  ) => {
    setLoading(true);
    setError(null);

    console.log('🚀 loadUsers called with:', {
      page,
      pageSize,
      sortField,
      sortOrder,
    });

    try {
      const sorter =
        sortField && sortOrder ? { field: sortField, order: sortOrder } : {};

      const result = await fetchUsersData({
        pagination: { current: page, pageSize },
        sorter,
        filters: {},
      });

      if (result.success) {
        console.log('✅ Data loaded successfully:', {
          usersCount: result.users.length,
          pagination: result.pagination,
        });

        setUsers(result.users);
        // 将 API 返回的 pagination 格式转换为新的格式
        setPagination({
          page: result.pagination.current,
          size: result.pagination.pageSize,
          total: result.pagination.total,
        });
        setSorting({ field: sortField, order: sortOrder });
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('❌ Error loading users:', err);
      setError(err.message || '获取用户数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化：如果有初始数据就使用，否则加载数据
  useEffect(() => {
    if (!initialData?.users?.length) {
      console.log('🔄 Initializing with API call');
      loadUsers();
    } else {
      console.log('🔄 Initializing with initial data');
    }
  }, [initialData?.users?.length]);

  // 监听 actionData 变化，自动刷新数据
  useEffect(() => {
    // 检查是否是新的 actionData 且操作成功
    if (actionData?.success && actionData !== processedActionRef.current) {
      console.log('🔄 Action successful, refreshing data');
      processedActionRef.current = actionData; // 标记为已处理

      // 使用当前状态进行刷新
      loadUsers(pagination.page, pagination.size, sorting.field, sorting.order);
    }
  }, [actionData, pagination, sorting.field, sorting.order]); // 只依赖 actionData

  // 简化的API - 语义化的方法名
  const goToPage = (page) => {
    console.log('📄 Going to page:', page);
    loadUsers(page, pagination.size, sorting.field, sorting.order);
  };

  const changePageSize = (size) => {
    console.log('📏 Changing page size:', size);
    loadUsers(1, size, sorting.field, sorting.order);
  };

  const changeSorting = (field, order) => {
    console.log('🔄 Changing sorting:', { field, order });
    loadUsers(1, pagination.size, field, order);
  };

  const refresh = useCallback(() => {
    console.log('🔄 Refreshing data');
    loadUsers(pagination.page, pagination.size, sorting.field, sorting.order);
  }, [pagination, sorting.field, sorting.order]);

  return {
    // 数据
    users,
    loading,
    error,
    pagination,
    sorting,

    // 操作方法
    goToPage,
    changePageSize,
    changeSorting,
    refresh,
  };
};
