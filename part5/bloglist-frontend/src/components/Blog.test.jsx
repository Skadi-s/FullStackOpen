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

  render(<Blog blog={blog} />)

  expect(screen.getByText("Test Blog by Test Author")).toBeInTheDocument()
})
