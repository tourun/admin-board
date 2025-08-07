import { useState, useEffect, useCallback } from 'react';
import { fetchUsersData } from '../services/userDataService';

// 将API返回的数据转换为组件需要的格式
const transformApiResponse = (apiResponse) => {
  if (!apiResponse.success) {
    throw new Error(apiResponse.error || '获取数据失败');
  }

  return {
    data: apiResponse.users,
    total: apiResponse.pagination.total,
    page: apiResponse.pagination.current,
    pageSize: apiResponse.pagination.pageSize,
    totalPages: Math.ceil(
      apiResponse.pagination.total / apiResponse.pagination.pageSize
    ),
  };
};

// 将排序字符串转换为API需要的格式
const parseSorting = (sortString) => {
  if (!sortString) return {};

  // 正确处理字段名中包含下划线的情况
  // 'staff_id_asc' -> field: 'staff_id', direction: 'asc'
  const lastUnderscoreIndex = sortString.lastIndexOf('_');
  const field = sortString.substring(0, lastUnderscoreIndex);
  const direction = sortString.substring(lastUnderscoreIndex + 1);

  const result = {
    field,
    order: direction === 'desc' ? 'descend' : 'ascend',
  };

  console.log('🔄 parseSorting:', { sortString, field, direction, result });
  return result;
};

export const useUsers = (initialData = null) => {
  const [data, setData] = useState(initialData?.users || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: initialData?.pagination?.current || 1,
    pageSize: initialData?.pagination?.pageSize || 10,
    total: initialData?.pagination?.total || 0,
    totalPages: Math.ceil(
      (initialData?.pagination?.total || 0) /
        (initialData?.pagination?.pageSize || 10)
    ),
  });
  const [sorting, setSorting] = useState('');

  const loadUsers = async (page = 1, pageSize = 10, sort = '') => {
    setLoading(true);
    setError(null);

    console.log(
      `🚀 Loading users: page=${page}, pageSize=${pageSize}, sort=${sort}`
    );

    try {
      const result = await fetchUsersData({
        pagination: { current: page, pageSize },
        sorter: parseSorting(sort),
        filters: {},
      });

      const transformedData = transformApiResponse(result);

      setData(transformedData.data);
      setPagination({
        page: transformedData.page,
        pageSize: transformedData.pageSize,
        total: transformedData.total,
        totalPages: transformedData.totalPages,
      });
      setSorting(sort);

      console.log('✅ Users loaded successfully:', {
        count: transformedData.data.length,
        pagination: transformedData,
      });
    } catch (err) {
      setError('获取用户数据失败');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 如果没有初始数据，则加载数据
    if (!initialData) {
      loadUsers();
    }
  }, [initialData]);

  const goToPage = (page) => {
    loadUsers(page, pagination.pageSize, sorting);
  };

  const changePageSize = (pageSize) => {
    loadUsers(1, pageSize, sorting);
  };

  const changeSorting = (sort) => {
    console.log('🔄 changeSorting called with:', sort);
    // 排序时回到第一页
    loadUsers(1, pagination.pageSize, sort);
  };

  // 使用 useCallback 稳定 refresh 函数的引用
  const refresh = () => {
    loadUsers(pagination.page, pagination.pageSize, sorting);
  };

  const deleteUser = async (userId) => {
    try {
      setLoading(true);
      console.log('🗑️ Starting delete for user:', userId);

      // 调用真实的删除 API
      const userService = await import('../services/userService');
      const result = await userService.default.deleteUser(userId);

      console.log('🗑️ Delete API result:', result);

      if (result.success) {
        return {
          success: true,
          message: result.message || 'User deleted successfully!',
        };
      } else {
        return {
          success: false,
          message: result.message || 'Failed to delete user',
        };
      }
    } catch (error) {
      console.error('Delete failed:', error);
      return { success: false, message: 'Failed to delete user' };
    } finally {
      setLoading(false);
    }
  };

  // 创建用户功能
  const createUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      console.log('🚀 Creating user:', userData);

      // 调用真实的创建 API
      const userService = await import('../services/userService');
      const result = await userService.default.createUser(userData);

      console.log('✅ Create API result:', result);

      if (result) {
        return {
          success: true,
          user: result,
          message: 'User created successfully!',
        };
      } else {
        return { success: false, message: 'Failed to create user' };
      }
    } catch (error) {
      console.error('Create failed:', error);

      // 处理验证错误
      if (error.type === 'ValidationError') {
        return { success: false, errors: error.errors };
      }

      return {
        success: false,
        message: error.message || 'Failed to create user',
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    pagination,
    sorting,
    goToPage,
    changePageSize,
    changeSorting,
    deleteUser,
    refresh,
    createUser,
  };
};
