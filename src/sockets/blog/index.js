import { createBlog } from './events/createBlog'
const cloudinaryFolderName = 'blog_photos'

/**
 * Vì API Websocket nó đặc biệt hơn so với HTTP, cho nên là mình cũng phải có setup
 * khác biệt đi nhiều một tí.
 */

export const BlogSocketEventNames = {
  create: 'create:blog'
}

/**
 * @typedef BlogCreateEventStatusProps
 * @property {boolean} isDone Cho biết là sự kiện tạo Blog đã xong hay chưa?
 * @property {boolean} isError Cho biết sự kiện này đã bị lỗi, có thể là ở chỗ nào đó.
 * @property {boolean} canUpload Cho biết là có thể upload tiếp được không? Dùng khi đang upload content.
 * @property {number} progress Cho biết tiến trình đã được bao nhiêu %
 */

// Configure event
const BlogSocketEvents = [
  {
    name: BlogSocketEventNames.create,
    fn: createBlog
  }
]

export function listenAllBlogSocketEvents(io, socket) {
  for (let event of BlogSocketEvents) {
    event.fn(io, socket, event.name)
    console.log(`Listen to ${event.name} done.`)
  }
}