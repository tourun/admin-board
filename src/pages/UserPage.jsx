import { useEffect, useRef } from 'react';
import { useLoaderData, Form, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserTable from '../components/User/UserTable';
import useUsers from '../hooks/useUsers';
import './UserPage.css';

const UserPage = () => {
  const { usersData } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const hasProcessedDelete = useRef(false);

  console.log('🎯 UserPage rendering...', {
    usersCount: usersData?.users?.length,
    hasDeletedParam: searchParams.get('deleted'),
  });

  // 使用自定义Hook获取用户数据和操作方法，传入初始数据
  const {
    users,
    loading,
    error,
    pagination,
    filters,
    sorter,
    fetchUsers,
    handleTableChange,
  } = useUsers(usersData);

  // 显示通知
  const showNotification = (type, message) => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
        toast.info(message);
        break;
      default:
        toast(message);
    }
  };

  // 监听错误状态
  useEffect(() => {
    if (error) {
      showNotification('error', `Failed to load data: ${error}`);
    }
  }, [error]);

  // 检查URL参数，显示删除成功通知并刷新数据
  useEffect(() => {
    const deleted = searchParams.get('deleted');
    if (deleted === 'success' && !hasProcessedDelete.current) {
      console.log('🎉 Showing delete success notification and refreshing data');
      hasProcessedDelete.current = true;
      showNotification('success', 'User deleted successfully!');
      // 清除URL参数，使用replace避免历史记录堆积
      setSearchParams({}, { replace: true });
      // 刷新用户数据
      fetchUsers();
    } else if (deleted !== 'success') {
      // 重置标志，为下次删除做准备
      hasProcessedDelete.current = false;
    }
  }, [fetchUsers, searchParams, setSearchParams]);

  // 处理重试加载
  const handleRetry = () => {
    fetchUsers();
  };

  return (
    <div className="user-page">
      <div className="user-page-header">
        <h1 className="user-page-title">User Management</h1>
        <Form action="/users/new" method="get">
          <button
            type="submit"
            className="user-page-add-button"
            disabled={loading}
          >
            Create New User
          </button>
        </Form>
      </div>

      <div className="user-page-content">
        {error ? (
          <div className="user-page-error">
            <p>Failed to load data: {error}</p>
            <button onClick={handleRetry}>Retry</button>
          </div>
        ) : (
          <UserTable
            users={users}
            loading={loading}
            pagination={pagination}
            filters={filters}
            sorter={sorter}
            onTableChange={handleTableChange}
          />
        )}
      </div>
    </div>
  );
};

export default UserPage;
