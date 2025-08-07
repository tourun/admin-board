import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../Common/LoadingSpinner';
import './UserTable.css';

const UserTableNew = ({
  data,
  loading,
  pagination,
  sorting,
  onPageChange,
  onPageSizeChange,
  onSortingChange,
  onDeleteUser,
}) => {
  const navigate = useNavigate();

  // 定义表格列
  const columns = useMemo(
    () => [
      {
        accessorKey: 'staff_id',
        header: 'Staff ID',
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: 'first_name',
        header: 'First Name',
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: 'last_name',
        header: 'Last Name',
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: (info) => info.getValue(),
        enableSorting: true,
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: (info) => (
          <span className={`status ${info.getValue() ? 'active' : 'inactive'}`}>
            {info.getValue() ? 'Active' : 'Inactive'}
          </span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: (info) => {
          const date = info.getValue();
          return date ? format(new Date(date), 'yyyy-MM-dd') : '';
        },
        enableSorting: true,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div className="actions-cell">
            <button
              className="view-detail-button"
              onClick={() => {
                const staffId = info.row.original.staff_id;
                navigate(`/users/${staffId}`);
              }}
            >
              View Detail
            </button>
            <button
              className="delete-button"
              disabled={loading}
              onClick={async () => {
                if (confirm('Are you sure you want to delete this user?')) {
                  const userId = info.row.original.staff_id;
                  await onDeleteUser(userId);
                }
              }}
            >
              Delete
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [loading, navigate, onDeleteUser]
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
    console.log('🔄 handleSort called with columnId:', columnId);
    console.log('📄 Current sorting:', sorting);

    const currentSort = sorting;
    let newSort = '';

    if (currentSort === `${columnId}_asc`) {
      newSort = `${columnId}_desc`;
    } else if (currentSort === `${columnId}_desc`) {
      newSort = '';
    } else {
      newSort = `${columnId}_asc`;
    }

    console.log('📄 New sorting:', newSort);
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
          className={`pagination-button ${i === currentPage ? 'active' : ''}`}
          disabled={loading || i === currentPage}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="user-table-container" style={{ position: 'relative' }}>
      {loading && (
        <LoadingSpinner size="medium" message="Loading data..." inline={true} />
      )}

      {/* 表格 */}
      <div className="table-wrapper">
        <table className="user-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    <div
                      className={`header-wrapper ${
                        header.column.getCanSort() ? 'sortable-header' : ''
                      }`}
                      onClick={() =>
                        header.column.getCanSort() &&
                        handleSort(header.column.id)
                      }
                      data-sorted={sorting.startsWith(header.column.id)}
                    >
                      <span>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>
                      {header.column.getCanSort() && (
                        <span className="sort-indicator">
                          {getSortIcon(header.column.id) || '↕'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {data.length === 0 && !loading ? (
              <tr>
                <td colSpan={columns.length} className="no-data">
                  No data available
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
      <div className="pagination">
        <div className="pagination-info">
          <span>
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)},
            Total: {pagination.total}
          </span>
        </div>

        <div className="pagination-controls">
          <button
            onClick={() => onPageChange(1)}
            disabled={pagination.page === 1 || loading}
            className="pagination-button"
          >
            {'<<'}
          </button>
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1 || loading}
            className="pagination-button"
          >
            {'<'}
          </button>

          {renderPageButtons()}

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages || loading}
            className="pagination-button"
          >
            {'>'}
          </button>
          <button
            onClick={() => onPageChange(pagination.totalPages)}
            disabled={pagination.page === pagination.totalPages || loading}
            className="pagination-button"
          >
            {'>>'}
          </button>
        </div>

        <div className="pagination-page-size">
          <select
            value={pagination.pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            disabled={loading}
            className="page-size-select"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} / page
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserTableNew;
