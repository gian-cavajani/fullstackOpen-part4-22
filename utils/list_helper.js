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
module.exports = {
  dummy,
  totalLikes,
}
