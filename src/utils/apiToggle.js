/**
 * API切换工具
 * 提供在mock数据和真实API之间切换的便捷方法
 */

import { API_CONFIG } from '../config/api';

/**
 * 切换到mock数据模式
 */
export const useMockData = () => {
  API_CONFIG.USE_MOCK = true;
  console.log('🔄 Switched to MOCK data mode');
};

/**
 * 切换到真实API模式
 */
export const useRealApi = () => {
  API_CONFIG.USE_MOCK = false;
  console.log('🔄 Switched to REAL API mode');
};

/**
 * 获取当前模式
 * @returns {string} 'mock' 或 'api'
 */
export const getCurrentMode = () => {
  return API_CONFIG.USE_MOCK ? 'mock' : 'api';
};

/**
 * 在浏览器控制台中提供切换命令
 */
if (typeof window !== 'undefined') {
  window.useMockData = useMockData;
  window.useRealApi = useRealApi;
  window.getCurrentMode = getCurrentMode;

  console.log('🛠️ API Toggle Commands Available:');
  console.log('  - useMockData(): Switch to mock data');
  console.log('  - useRealApi(): Switch to real API');
  console.log('  - getCurrentMode(): Get current mode');
  console.log(`  - Current mode: ${getCurrentMode()}`);
}
