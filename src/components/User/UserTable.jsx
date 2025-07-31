/**
 * UserTable 组件
 * 使用 @tanstack/react-table v8 实现用户数据表格
 */

import { useState, useMemo, useEffect } from 'react';
import { Form, useNavigation } from 'react-router-dom';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getSortedRowModel,
} from '@tanstack/react-table';
import Pagination from './Pagination';
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
    onTableChange = () => { }
}) => {
    const navigation = useNavigation();

    // 排序状态
    const [sorting, setSorting] = useState([]);

    // 同步外部排序状态到内部状态
    useEffect(() => {
        if (sorter && sorter.field) {
            setSorting([
                {
                    id: sorter.field,
                    desc: sorter.order === 'descend'
                }
            ]);
        } else {
            setSorting([]);
        }
    }, [sorter]);

    // 定义表格列
    const columns = useMemo(() => [
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
                return date.toLocaleString('en-US');
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
                        method="post"
                        onSubmit={(e) => {
                            if (!window.confirm('Are you sure you want to delete this user?')) {
                                e.preventDefault();
                            }
                        }}
                    >
                        <input type="hidden" name="action" value="delete" />
                        <input type="hidden" name="userId" value={row.original.staff_id} />
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
    ], [navigation.state]);

    // 初始化表格实例
    const table = useReactTable({
        data: users,
        columns,
        state: {
            sorting,
        },
        onSortingChange: (updater) => {
            const nextSorting = typeof updater === 'function' ? updater(sorting) : updater;
            setSorting(nextSorting);

            // 将 @tanstack/react-table 的排序格式转换为 API 需要的格式
            const newSorter = nextSorting.length > 0
                ? {
                    field: nextSorting[0].id,
                    order: nextSorting[0].desc ? 'descend' : 'ascend'
                }
                : {};

            // 调用父组件传入的变更处理函数
            onTableChange(pagination, filters, newSorter);
        },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualSorting: true,
    });

    // 处理分页变化
    const handlePaginationChange = (newPagination) => {
        onTableChange(newPagination, filters, sorter);
    };

    return (
        <div className="user-table-container">
            <table className="user-table">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    className={header.column.getCanSort() ? 'sortable-header' : ''}
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
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
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

            <Pagination
                pagination={pagination}
                loading={loading}
                onChange={handlePaginationChange}
            />
        </div>
    );
};

export default UserTable;