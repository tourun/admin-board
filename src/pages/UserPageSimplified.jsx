/**
 * 简化版的 UserPage 组件
 * 参考 UserPageNew.jsx 的设计理念，简洁的组合组件
 */
import { useEffect } from 'react';
import { useLoaderData, useActionData } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserTableSimplified from '../components/User/UserTableSimplified';
import { useUsersSimplified } from '../hooks/useUsersSimplified';
import './UserPage.css'; // 复用现有样式

const UserPageSimplified = () => {
  const { usersData } = useLoaderData();
  const actionData = useActionData();

  console.log('🎯 UserPageSimplified rendering...', {
    usersCount: usersData?.users?.length,
    actionData: actionData,
  });

  // 使用简化版的 hook
  const {
    users,
    loading,
    error,
    pagination,
    sorting,
    goToPage,
    changePageSize,
    changeSorting,
    refresh,
  } = useUsersSimplified(usersData, actionData);

  // 处理操作结果的通知 - 简化版，不处理刷新
  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.message || 'Operation completed successfully!');
    } else if (actionData?.errors) {
      const errorMessage = actionData.errors.general || 'Operation failed';
      toast.error(errorMessage);
    }
  }, [actionData]);

  // 错误处理
  if (error) {
    return (
      <div className="user-page">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={refresh} className="retry-button">
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      <div className="user-page-header">
        <h2>User Management</h2>
        <div className="user-stats">
          <span>Total: {pagination.total} users</span>
          <span>
            Page {pagination.page} of{' '}
            {Math.ceil(pagination.total / pagination.size)}
          </span>
        </div>
      </div>

      <UserTableSimplified
        users={users}
        loading={loading}
        pagination={pagination}
        sorting={sorting}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        onSortingChange={changeSorting}
      />
    </div>
  );
};

export default UserPageSimplified;
