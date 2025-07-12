import Blog from "./Blog";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const BlogList = () => {
    const blogs = useSelector(state => state.blogs);
    const currentUser = useSelector(state => state.user.currentUser);
    
    if (!currentUser) {
        return null;
    }

    // Sort blogs by likes in descending order
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
    
    return (
        <div>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '20px' 
            }}>
                <h2>📝 All Blogs</h2>
                <Link 
                    to="/create"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    ✍️ Create New Blog
                </Link>
            </div>
            {sortedBlogs.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    margin: '20px 0'
                }}>
                    <h3 style={{ color: '#6c757d' }}>No blogs yet</h3>
                    <p style={{ color: '#6c757d', marginBottom: '20px' }}>
                        Be the first to create a blog post!
                    </p>
                    <Link 
                        to="/create"
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '6px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        ✍️ Create Your First Blog
                    </Link>
                </div>
            ) : (
                <div>
                    <p style={{ color: '#666', marginBottom: '20px' }}>
                        Found {sortedBlogs.length} blog{sortedBlogs.length !== 1 ? 's' : ''} • Click on any blog to view details
                    </p>
                    {sortedBlogs.map(blog => (
                        <Blog key={blog.id} blog={blog} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BlogList;
