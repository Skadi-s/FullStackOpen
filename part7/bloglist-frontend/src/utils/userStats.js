// 用户博客统计工具函数
export const getUserBlogs = (user, blogs) => {
  if (!user || !blogs) return []
  
  return blogs.filter(blog => {
    if (!blog.user) return false
    
    // 支持多种关联方式：ID、username 或者直接字符串比较
    return (
      blog.user.id === user.id ||
      blog.user.username === user.username ||
      blog.user === user.id ||
      blog.user === user.username
    )
  })
}

export const getUserBlogCount = (user, blogs) => {
  return getUserBlogs(user, blogs).length
}

export const getUserTotalLikes = (user, blogs) => {
  const userBlogs = getUserBlogs(user, blogs)
  return userBlogs.reduce((sum, blog) => sum + blog.likes, 0)
}

export const getUserAverageLikes = (user, blogs) => {
  const userBlogs = getUserBlogs(user, blogs)
  if (userBlogs.length === 0) return 0
  const totalLikes = getUserTotalLikes(user, blogs)
  return (totalLikes / userBlogs.length).toFixed(1)
}

export const getUserMostLikedBlog = (user, blogs) => {
  const userBlogs = getUserBlogs(user, blogs)
  if (userBlogs.length === 0) return null
  
  return userBlogs.reduce((prev, current) => 
    prev.likes > current.likes ? prev : current
  )
}

export const getUserStats = (user, blogs) => {
  const userBlogs = getUserBlogs(user, blogs)
  const totalLikes = getUserTotalLikes(user, blogs)
  const avgLikes = getUserAverageLikes(user, blogs)
  const mostLikedBlog = getUserMostLikedBlog(user, blogs)
  
  return {
    userBlogs,
    blogCount: userBlogs.length,
    totalLikes,
    avgLikes,
    mostLikedBlog
  }
}
