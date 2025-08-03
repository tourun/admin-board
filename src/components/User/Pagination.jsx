/**
 * 分页组件
 * 提供分页控制功能
 */

import './Pagination.css';

/**
 * 分页组件
 * @param {Object} props - 组件属性
 * @param {Object} props.pagination - 分页配置 {current, pageSize, total}
 * @param {boolean} props.loading - 加载状态
 * @param {Function} props.onChange - 分页变化回调
 * @returns {JSX.Element} 分页组件
 */
const Pagination = ({
  pagination = { current: 1, pageSize: 10, total: 0 },
  loading = false,
  onChange = () => {},
}) => {
  const { current, pageSize, total } = pagination;
  const totalPages = Math.ceil(total / pageSize);

  // 生成页码数组
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5; // 最多显示的页码按钮数

    if (totalPages <= maxPageButtons) {
      // 如果总页数小于等于最大按钮数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 否则，显示部分页码，并用省略号表示
      if (current <= 3) {
        // 当前页靠前
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (current >= totalPages - 2) {
        // 当前页靠后
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // 当前页在中间
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // 处理页码变化
  const handlePageChange = (page) => {
    if (page === current || page === '...' || loading) return;
    onChange({ ...pagination, current: page });
  };

  // 处理每页条数变化
  const handlePageSizeChange = (e) => {
    const newPageSize = Number(e.target.value);
    onChange({
      current: 1, // 切换每页条数时重置到第一页
      pageSize: newPageSize,
      total,
    });
  };

  return (
    <div className="pagination">
      <div className="pagination-info">
        Total {total} records,
        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          disabled={loading}
          className="page-size-select"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        per page
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-button"
          disabled={current === 1 || loading}
          onClick={() => handlePageChange(1)}
        >
          First
        </button>

        <button
          className="pagination-button"
          disabled={current === 1 || loading}
          onClick={() => handlePageChange(current - 1)}
        >
          Previous
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`pagination-button ${page === current ? 'active' : ''} ${page === '...' ? 'ellipsis' : ''}`}
            disabled={page === '...' || loading}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className="pagination-button"
          disabled={current === totalPages || loading}
          onClick={() => handlePageChange(current + 1)}
        >
          Next
        </button>

        <button
          className="pagination-button"
          disabled={current === totalPages || loading}
          onClick={() => handlePageChange(totalPages)}
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default Pagination;
