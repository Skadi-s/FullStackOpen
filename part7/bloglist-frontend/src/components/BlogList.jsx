import Blog from "./Blog";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs } from "../reducers/blogReducer";

const BlogList = () => {
    const dispatch = useDispatch();
    const blogs = useSelector(state => state.blogs);
    
    // 初始化博客列表
    useEffect(() => {
        dispatch(initializeBlogs());
    }, [dispatch]);
    
    return (
        <div>
        <h2>Blogs</h2>
        {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} />
        ))}
        </div>
    );
};

export default BlogList;
