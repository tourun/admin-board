import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

const UserTableNew = ({
  data,
  loading,
  pagination,
  sorting,
  onPageChange,
  onPageSizeChange,
  onSortingChange,
}) => {
  // 定义表格列
  const columns = useMemo(
    () => [
      {
        accessorKey: 'staff_id',
        header: '员工ID',
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: 'first_name',
        header: '名字',
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: 'last_name',
        header: '姓氏',
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: 'location',
        header: '地点',
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: 'is_active',
        header: '状态',
        cell: (info) => (
          <span className={`status ${info.getValue() ? 'active' : 'inactive'}`}>
            {info.getValue() ? '激活' : '未激活'}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'created_at',
        header: '创建时间',
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: pagination.totalPages,
    state: {
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
      },
    },
  });

  // 处理排序点击
  const handleSort = (columnId) => {
    const currentSort = sorting;
    let newSort = '';

    if (currentSort === `${columnId}_asc`) {
      newSort = `${columnId}_desc`;
    } else if (currentSort === `${columnId}_desc`) {
      newSort = '';
    } else {
      newSort = `${columnId}_asc`;
    }

    onSortingChange(newSort);
  };

  // 获取排序图标
  const getSortIcon = (columnId) => {
    if (sorting === `${columnId}_asc`) return ' ↑';
    if (sorting === `${columnId}_desc`) return ' ↓';
    return '';
  };

  // 生成页码按钮
  const renderPageButtons = () => {
    const buttons = [];
    const currentPage = pagination.page;
    const totalPages = pagination.totalPages;

    // 显示的页码范围
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // 确保显示5个页码（如果可能）
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + 4);
      } else {
        startPage = Math.max(1, endPage - 4);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`page-button ${i === currentPage ? 'active' : ''}`}
          disabled={loading}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="user-table-container">
      {/* 表格 */}
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    <div
                      className={`header-cell ${header.column.getCanSort() ? 'sortable' : ''}`}
                      onClick={() =>
                        header.column.getCanSort() &&
                        handleSort(header.column.id)
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {getSortIcon(header.column.id)}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="loading-cell">
                  <div className="loading-spinner">加载中...</div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分页控件 */}
      <div className="pagination-container">
        <div className="pagination-info">
          <span>每页显示：</span>
          <select
            value={pagination.pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            disabled={loading}
            className="page-size-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>条记录</span>
        </div>

        <div className="pagination-controls">
          <button
            onClick={() => onPageChange(1)}
            disabled={pagination.page === 1 || loading}
            className="page-button"
          >
            首页
          </button>
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1 || loading}
            className="page-button"
          >
            上一页
          </button>

          {renderPageButtons()}

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages || loading}
            className="page-button"
          >
            下一页
          </button>
          <button
            onClick={() => onPageChange(pagination.totalPages)}
            disabled={pagination.page === pagination.totalPages || loading}
            className="page-button"
          >
            末页
          </button>
        </div>

        <div className="pagination-summary">
          显示第 {(pagination.page - 1) * pagination.pageSize + 1} -{' '}
          {Math.min(pagination.page * pagination.pageSize, pagination.total)}{' '}
          条， 共 {pagination.total} 条记录
        </div>
      </div>
    </div>
  );
};

export default UserTableNew;
