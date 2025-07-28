import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import './NewUser.css';

const NewUser = () => {
    console.log("NewUser rendering...")

    const navigate = useNavigate();

    // 表单数据状态
    const [formData, setFormData] = useState({
        staff_id: '',
        first_name: '',
        last_name: '',
        location: '',
        is_active: true
    });

    // 表单状态
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);

    const handleBack = () => {
        navigate('/users');
    };

    // 处理输入变化
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // 清除该字段的错误
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    // 表单验证
    const validateForm = () => {
        const newErrors = {};

        if (!formData.staff_id.trim()) {
            newErrors.staff_id = 'Staff ID is required';
        } else if (!/^\d{8}$/.test(formData.staff_id)) {
            newErrors.staff_id = 'Staff ID must be 8 digits';
        }

        if (!formData.first_name.trim()) {
            newErrors.first_name = 'First name is required';
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Last name is required';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 处理表单提交
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setSubmitError(null);

        try {
            await userService.createUser(formData);

            // 创建成功，跳转回用户列表
            navigate('/users');
        } catch (error) {
            console.error('Error creating user:', error);

            if (error.type === 'ValidationError') {
                setErrors(error.errors);
            } else {
                setSubmitError(error.message || 'Failed to create user');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new-user">
            <div className="new-user__container">
                <div className="new-user__header">
                    <button onClick={handleBack} className="new-user__back-button">
                        ← Back to Users
                    </button>
                    <h1 className="new-user__title">Create New User</h1>
                    <p className="new-user__subtitle">Add a new user to the system with their details</p>
                </div>

                <div className="new-user__content">
                    <form onSubmit={handleSubmit} className="new-user__form">
                        <div className="new-user__card">
                            {submitError && (
                                <div className="new-user__error">
                                    {submitError}
                                </div>
                            )}

                            <div className="new-user__field">
                                <label className="new-user__label">Staff ID</label>
                                <input
                                    type="text"
                                    className={`new-user__input ${errors.staff_id ? 'error' : ''}`}
                                    value={formData.staff_id}
                                    onChange={(e) => handleInputChange('staff_id', e.target.value)}
                                    placeholder="Enter 8-digit staff ID"
                                    maxLength={8}
                                />
                                {errors.staff_id && (
                                    <div className="new-user__field-error">{errors.staff_id}</div>
                                )}
                            </div>

                            <div className="new-user__field">
                                <label className="new-user__label">First Name</label>
                                <input
                                    type="text"
                                    className={`new-user__input ${errors.first_name ? 'error' : ''}`}
                                    value={formData.first_name}
                                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                                    placeholder="Enter first name"
                                />
                                {errors.first_name && (
                                    <div className="new-user__field-error">{errors.first_name}</div>
                                )}
                            </div>

                            <div className="new-user__field">
                                <label className="new-user__label">Last Name</label>
                                <input
                                    type="text"
                                    className={`new-user__input ${errors.last_name ? 'error' : ''}`}
                                    value={formData.last_name}
                                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                                    placeholder="Enter last name"
                                />
                                {errors.last_name && (
                                    <div className="new-user__field-error">{errors.last_name}</div>
                                )}
                            </div>

                            <div className="new-user__field">
                                <label className="new-user__label">Work Location</label>
                                <input
                                    type="text"
                                    className={`new-user__input ${errors.location ? 'error' : ''}`}
                                    value={formData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    placeholder="Enter work location"
                                />
                                {errors.location && (
                                    <div className="new-user__field-error">{errors.location}</div>
                                )}
                            </div>

                            <div className="new-user__field">
                                <label className="new-user__label">Status</label>
                                <div className="new-user__radio-group">
                                    <label className="new-user__radio-label">
                                        <input
                                            type="radio"
                                            name="is_active"
                                            checked={formData.is_active === true}
                                            onChange={() => handleInputChange('is_active', true)}
                                        />
                                        Active
                                    </label>
                                    <label className="new-user__radio-label">
                                        <input
                                            type="radio"
                                            name="is_active"
                                            checked={formData.is_active === false}
                                            onChange={() => handleInputChange('is_active', false)}
                                        />
                                        Inactive
                                    </label>
                                </div>
                            </div>

                            <div className="new-user__actions">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="new-user__cancel-button"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="new-user__submit-button"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating User...' : 'Create User'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewUser;