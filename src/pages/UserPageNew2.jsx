import { toast } from 'react-toastify';
import { useNavigate, useLoaderData } from 'react-router-dom';
import UserTableNew from '../components/User/UserTableNew';
import { useUsers } from '../hooks/useUsersNew';
import './UserPage.css';

const UserPageNew2 = () => {
  const navigate = useNavigate();
  const { usersData } = useLoaderData(); // 获取预加载的数据

  const {
    data,
    loading,
    error,
    pagination,
    sorting,
    goToPage,
    changePageSize,
    changeSorting,
    refresh,
    deleteUser,
  } = useUsers(usersData); // 传入预加载数据

  // 处理删除操作
  const handleDeleteUser = async (userId) => {
    const result = await deleteUser(userId);

    if (result.success) {
      toast.success(result.message);
      // 删除成功后刷新列表数据
      refresh();
    } else {
      toast.error(result.message);
    }

    return result;
  };

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
        <button
          className="create-user-button"
          onClick={() => navigate('/users/new')}
          disabled={loading}
        >
          Create New User
        </button>
      </div>

      <UserTableNew
        data={data}
        loading={loading}
        pagination={pagination}
        sorting={sorting}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        onSortingChange={changeSorting}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
};

export default UserPageNew2;
