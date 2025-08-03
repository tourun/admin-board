import { useState, useEffect } from 'react';
import {
  useNavigate,
  Form,
  useActionData,
  useNavigation,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import './NewUser.css';

const NewUser = () => {
  console.log('NewUser rendering...');

  const navigate = useNavigate();
  const actionData = useActionData();
  const navigation = useNavigation();

  // 表单数据状态（用于受控组件）
  const [formData, setFormData] = useState({
    staff_id: '',
    first_name: '',
    last_name: '',
    location: '',
    is_active: true,
  });

  // 客户端验证错误状态
  const [clientErrors, setClientErrors] = useState({});

  // 检查是否正在提交
  const isSubmitting = navigation.state === 'submitting';

  const handleBack = () => {
    navigate('/users');
  };

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

  // 处理输入变化
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 清除该字段的客户端验证错误
    if (clientErrors[field]) {
      setClientErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // 客户端表单验证
  const validateForm = () => {
    const errors = {};

    if (!formData.staff_id.trim()) {
      errors.staff_id = 'This field should not be empty';
    }

    if (!formData.first_name.trim()) {
      errors.first_name = 'This field should not be empty';
    }

    if (!formData.last_name.trim()) {
      errors.last_name = 'This field should not be empty';
    }

    if (!formData.location.trim()) {
      errors.location = 'This field should not be empty';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 处理表单提交
  const handleSubmit = (e) => {
    if (!validateForm()) {
      e.preventDefault(); // 阻止表单提交
    }
  };

  // 获取字段错误信息（优先显示客户端错误）
  const getFieldError = (fieldName) => {
    return clientErrors[fieldName] || actionData?.errors?.[fieldName];
  };

  // 获取通用错误信息
  const getGeneralError = () => {
    return actionData?.errors?.general;
  };

  // 监听actionData变化，显示相应通知
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        showNotification('success', 'User created successfully!');
        // 立即跳转回用户列表
        navigate('/users');
      } else if (actionData.errors) {
        if (actionData.errors.general) {
          showNotification('error', actionData.errors.general);
        } else {
          showNotification(
            'error',
            'Failed to create user. Please check the form.'
          );
        }
      }
    }
  }, [actionData, navigate]);

  return (
    <div className="new-user">
      <div className="new-user-container">
        <div className="new-user-header">
          <button onClick={handleBack} className="new-user-back-button">
            ← Back to Users
          </button>
          <h1 className="new-user-title">Create New User</h1>
          <p className="new-user-subtitle">
            Add a new user to the system with their details
          </p>
        </div>

        <div className="new-user-content">
          <Form
            method="post"
            className="new-user-form"
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="new-user-card">
              {getGeneralError() && (
                <div className="new-user-error">{getGeneralError()}</div>
              )}

              <div className="new-user-field">
                <label className="new-user-label" htmlFor="staff_id">
                  <span className="new-user-required">*</span>
                  Staff ID
                </label>
                <div className="new-user-input-container">
                  <input
                    type="text"
                    id="staff_id"
                    name="staff_id"
                    className={`new-user-input ${getFieldError('staff_id') ? 'error' : ''}`}
                    value={formData.staff_id}
                    onChange={(e) =>
                      handleInputChange('staff_id', e.target.value)
                    }
                    placeholder="Enter 8-digit staff ID"
                    maxLength={8}
                  />
                  {getFieldError('staff_id') && (
                    <div className="new-user-field-error">
                      {getFieldError('staff_id')}
                    </div>
                  )}
                </div>
              </div>

              <div className="new-user-field">
                <label className="new-user-label" htmlFor="first_name">
                  <span className="new-user-required">*</span>
                  First Name
                </label>
                <div className="new-user-input-container">
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className={`new-user-input ${getFieldError('first_name') ? 'error' : ''}`}
                    value={formData.first_name}
                    onChange={(e) =>
                      handleInputChange('first_name', e.target.value)
                    }
                    placeholder="Enter first name"
                  />
                  {getFieldError('first_name') && (
                    <div className="new-user-field-error">
                      {getFieldError('first_name')}
                    </div>
                  )}
                </div>
              </div>

              <div className="new-user-field">
                <label className="new-user-label" htmlFor="last_name">
                  <span className="new-user-required">*</span>
                  Last Name
                </label>
                <div className="new-user-input-container">
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    className={`new-user-input ${getFieldError('last_name') ? 'error' : ''}`}
                    value={formData.last_name}
                    onChange={(e) =>
                      handleInputChange('last_name', e.target.value)
                    }
                    placeholder="Enter last name"
                  />
                  {getFieldError('last_name') && (
                    <div className="new-user-field-error">
                      {getFieldError('last_name')}
                    </div>
                  )}
                </div>
              </div>

              <div className="new-user-field">
                <label className="new-user-label" htmlFor="location">
                  <span className="new-user-required">*</span>
                  Work Location
                </label>
                <div className="new-user-input-container">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className={`new-user-input ${getFieldError('location') ? 'error' : ''}`}
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange('location', e.target.value)
                    }
                    placeholder="Enter work location"
                  />
                  {getFieldError('location') && (
                    <div className="new-user-field-error">
                      {getFieldError('location')}
                    </div>
                  )}
                </div>
              </div>

              <div className="new-user-field">
                <label className="new-user-label">Status</label>
                <div className="new-user-input-container">
                  <div className="new-user-radio-group">
                    <label className="new-user-radio-label">
                      <input
                        type="radio"
                        name="is_active"
                        value="true"
                        checked={formData.is_active === true}
                        onChange={() => handleInputChange('is_active', true)}
                      />
                      Active
                    </label>
                    <label className="new-user-radio-label">
                      <input
                        type="radio"
                        name="is_active"
                        value="false"
                        checked={formData.is_active === false}
                        onChange={() => handleInputChange('is_active', false)}
                      />
                      Inactive
                    </label>
                  </div>
                </div>
              </div>

              <div className="new-user-actions">
                <button
                  type="button"
                  onClick={handleBack}
                  className="new-user-cancel-button"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="new-user-submit-button"
                  disabled={isSubmitting}
                >
                  Create User
                </button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
