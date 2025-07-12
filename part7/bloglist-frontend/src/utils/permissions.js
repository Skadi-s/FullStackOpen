// 用户权限检查工具函数

export const isRootUser = (user) => {
  return user && user.username === 'root'
}

export const isAdminUser = (user) => {
  // 可以扩展为包含其他管理员用户名
  const adminUsernames = ['root', 'admin']
  return user && adminUsernames.includes(user.username)
}

export const canAccessManagement = (user) => {
  return isRootUser(user)
}

export const canDeleteUsers = (user) => {
  return isRootUser(user)
}

export const canResetDatabase = (user) => {
  return isRootUser(user)
}

export const canDeleteOwnBlogs = (user, blog) => {
  if (!user || !blog || !blog.user) return false
  
  return (
    blog.user.id === user.id || 
    blog.user.username === user.username ||
    isRootUser(user) // root用户可以删除任何博客
  )
}

export const getUserRole = (user) => {
  if (!user) return 'guest'
  if (isRootUser(user)) return 'root'
  if (isAdminUser(user)) return 'admin'
  return 'user'
}

export const formatUserRole = (user) => {
  const role = getUserRole(user)
  const roleLabels = {
    guest: '访客',
    user: '普通用户',
    admin: '管理员',
    root: '超级管理员'
  }
  return roleLabels[role] || '未知'
}
