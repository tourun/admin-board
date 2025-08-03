import { Await } from 'react-router-dom';

/**
 * 简化的延迟数据组件
 * 只处理 Await，Suspense 由上层组件处理
 *
 * @param {Object} props
 * @param {Promise} props.data - 要等待的 Promise
 * @param {Function} props.children - 渲染函数，接收解析后的数据
 */
const DeferredData = ({ data, children }) => {
  return <Await resolve={data}>{children}</Await>;
};

export default DeferredData;
