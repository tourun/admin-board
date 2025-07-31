/**
 * 模拟数据服务
 * 提供用户测试数据生成和模拟网络延迟功能
 */

import { format } from 'date-fns';

// 位置列表 - 国家缩写
const locations = [
    'US', 'UK', 'CN', 'AE', 'SG', 'JP', 'DE', 'FR', 'CA', 'AU'
];

// 名字列表 - 英文名字
const firstNames = [
    'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa',
    'William', 'Jessica', 'James', 'Ashley', 'Christopher', 'Amanda', 'Daniel', 'Stephanie',
    'Matthew', 'Jennifer', 'Anthony', 'Elizabeth'
];

// 姓氏列表 - 英文姓氏
const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
    'Taylor', 'Moore', 'Jackson', 'Martin'
];

/**
 * 生成随机字符串ID
 * @param {number} length - ID长度
 * @returns {string} - 随机ID
 */
const generateId = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * 生成随机日期（过去1年内）
 * @returns {string} - ISO格式日期字符串
 */
const generateDate = () => {
    const now = new Date();
    const pastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const randomTimestamp = pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime());
    const date = new Date(randomTimestamp);
    return format(date, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx');
};

/**
 * 生成员工ID
 * @returns {string} - 8位数字字符串的员工ID
 */
const generateStaffId = () => {
    const number = Math.floor(10000000 + Math.random() * 90000000);
    return number.toString();
};

/**
 * 生成模拟用户数据
 * @param {number} count - 需要生成的用户数量
 * @returns {Array} - 用户数据数组
 */
export const generateUsers = (count = 50) => {
    const users = [];

    for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];

        const createdAt = generateDate();
        const createdDate = new Date(createdAt);
        const updatedAt = new Date(createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000); // 创建后0-30天内更新

        users.push({
            id: generateId(),
            staff_id: generateStaffId(),
            location,
            first_name: firstName,
            last_name: lastName,
            created_at: createdAt,
            updated_at: updatedAt.toISOString(),
            updated_by: `admin_${Math.floor(Math.random() * 5) + 1}`, // admin_1 到 admin_5
            is_active: Math.random() > 0.2 // 80%的用户是激活状态
        });
    }

    return users;
};

/**
 * 模拟网络延迟
 * @param {number} min - 最小延迟时间(ms)
 * @param {number} max - 最大延迟时间(ms)
 * @returns {Promise} - 延迟Promise
 */
export const simulateNetworkDelay = (min = 200, max = 500) => {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
};

// 预生成的用户数据集（100条记录）
export const mockUsers = generateUsers(100);