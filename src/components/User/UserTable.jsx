/**
 * UserTable 组件
 * 使用 @tanstack/react-table v8 实现用户数据表格
 */

import { useMemo, useCallback } from 'react';
import { Form, useNavigation } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import './UserTable.css';

/**
 * 用户表格组件
 * @param {Object} props - 组件属性
 * @param {Array} props.users - 用户数据数组
 * @param {boolean} props.loading - 加载状态
 * @param {Object} props.pagination - 分页配置
 * @param {Object} props.filters - 筛选配置
 * @param {Object} props.sorter - 排序配置
 * @param {Function} props.onTableChange - 表格变化回调
 * @returns {JSX.Element} 用户表格组件
 */
const UserTable = ({
  users = [],
  loading = false,
  pagination = { current: 1, pageSize: 10, total: 0 },
  filters = {},
  sorter = {},
  onTableChange = () => {},
}) => {
  const navigation = useNavigation();

  // 简单的状态转换 - 只用于显示
  const sorting = useMemo(() => {
    if (sorter && sorter.field) {
      return [
        {
          id: sorter.field,
          desc: sorter.order === 'descend',
        },
      ];
    }
    return [];
  }, [sorter]);

  const paginationState = useMemo(
    () => ({
      pageIndex: (pagination.current || 1) - 1, // React Table 使用 0 基索引
      pageSize: pagination.pageSize || 10,
    }),
    [pagination]
  );

  // 处理排序变化 - 直接通知父组件
  const handleSortingChange = useCallback(
    (updater) => {
      const nextSorting =
        typeof updater === 'function' ? updater(sorting) : updater;

      const newSorter =
        nextSorting.length > 0
          ? {
              field: nextSorting[0].id,
              order: nextSorting[0].desc ? 'descend' : 'ascend',
            }
          : {};

      // 直接通知父组件，让父组件处理状态
      onTableChange(pagination, filters, newSorter);
    },
    [sorting, pagination, filters, onTableChange]
  );

  // 处理分页变化 - 直接通知父组件
  const handlePaginationChange = useCallback(
    (updater) => {
      console.log('🔄 handlePaginationChange called with updater:', updater);
      console.log('📄 Current paginationState:', paginationState);

      const nextPagination =
        typeof updater === 'function' ? updater(paginationState) : updater;

      console.log('📄 Next pagination:', nextPagination);

      const newPagination = {
        current: nextPagination.pageIndex + 1,
        pageSize: nextPagination.pageSize,
        total: pagination.total || 0,
      };

      console.log(
        '📄 Calling onTableChange with newPagination:',
        newPagination
      );

      // 直接通知父组件，让父组件处理状态
      onTableChange(newPagination, filters, sorter);
    },
    [paginationState, pagination.total, filters, sorter, onTableChange]
  );

  // 定义表格列
  const columns = useMemo(
    () => [
      {
        header: 'Staff ID',
        accessorKey: 'staff_id',
        enableSorting: true,
      },
      {
        header: 'Location',
        accessorKey: 'location',
        enableSorting: true,
      },
      {
        header: 'First Name',
        accessorKey: 'first_name',
        enableSorting: true,
      },
      {
        header: 'Last Name',
        accessorKey: 'last_name',
        enableSorting: true,
      },
      {
        header: 'Created At',
        accessorKey: 'created_at',
        enableSorting: true,
        cell: ({ getValue }) => {
          const date = new Date(getValue());
          return format(date, 'yyyy-MM-dd HH:mm:ss');
        },
      },
      {
        header: 'Status',
        accessorKey: 'is_active',
        enableSorting: true,
        cell: ({ getValue }) => (getValue() ? 'Active' : 'Inactive'),
      },
      {
        header: 'Actions',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="actions-cell">
            <Form action={row.original.staff_id}>
              <button type="submit" className="view-detail-button">
                View Detail
              </button>
            </Form>
            <Form
              action="/users"
              method="post"
              onSubmit={(e) => {
                if (
                  !window.confirm('Are you sure you want to delete this user?')
                ) {
                  e.preventDefault();
                }
              }}
            >
              <input
                type="hidden"
                name="userId"
                value={row.original.staff_id}
              />
              <input type="hidden" name="action" value="delete" />
              <button
                type="submit"
                className="delete-button"
                disabled={navigation.state === 'submitting'}
              >
                {navigation.state === 'submitting' ? 'Deleting...' : 'Delete'}
              </button>
            </Form>
          </div>
        ),
      },
    ],
    [navigation.state]
  );

  // 初始化表格实例
  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      pagination: paginationState,
    },
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualSorting: true,
    manualPagination: true, // 使用服务器端分页
    autoResetPageIndex: false, // 禁用自动重置，我们手动控制
    pageCount: Math.ceil((pagination.total || 0) / (pagination.pageSize || 10)), // 总页数
  });

  // 调试信息
  console.log('🔍 Table debug info:', {
    paginationState,
    pagination,
    pageCount: table.getPageCount(),
    canNextPage: table.getCanNextPage(),
    canPreviousPage: table.getCanPreviousPage(),
    currentPageIndex: table.getState().pagination.pageIndex,
  });

  return (
    <div className="user-table-container">
      <table className="user-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={
                    header.column.getCanSort() ? 'sortable-header' : ''
                  }
                >
                  <div
                    {...{
                      onClick: header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined,
                    }}
                    className="header-wrapper"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() && (
                      <span className="sort-indicator">
                        {{
                          asc: ' ↑',
                          desc: ' ↓',
                        }[header.column.getIsSorted()] ?? ' ↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && !loading && (
        <div className="no-data">No data available</div>
      )}

      {/* React Table 内置分页控件 */}
      <div className="pagination">
        <div className="pagination-info">
          <span>
            Showing{' '}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{' '}
            to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              pagination.total || 0
            )}
            , Total: {pagination.total || 0}
          </span>
        </div>

        <div className="pagination-controls">
          <button
            className="pagination-button"
            onClick={() => {
              console.log('🔄 First page button clicked');
              table.setPageIndex(0);
            }}
            disabled={!table.getCanPreviousPage() || loading}
          >
            {'<<'}
          </button>
          <button
            className="pagination-button"
            onClick={() => {
              console.log('🔄 Previous page button clicked');
              table.previousPage();
            }}
            disabled={!table.getCanPreviousPage() || loading}
          >
            {'<'}
          </button>
          <button
            className="pagination-button"
            onClick={() => {
              console.log('🔄 Next page button clicked');
              console.log(
                '📄 Current table state:',
                table.getState().pagination
              );
              console.log('📄 Can go next?', table.getCanNextPage());
              table.nextPage();
            }}
            disabled={!table.getCanNextPage() || loading}
          >
            {'>'}
          </button>
          <button
            className="pagination-button"
            onClick={() => {
              console.log('🔄 Last page button clicked');
              table.setPageIndex(table.getPageCount() - 1);
            }}
            disabled={!table.getCanNextPage() || loading}
          >
            {'>>'}
          </button>
        </div>

        <div className="pagination-page-size">
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
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

export default UserTable;
