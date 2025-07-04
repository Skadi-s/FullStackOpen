import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
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

test("renders blog url and likes when expanded", async () => {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "https://testblog.com",
    likes: 5,
    user: { name: "Test User" }
  }

  const user = userEvent.setup()
  render(<Blog blog={blog} />)

  const button = screen.getByText("view")
  await user.click(button)  // 使用 userEvent.click 并等待

  // button should change to "hide"
  expect(screen.getByText("hide")).toBeInTheDocument()
  expect(screen.getByText("https://testblog.com")).toBeInTheDocument()
  expect(screen.getByText("likes 5")).toBeInTheDocument()
})

test("like button calls likeBlog function", async () => {
  const blog = {
    id: "1",
    title: "Test Blog",
    author: "Test Author",
    url: "https://testblog.com",
    likes: 5,
    user: { name: "Test User" }
  }
  
  const likeBlog = vi.fn()
  const user = userEvent.setup()
  render(<Blog blog={blog} likeBlog={likeBlog} />)

  // 先点击view按钮展开详情
  const viewButton = screen.getByText("view")
  await user.click(viewButton)

  // 然后点击like按钮
  const likeButton = screen.getByText("like")
  await user.click(likeButton)

  expect(likeBlog).toHaveBeenCalledWith(blog.id)
  expect(likeBlog).toHaveBeenCalledTimes(1)
  expect(screen.getByText("likes 5")).toBeInTheDocument() //
})

test("remove button calls removeBlog function", () => {
  const blog = {
    id: "1",
    title: "Test Blog",
    author: "Test Author",
    url: "https://testblog.com",
    likes: 5,
    user: { name: "Test User" }
  }
  const removeBlog = vi.fn()
  render(<Blog blog={blog} removeBlog={removeBlog} />)

  const button = screen.getByText("remove")
  button.click()

  expect(removeBlog).toHaveBeenCalledWith(blog.id)
})

test("view button toggles between view and hide", async () => {
  const blog = {
    title: "Test Blog",
    author: "Test Author",
    url: "https://testblog.com",
    likes: 5,
    user: { name: "Test User" }
  }

  const user = userEvent.setup()
  render(<Blog blog={blog} />)

  // 初始状态应该是 "view"
  expect(screen.getByText("view")).toBeInTheDocument()

  // 点击后应该变成 "hide"
  const viewButton = screen.getByText("view")
  await user.click(viewButton)
  expect(screen.getByText("hide")).toBeInTheDocument()

  // 再点击应该变回 "view"
  const hideButton = screen.getByText("hide")
  await user.click(hideButton)
  expect(screen.getByText("view")).toBeInTheDocument()
})

