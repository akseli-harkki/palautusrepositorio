const { info } = require('./logger')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length < 1) {
    return 0
  }
  return blogs.map(n => n.likes).reduce((accumulator, currentValue) =>  accumulator + currentValue)
}

const favoriteBlog = (blogs) => {
  if (blogs.length < 1) {
    return null
  }
  blogs.sort((a, b) => b.likes - a.likes)
  return blogs[0]
}

const authorStats = (blogs) => {
  const authorStats = blogs
    .reduce((authors, n) => {
      authors[n.author] = authors[n.author] || []
      if (authors[n.author].length < 1) {
        authors[n.author] = {
          name: n.author,
          'numberOfBlogs': 0,
          'numberOfLikes': 0
        }
      }
      authors[n.author].numberOfLikes = authors[n.author].numberOfLikes + n.likes
      authors[n.author].numberOfBlogs = authors[n.author].numberOfBlogs +1
      return authors
    }, [])

  return authorStats
}

const mostBlogs = (blogs) => {
  if (blogs.length < 1) {
    return null
  }

  const stats = authorStats(blogs)
  let mostBlogs = ''
  let highestBlogs = 0

  for (const n in stats) {
    if (stats[n].numberOfBlogs > highestBlogs) {
      mostBlogs = stats[n].name
      highestBlogs = stats[n].numberOfBlogs
    }
  }

  const author = {
    author: mostBlogs,
    blogs:highestBlogs
  }

  return author
}

const mostLikes = (blogs) => {
  if (blogs.length < 1) {
    return null
  }

  const stats = authorStats(blogs)
  let mostLikes = ''
  let highestLikes = 0

  for (const n in stats) {
    if (stats[n].numberOfLikes > highestLikes) {
      mostLikes = stats[n].name
      highestLikes = stats[n].numberOfLikes
    }
  }

  const author = {
    author: mostLikes,
    likes: highestLikes
  }

  return author
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}