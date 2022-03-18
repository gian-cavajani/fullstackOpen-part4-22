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
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
