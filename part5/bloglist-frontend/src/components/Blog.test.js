import { render, screen } from "@testing-library/react"
import Blog from "./Blog"

test("renders blog title and author", () => {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "https://testblog.com",
    likes: 5,
    user: { name: "Test User" }
  }

  // 提供模拟函数作为 props
  const mockLikeBlog = jest.fn()
  const mockRemoveBlog = jest.fn()

  render(<Blog blog={blog} likeBlog={mockLikeBlog} removeBlog={mockRemoveBlog} />)
  
  expect(screen.getByText("Test Blog by Test Author")).toBeInTheDocument()
})
