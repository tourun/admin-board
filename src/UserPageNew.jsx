import { useUser } from "./useUserNew"

const UserPageNew = () => {
  const {
    data,
    loading,
    error,
    pagination,
    sorting,
    goToPage,
    changePageSize,
    changeSorting,
    refresh
  } = useUser()

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
    )
  }

  return (
    <div className="user-page">
      <div className="user-page-header">
        <h2>用户列表</h2>
        <div className="user-stats">
          <span>总计: {pagination.total} 个用户</span>
          <span>第 {pagination.page} 页，共 {pagination.totalPages} 页</span>
        </div>
      </div>
      
      <UserTable
        data={data}
        loading={loading}
        pagination={pagination}
        sorting={sorting}
        onPageChange={goToPage}
        onPageSizeChange={changePageSize}
        onSortingChange={changeSorting}
      />
    </div>
  )
}

export default UserPageNew