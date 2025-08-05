/**
 * 简化版的 UserTable 组件
 * 参考 UseTableNew.jsx 的设计理念，纯展示组件
 */
import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { Form, useNavigate } from 'react-router-dom';
import './UserTable.css'; // 复用现有样式

const UserTableSimplified = ({
  users = [],
  loading = false,
  pagination = { page: 1, size: 10, total: 0 },
  sorting = { field: '', order: '' },
  onPageChange,
  onPageSizeChange,
  onSortingChange,
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
                console.log('Navigating to user detail:', staffId);
                navigate(`/users/${staffId}`);
              }}
            >
              View Detail
            </button>
            <Form method="post" style={{ display: 'inline' }}>
              <input type="hidden" name="action" value="delete" />
              <input
                type="hidden"
                name="userId"
                value={info.row.original.staff_id}
              />
              <button
                type="submit"
                className="delete-button"
                disabled={loading}
                onClick={(e) => {
                  if (!confirm('Are you sure you want to delete this user?')) {
                    e.preventDefault();
                  }
                }}
              >
                Delete
              </button>
            </Form>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [loading]
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(pagination.total / pagination.size),
  });

  // 处理排序点击
  const handleSort = (columnId) => {
    const currentField = sorting.field;
    const currentOrder = sorting.order;

    let newField = columnId;
    let newOrder = 'ascend';

    if (currentField === columnId) {
      if (currentOrder === 'ascend') {
        newOrder = 'descend';
      } else if (currentOrder === 'descend') {
        // 取消排序
        newField = '';
        newOrder = '';
      }
    }

    onSortingChange(newField, newOrder);
  };

  // 获取排序图标
  const getSortIcon = (columnId) => {
    if (sorting.field === columnId) {
      if (sorting.order === 'ascend') return ' ↑';
      if (sorting.order === 'descend') return ' ↓';
    }
    return '';
  };

  return (
    <div className="user-table-container">
      {loading && <div className="loading-overlay">Loading...</div>}

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
                      header.column.getCanSort() && handleSort(header.column.id)
                    }
                    data-sorted={sorting.field === header.column.id}
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
          {users.length === 0 && !loading ? (
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 简化的分页控件 */}
      <div className="pagination">
        <div className="pagination-info">
          <span>
            Showing {(pagination.page - 1) * pagination.size + 1} to{' '}
            {Math.min(pagination.page * pagination.size, pagination.total)},
            Total: {pagination.total}
          </span>
        </div>

        <div className="pagination-controls">
          <button
            className="pagination-button"
            onClick={() => onPageChange(1)}
            disabled={pagination.page === 1 || loading}
          >
            {'<<'}
          </button>
          <button
            className="pagination-button"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1 || loading}
          >
            {'<'}
          </button>
          <button
            className="pagination-button"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={
              pagination.page >=
                Math.ceil(pagination.total / pagination.size) || loading
            }
          >
            {'>'}
          </button>
          <button
            className="pagination-button"
            onClick={() =>
              onPageChange(Math.ceil(pagination.total / pagination.size))
            }
            disabled={
              pagination.page >=
                Math.ceil(pagination.total / pagination.size) || loading
            }
          >
            {'>>'}
          </button>
        </div>

        <div className="pagination-page-size">
          <select
            value={pagination.size}
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

export default UserTableSimplified;
