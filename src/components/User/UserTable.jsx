/**
 * UserTable 组件
 * 使用 @tanstack/react-table 实现用户数据表格
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
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
    // 排序状态
    const [sorting, setSorting] = useState([]);

    // 筛选状态
    const [filterValues, setFilterValues] = useState({
        first_name: '',
        last_name: ''
    });

    // 防抖定时器
    const [filterTimer, setFilterTimer] = useState(null);

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

    // 同步外部筛选状态到内部状态
    useEffect(() => {
        setFilterValues({
            first_name: filters.first_name || '',
            last_name: filters.last_name || ''
        });
    }, [filters]);

    // 处理筛选变化
    const handleFilterChange = useCallback((field, value) => {
        // 更新内部筛选状态
        setFilterValues(prev => ({
            ...prev,
            [field]: value
        }));

        // 清除之前的定时器
        if (filterTimer) {
            clearTimeout(filterTimer);
        }

        // 设置新的定时器（防抖，300ms）
        const timer = setTimeout(() => {
            // 构建新的筛选条件
            const newFilters = {
                ...filters,
                [field]: value
            };

            // 如果值为空，则删除该筛选条件
            if (!value) {
                delete newFilters[field];
            }

            // 调用表格变化回调，重置到第一页
            onTableChange(
                { ...pagination, current: 1 },
                newFilters,
                sorter
            );
        }, 300);

        setFilterTimer(timer);
    }, [filters, pagination, sorter, filterTimer, onTableChange]);

    // 清除所有筛选
    const clearAllFilters = () => {
        setFilterValues({
            first_name: '',
            last_name: ''
        });

        onTableChange(
            { ...pagination, current: 1 },
            {},
            sorter
        );
    };

    // 检测窗口宽度
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // 监听窗口大小变化
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            // 在移动端隐藏此列
            meta: {
                className: isMobile ? 'hide-on-mobile' : ''
            }
        },
        {
            header: () => (
                <div className="column-header-with-filter">
                    <div className="header-content">
                        <span>First Name</span>
                        <input
                            type="text"
                            className="column-filter"
                            placeholder="Filter first name..."
                            value={filterValues.first_name}
                            onChange={(e) => handleFilterChange('first_name', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            ),
            accessorKey: 'first_name',
            enableSorting: true,
        },
        {
            header: () => (
                <div className="column-header-with-filter">
                    <div className="header-content">
                        <span>Last Name</span>
                        <input
                            type="text"
                            className="column-filter"
                            placeholder="Filter last name..."
                            value={filterValues.last_name}
                            onChange={(e) => handleFilterChange('last_name', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            ),
            accessorKey: 'last_name',
            enableSorting: true,
        },
        {
            header: 'Created At',
            accessorKey: 'created_at',
            enableSorting: true,
            cell: ({ getValue }) => {
                const date = new Date(getValue());
                return isMobile
                    ? date.toLocaleDateString('en-US') // 移动端只显示日期
                    : date.toLocaleString('en-US');    // 桌面端显示日期和时间
            },
            // 在移动端隐藏此列
            meta: {
                className: isMobile ? 'hide-on-mobile' : ''
            }
        },
        {
            header: 'Status',
            accessorKey: 'is_active',
            enableSorting: true,
            cell: ({ getValue }) => (getValue() ? 'Active' : 'Inactive'),
        },
    ], [filterValues, handleFilterChange, isMobile]);

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
    });

    // 处理分页变化
    const handlePaginationChange = (newPagination) => {
        onTableChange(newPagination, filters, sorter);
    };

    // 渲染筛选状态和清除按钮
    const renderFilterStatus = () => {
        const hasFilters = Object.keys(filters).length > 0;

        if (!hasFilters) return null;

        return (
            <div className="filter-status">
                <span>Filters: </span>
                {filters.first_name && (
                    <span className="filter-tag">
                        First Name: {filters.first_name}
                        <button
                            className="clear-filter-btn"
                            onClick={() => handleFilterChange('first_name', '')}
                        >
                            ×
                        </button>
                    </span>
                )}
                {filters.last_name && (
                    <span className="filter-tag">
                        Last Name: {filters.last_name}
                        <button
                            className="clear-filter-btn"
                            onClick={() => handleFilterChange('last_name', '')}
                        >
                            ×
                        </button>
                    </span>
                )}
                <button
                    className="clear-all-filters-btn"
                    onClick={clearAllFilters}
                >
                    Clear All Filters
                </button>
            </div>
        );
    };

    return (
        <div className="user-table-container">
            {loading && <div className="loading-overlay">Loading...</div>}

            {renderFilterStatus()}

            <table className="user-table">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    className={header.column.columnDef.meta?.className || ''}
                                >
                                    {header.isPlaceholder ? null : (
                                        <div
                                            {...{
                                                className: header.column.getCanSort() ? 'sortable-header' : '',
                                                onClick: header.column.getCanSort() && !header.column.columnDef.header.type
                                                    ? header.column.getToggleSortingHandler()
                                                    : undefined,
                                            }}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.getCanSort() && !header.column.columnDef.header.type && (
                                                <span className="sort-indicator">
                                                    {{
                                                        asc: ' ↑',
                                                        desc: ' ↓',
                                                    }[header.column.getIsSorted()] ?? ' ↕'}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td
                                    key={cell.id}
                                    className={cell.column.columnDef.meta?.className || ''}
                                >
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