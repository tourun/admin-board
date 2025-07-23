import { useState, useEffect } from 'react';
import UserTable from '../components/User/UserTable';
import CreateUserModal from '../components/User/CreateUserModal';
import Notification from '../components/User/Notification';
import useUsers from '../hooks/useUsers';
import './UserPage.css';

const UserPage = () => {
    // 使用自定义Hook获取用户数据和操作方法
    const {
        users,
        loading,
        error,
        pagination,
        filters,
        sorter,
        fetchUsers,
        createUser,
        handleTableChange
    } = useUsers();

    // 模态框状态
    const [modalOpen, setModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // 通知状态
    const [notification, setNotification] = useState({
        show: false,
        type: '',
        message: ''
    });

    // 显示通知
    const showNotification = (type, message) => {
        setNotification({
            show: true,
            type,
            message
        });
    };

    // 关闭通知
    const handleCloseNotification = () => {
        setNotification(prev => ({
            ...prev,
            show: false
        }));
    };

    // 监听错误状态
    useEffect(() => {
        if (error) {
            showNotification('error', `Failed to load data: ${error}`);
        }
    }, [error]);

    // 打开模态框
    const handleOpenModal = () => {
        setModalOpen(true);
        setSubmitError(null);
    };

    // 关闭模态框
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    // 处理用户创建
    const handleCreateUser = async (userData) => {
        setSubmitLoading(true);
        setSubmitError(null);

        try {
            const result = await createUser(userData);

            if (!result.success) {
                setSubmitError(result.error);
                return { success: false };
            }

            // 显示成功通知
            showNotification('success', 'User created successfully!');

            return { success: true, data: result.data };
        } catch (error) {
            console.error('Error creating user:', error);
            setSubmitError('Failed to create user, please try again');
            return { success: false };
        } finally {
            setSubmitLoading(false);
        }
    };

    // 处理重试加载
    const handleRetry = () => {
        fetchUsers();
    };

    return (
        <div className="user-page">
            <div className="user-page__header">
                <h1 className="user-page__title">User Management</h1>
                <button
                    className="user-page__add-button"
                    onClick={handleOpenModal}
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

            <CreateUserModal
                isOpen={modalOpen}
                onRequestClose={handleCloseModal}
                onSubmit={handleCreateUser}
                loading={submitLoading}
                submitError={submitError}
            />

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