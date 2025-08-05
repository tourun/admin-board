import { useState, useEffect } from 'react'

// Mock数据生成函数
const generateMockUsers = (page, pageSize, sort) => {
  const totalUsers = 100 // 总用户数
  
  // 生成所有用户数据
  const allUsers = Array.from({ length: totalUsers }, (_, index) => ({
    staff_id: `EMP${String(index + 1).padStart(4, '0')}`,
    first_name: `名字${index + 1}`,
    last_name: `姓氏${index + 1}`,
    location: ['北京', '上海', '广州', '深圳', '杭州'][index % 5],
    is_active: Math.random() > 0.3,
    created_at: new Date(2020 + Math.floor(Math.random() * 4), 
                        Math.floor(Math.random() * 12), 
                        Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
  }))

  // 排序处理
  if (sort) {
    const [field, direction] = sort.split('_')
    allUsers.sort((a, b) => {
      let aVal = a[field]
      let bVal = b[field]
      
      // 处理不同数据类型的排序
      if (field === 'created_at') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }
      
      if (direction === 'desc') {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
      } else {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      }
    })
  }

  // 分页处理
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const users = allUsers.slice(startIndex, endIndex)

  return {
    data: users,
    total: totalUsers,
    page,
    pageSize,
    totalPages: Math.ceil(totalUsers / pageSize)
  }
}

// 模拟API调用
const fetchUsers = async (page = 1, pageSize = 10, sort = '') => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  console.log(`模拟API调用: localhost:8080/user?page=${page}&pageSize=${pageSize}${sort ? `&sort=${sort}` : ''}`)
  
  return generateMockUsers(page, pageSize, sort)
}

export const useUser = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })
  const [sorting, setSorting] = useState('')

  const loadUsers = async (page = 1, pageSize = 10, sort = '') => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetchUsers(page, pageSize, sort)
      setData(result.data)
      setPagination({
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages
      })
      setSorting(sort)
    } catch (err) {
      setError('获取用户数据失败')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const goToPage = (page) => {
    loadUsers(page, pagination.pageSize, sorting)
  }

  const changePageSize = (pageSize) => {
    loadUsers(1, pageSize, sorting)
  }

  const changeSorting = (sort) => {
    // 排序时回到第一页
    loadUsers(1, pagination.pageSize, sort)
  }

  return {
    data,
    loading,
    error,
    pagination,
    sorting,
    goToPage,
    changePageSize,
    changeSorting,
    refresh: () => loadUsers(pagination.page, pagination.pageSize, sorting)
  }
}