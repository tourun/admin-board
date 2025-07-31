import './RolePage.css'

const RolePage = () => {
    return (
        <div className="role-page">
            <div className="role-page-header">
                <h1 className="role-page-title">角色管理</h1>
                <button className="role-page-add-button">
                    创建新角色
                </button>
            </div>
            <div className="role-page-content">
                <div className="role-page-placeholder">
                    <p>角色管理功能正在开发中...</p>
                    <p className="role-page-placeholder-info">
                        此页面将用于管理系统角色和权限
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RolePage