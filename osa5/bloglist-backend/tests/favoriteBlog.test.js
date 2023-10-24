const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

describe('favorite blog ', () => {
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

  const emptyList = []

  const favorite = {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  }

  test('of empty list is null', () => {
    const result = listHelper.favoriteBlog(emptyList)
    expect(result).toBe(null)
  })

  test('when list has only one blog is correct', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual(listWithOneBlog[0])
  })

  test('of a bigger list is correct', () => {
    const result = listHelper.favoriteBlog(helper.initialBlogs)
    expect(result).toEqual(favorite)
  })
})