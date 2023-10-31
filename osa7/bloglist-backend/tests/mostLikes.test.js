const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

describe('author with most likes ', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const authorWithOneBlog = {
    author: 'Edsger W. Dijkstra',
    likes: 5
  }

  const emptyList = []

  const authorWithMostLikes = {
    author: 'Edsger W. Dijkstra',
    likes: 17
  }

  test('of empty list is null', () => {
    const result = listHelper.mostLikes(emptyList)
    expect(result).toBe(null)
  })

  test('when list has only one blog is correct', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual(authorWithOneBlog)
  })

  test('of a bigger list is correct', () => {
    const result = listHelper.mostLikes(helper.initialBlogs)
    expect(result).toEqual(authorWithMostLikes)
  })
})