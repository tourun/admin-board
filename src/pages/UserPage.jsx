import { useState, useEffect } from 'react';
import { useLoaderData, Form, useNavigation } from 'react-router-dom';
import UserTable from '../components/User/UserTable';
import Notification from '../components/User/Notification';
import useUsers from '../hooks/useUsers';
import './UserPage.css';

const UserPage = () => {
    console.log("UserPage rendering...")

    const { usersData } = useLoaderData();
    const navigation = useNavigation();

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

    // 监听navigation状态，当删除操作完成时刷新数据
    useEffect(() => {
        // 当navigation状态从submitting变为idle时，检查是否是删除操作
        if (navigation.state === 'idle' && navigation.formAction?.includes('/delete')) {
            console.log('Delete operation completed, refreshing data...');
            fetchUsers();
        }
    }, [navigation.state, navigation.formAction, fetchUsers]);

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

            <Notification
                show={notification.show}
                type={notification.type}
                message={notification.message}
                onClose={handleCloseNotification}
            />
        </div>
    );
};

export default UserPage;