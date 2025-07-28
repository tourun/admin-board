import { useState, useEffect } from 'react';
import { useLoaderData, Outlet, useNavigate } from 'react-router-dom';
import UserTable from '../components/User/UserTable';
import Notification from '../components/User/Notification';
import DeferredData from '../components/Common/DeferredData';
import useUsers from '../hooks/useUsers';
import './UserPage.css';

// 用户页面内容组件 - 接收解析后的数据并处理所有业务逻辑
const UserPageContent = ({ usersData }) => {
    console.log("UserPageContent rendering with data:", usersData);

    const navigate = useNavigate();

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

    // 通知状态
    const [notification, setNotification] = useState({
        show: false,
        type: '',
        message: '',
    });

    // 显示通知
    const showNotification = (type, message) => {
        setNotification({
            show: true,
            type,
            message,
        });
    };

    // 关闭通知
    const handleCloseNotification = () => {
        setNotification((prev) => ({
            ...prev,
            show: false,
        }));
    };

    // 监听错误状态
    useEffect(() => {
        if (error) {
            showNotification('error', `Failed to load data: ${error}`);
        }
    }, [error]);

    // 跳转到创建用户页面
    const handleCreateUser = () => {
        navigate('/users/new');
    };

    // 处理重试加载
    const handleRetry = () => {
        fetchUsers();
    };

    return (
        <>
            <div className="user-page__header">
                <h1 className="user-page__title">User Management</h1>
                <button
                    className="user-page__add-button"
                    onClick={handleCreateUser}
                    disabled={loading}
                >
                    Create New User
                </button>
            </div>

            <div className="user-page__content">
                {error ? (
                    <div className="user-page__error">
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

            <Notification
                show={notification.show}
                type={notification.type}
                message={notification.message}
                onClose={handleCloseNotification}
            />
        </>
    );
};

// 主 UserPage 组件 - 处理数据加载
const UserPage = () => {
    console.log("UserPage rendering...")

    const { usersData } = useLoaderData();

    return (
        <div className="user-page">
            <DeferredData data={usersData}>
                {(resolvedUsersData) => <UserPageContent usersData={resolvedUsersData} />}
            </DeferredData>

            {/* 嵌套路由出口 */}
            <Outlet />
        </div>
    );
};

export default UserPage;
