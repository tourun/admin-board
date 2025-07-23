/**
 * 通知组件
 * 用于显示操作结果的通知消息
 */

import { useEffect } from 'react';
import './Notification.css';

/**
 * 通知组件
 * @param {Object} props - 组件属性
 * @param {boolean} props.show - 是否显示通知
 * @param {string} props.type - 通知类型 (success, error, info)
 * @param {string} props.message - 通知消息
 * @param {Function} props.onClose - 关闭回调
 * @returns {JSX.Element|null} 通知组件
 */
const Notification = ({
    show = false,
    type = 'info',
    message = '',
    onClose = () => { }
}) => {
    // 自动关闭
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className={`notification notification--${type}`}>
            <div className="notification__content">
                {type === 'success' && <span className="notification__icon">✓</span>}
                {type === 'error' && <span className="notification__icon">✗</span>}
                {type === 'info' && <span className="notification__icon">ℹ</span>}
                <span className="notification__message">{message}</span>
            </div>
            <button
                className="notification__close"
                onClick={onClose}
            >
                ×
            </button>
        </div>
    );
};

export default Notification;