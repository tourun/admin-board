import { useLoaderData, useNavigate } from 'react-router-dom';
import DeferredData from '../components/Common/DeferredData';
import './UserDetail.css';

const UserDetail = () => {
    console.log("UserDetail rendering...")

    const navigate = useNavigate();
    const { userData } = useLoaderData();

    const handleBack = () => {
        navigate('/users');
    };

    return (
        <DeferredData data={userData}>
            {(user) => {
                if (!user) {
                    return (
                        <div className="user-detail">
                            <div className="user-detail__error">
                                <h2>User not found</h2>
                                <button onClick={handleBack} className="user-detail__back-button">
                                    Back to Users
                                </button>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="user-detail">
                        <div className="user-detail__header">
                            <button onClick={handleBack} className="user-detail__back-button">
                                ← Back to Users
                            </button>
                            <h1 className="user-detail__title">User Details</h1>
                        </div>

                        <div className="user-detail__content">
                            <div className="user-detail__card">
                                <div className="user-detail__field">
                                    <label className="user-detail__label">Staff ID:</label>
                                    <span className="user-detail__value">{user.staff_id}</span>
                                </div>

                                <div className="user-detail__field">
                                    <label className="user-detail__label">First Name:</label>
                                    <span className="user-detail__value">{user.first_name}</span>
                                </div>

                                <div className="user-detail__field">
                                    <label className="user-detail__label">Last Name:</label>
                                    <span className="user-detail__value">{user.last_name}</span>
                                </div>

                                <div className="user-detail__field">
                                    <label className="user-detail__label">Work Location:</label>
                                    <span className="user-detail__value">{user.work_location}</span>
                                </div>

                                <div className="user-detail__field">
                                    <label className="user-detail__label">Status:</label>
                                    <span className={`user-detail__status ${user.is_active ? 'active' : 'inactive'}`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <div className="user-detail__field">
                                    <label className="user-detail__label">Last Update Time:</label>
                                    <span className="user-detail__value">
                                        {new Date(user.last_update_time).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }}
        </DeferredData>
    );
};

export default UserDetail;