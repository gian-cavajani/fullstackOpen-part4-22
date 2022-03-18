const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let likes = 0
  blogs.map((b) => {
    return (likes += b.likes)
  })
  return likes
}

const favoriteBlog = (blogs) => {
  let favorite = [{}, -1]
  blogs.map((b) => {
    if (favorite[1] < b.likes) {
      favorite[0] = {
        title: b.title,
        author: b.author,
        likes: b.likes,
      }
      favorite[1] = b.likes
    }
  })
  return favorite[0]
}

const mostBlogs = (blogs) => {
  let authors = []
  let vlog = []

  blogs.map((b) => {
    if (!authors.some((a) => a == b.author)) {
      authors.push(b.author)
      vlog.push(1)
    } else {
      let index = authors.indexOf(b.author)
      vlog[index]++
    }
  })

  let ind = vlog.indexOf(Math.max(...vlog))
  return {
    author: authors[ind],
    blogs: vlog[ind],
  }
}

const mostLikes = (blogs) => {
  let authors = []
  let likes = []

  blogs.map((b) => {
    if (!authors.some((a) => a == b.author)) {
      authors.push(b.author)
      likes.push(b.likes)
    } else {
      let index = authors.indexOf(b.author)
      likes[index] += b.likes
    }
  })

  let ind = likes.indexOf(Math.max(...likes))
  return {
    author: authors[ind],
    likes: likes[ind],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
