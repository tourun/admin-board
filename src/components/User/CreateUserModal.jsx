/**
 * CreateUserModal 组件
 * 用于创建新用户的模态框
 */

import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './CreateUserModal.css';

// 确保 Modal 可访问性设置
// 在实际应用中，这应该在应用入口处设置一次
if (typeof window !== 'undefined') {
    Modal.setAppElement('#root');
}

/**
 * 创建用户模态框组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.isOpen - 模态框是否打开
 * @param {Function} props.onRequestClose - 关闭请求回调
 * @param {Function} props.onSubmit - 提交回调
 * @param {boolean} props.loading - 加载状态
 * @param {Object} props.submitError - 提交错误信息
 * @returns {JSX.Element} 创建用户模态框组件
 */
const CreateUserModal = ({
    isOpen = false,
    onRequestClose = () => { },
    onSubmit = () => { },
    loading = false,
    submitError = null
}) => {
    // 表单状态
    const [formData, setFormData] = useState({
        staff_id: '',
        location: '',
        first_name: '',
        last_name: '',
        is_active: true
    });

    // 错误状态
    const [errors, setErrors] = useState({});

    // 成功消息状态
    const [successMessage, setSuccessMessage] = useState('');

    // 重置表单
    useEffect(() => {
        if (isOpen) {
            setFormData({
                staff_id: '',
                location: '',
                first_name: '',
                last_name: '',
                is_active: true
            });
            setErrors({});
            setSuccessMessage('');
        }
    }, [isOpen]);

    // 处理提交错误
    useEffect(() => {
        if (submitError) {
            if (typeof submitError === 'object' && submitError !== null) {
                // 字段级错误
                setErrors(prev => ({
                    ...prev,
                    ...submitError
                }));
            } else {
                // 一般错误
                setErrors(prev => ({
                    ...prev,
                    general: typeof submitError === 'string' ? submitError : 'Failed to create user, please try again'
                }));
            }
        }
    }, [submitError]);

    // 处理输入变化
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // 清除对应字段的错误
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // 验证表单
    const validateForm = () => {
        const newErrors = {};

        if (!formData.staff_id) {
            newErrors.staff_id = 'Staff ID is required';
        } else if (!/^\d{8}$/.test(formData.staff_id)) {
            newErrors.staff_id = 'Staff ID must be 8 digits';
        }

        if (!formData.first_name) {
            newErrors.first_name = 'First name is required';
        }

        if (!formData.last_name) {
            newErrors.last_name = 'Last name is required';
        }

        if (!formData.location) {
            newErrors.location = 'Location is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 处理表单提交
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');

        if (validateForm()) {
            try {
                const result = await onSubmit(formData);

                // 如果提交成功
                if (result && result.success) {
                    setSuccessMessage('User created successfully!');

                    // 3秒后关闭模态框
                    setTimeout(() => {
                        onRequestClose();
                    }, 1500);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                setErrors(prev => ({
                    ...prev,
                    general: 'Failed to create user, please try again'
                }));
            }
        }
    };

    // 位置选项 - 国家缩写
    const locationOptions = [
        'US', 'UK', 'CN', 'AE', 'SG', 'JP', 'DE', 'FR', 'CA', 'AU'
    ];

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Create New User"
            className="create-user-modal"
            overlayClassName="create-user-modal-overlay"
            closeTimeoutMS={300}
        >
            <div className="modal-header">
                <h2>Create New User</h2>
                <button
                    className="close-button"
                    onClick={onRequestClose}
                    disabled={loading}
                >
                    ×
                </button>
            </div>

            <form onSubmit={handleSubmit} className="create-user-form">
                <div className="form-group">
                    <label htmlFor="staff_id">Staff ID *</label>
                    <input
                        type="text"
                        id="staff_id"
                        name="staff_id"
                        value={formData.staff_id}
                        onChange={handleInputChange}
                        placeholder="8-digit number"
                        disabled={loading}
                        className={errors.staff_id ? 'error' : ''}
                    />
                    {errors.staff_id && <div className="error-message">{errors.staff_id}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="location">Location *</label>
                    <select
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        disabled={loading}
                        className={errors.location ? 'error' : ''}
                    >
                        <option value="">Please select location</option>
                        {locationOptions.map(location => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>
                    {errors.location && <div className="error-message">{errors.location}</div>}
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="first_name">First Name *</label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            disabled={loading}
                            className={errors.first_name ? 'error' : ''}
                        />
                        {errors.first_name && <div className="error-message">{errors.first_name}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="last_name">Last Name *</label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            disabled={loading}
                            className={errors.last_name ? 'error' : ''}
                        />
                        {errors.last_name && <div className="error-message">{errors.last_name}</div>}
                    </div>
                </div>

                <div className="form-group checkbox-group">
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        disabled={loading}
                    />
                    <label htmlFor="is_active">Active Status</label>
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onRequestClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Create User'}
                    </button>
                </div>

                {errors.general && (
                    <div className="general-error">
                        {errors.general}
                    </div>
                )}

                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}
            </form>
        </Modal>
    );
};

export default CreateUserModal;