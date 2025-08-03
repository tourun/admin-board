import { useLoaderData, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import './UserDetail.css';

const UserDetail = () => {
  const navigate = useNavigate();
  const { userData: user } = useLoaderData();

  const handleBack = () => {
    navigate('/users');
  };

  if (!user) {
    return (
      <div className="user-detail">
        <div className="user-detail-error">
          <h2>User not found</h2>
          <button onClick={handleBack} className="user-detail-back-button">
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-detail">
      <div className="user-detail-header">
        <button onClick={handleBack} className="user-detail-back-button">
          ← Back to Users
        </button>
        <h1 className="user-detail-title">User Details</h1>
      </div>

      <div className="user-detail-content">
        <div className="user-detail-card">
          <div className="user-detail-field">
            <label className="user-detail-label">Staff ID</label>
            <span className="user-detail-value">{user.staff_id}</span>
          </div>

          <div className="user-detail-field">
            <label className="user-detail-label">First Name</label>
            <span className="user-detail-value">{user.first_name}</span>
          </div>

          <div className="user-detail-field">
            <label className="user-detail-label">Last Name</label>
            <span className="user-detail-value">{user.last_name}</span>
          </div>

          <div className="user-detail-field">
            <label className="user-detail-label">Work Location</label>
            <span className="user-detail-value">{user.location}</span>
          </div>

          <div className="user-detail-field">
            <label className="user-detail-label">Status</label>
            <span
              className={`user-detail-status ${user.is_active ? 'active' : 'inactive'}`}
            >
              {user.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="user-detail-field">
            <label className="user-detail-label">Created At</label>
            <span className="user-detail-value">
              {format(new Date(user.created_at), 'yyyy-MM-dd HH:mm:ss')}
            </span>
          </div>

          <div className="user-detail-field">
            <label className="user-detail-label">Updated At</label>
            <span className="user-detail-value">
              {format(new Date(user.updated_at), 'yyyy-MM-dd HH:mm:ss')}
            </span>
          </div>

          <div className="user-detail-field">
            <label className="user-detail-label">Created By</label>
            <span className="user-detail-value">
              {user.createdByUser
                ? `${user.createdByUser.first_name} ${user.createdByUser.last_name}`
                : 'Unknown'}
            </span>
          </div>

          <div className="user-detail-field">
            <label className="user-detail-label">Updated By</label>
            <span className="user-detail-value">
              {user.updatedByUser
                ? `${user.updatedByUser.first_name} ${user.updatedByUser.last_name}`
                : 'Unknown'}
            </span>
          </div>

          <div className="user-detail-field">
            <label className="user-detail-label">User Roles</label>
            <div className="user-detail-roles">
              {user.userRoles && user.userRoles.length > 0 ? (
                user.userRoles.map((role, index) => (
                  <span key={role.role_id} className="user-detail-role-tag">
                    {role.role_description}
                  </span>
                ))
              ) : (
                <span className="user-detail-value">No roles assigned</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
