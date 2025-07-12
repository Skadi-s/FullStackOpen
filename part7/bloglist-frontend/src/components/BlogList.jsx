import Blog from "./Blog";
import BlogDetail from "./BlogDetail";
import { useSelector } from "react-redux";
import { useState } from "react";

const BlogList = () => {
    const blogs = useSelector(state => state.blogs);
    const currentUser = useSelector(state => state.user.currentUser);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    
    if (!currentUser) {
        return null;
    }

    // 如果选中了某个博客，显示详情页
    if (selectedBlogId) {
        return (
            <BlogDetail 
                blogId={selectedBlogId} 
                onBack={() => setSelectedBlogId(null)} 
            />
        );
    }

    // Sort blogs by likes in descending order
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
    
    return (
        <div>
            <h2>📝 All Blogs</h2>
            {sortedBlogs.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    margin: '20px 0'
                }}>
                    <h3 style={{ color: '#6c757d' }}>No blogs yet</h3>
                    <p style={{ color: '#6c757d' }}>
                        Be the first to create a blog post!
                    </p>
                </div>
            ) : (
                <div>
                    <p style={{ color: '#666', marginBottom: '20px' }}>
                        Found {sortedBlogs.length} blog{sortedBlogs.length !== 1 ? 's' : ''} • Click on any blog to view details
                    </p>
                    {sortedBlogs.map(blog => (
                        <Blog 
                            key={blog.id} 
                            blog={blog} 
                            onViewDetails={() => setSelectedBlogId(blog.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogList;
