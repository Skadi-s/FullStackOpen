import Blog from "./Blog";
import { useSelector } from "react-redux";

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
            <h2>Blogs</h2>
            {sortedBlogs.length === 0 ? (
                <p>No blogs yet.</p>
            ) : (
                sortedBlogs.map(blog => (
                    <Blog key={blog.id} blog={blog} />
                ))
            )}
        </div>
    );
};

export default BlogList;
