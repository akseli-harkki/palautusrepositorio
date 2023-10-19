const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')
let token1 = ''
let token2 = ''




beforeAll(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const user1 = {
    username: 'batman',
    name: 'Bruce Wayne',
    password: 'dfasd252345',
  }

  await api
    .post('/api/users')
    .send(user1)


  const result = await api
    .post('/api/login')
    .send(user1)

  token1 = result.body.token

  const user2 = {
    username: 'spiderman',
    name: 'Peter Parker',
    password: '546rtfh',
  }

  await api
    .post('/api/users')
    .send(user2)


  const result2 = await api
    .post('/api/login')
    .send(user2)

  token2 = result2.body.token

  for(let i = 0; i < helper.initialBlogs.length; i ++) {
    if (i < 3) {
      await api
        .post('/api/blogs')
        .send(helper.initialBlogs[i])
        .set({ Authorization: `Bearer ${token1}` })
    } else {
      await api
        .post('/api/blogs')
        .send(helper.initialBlogs[i])
        .set({ Authorization: `Bearer ${token2}` })
    }
  }
})

describe('blogs are returned ', () => {

  test('as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all', async () => {
    const response = await helper.blogsInDb()

    expect(response).toHaveLength(helper.initialBlogs.length)
  })

  test('with a specific blog url', async() => {
    const response = await helper.blogsInDb()

    const urls = response.map(n => n.url)

    expect(urls).toContain(
      'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    )
  })

})

test('id field name is correct', async() => {
  const response = await helper.blogsInDb()
  expect(response[0].id).toBeDefined()
})

describe('blog added ', () => {

  test('which is valid is added', async() => {

    const newBlog = {
      title: 'Water works uncover pristine Tomb of Cerberus',
      author: 'Livius',
      url: 'https://www.thehistoryblog.com/archives/68456',
      likes: 20,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token1}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDb()

    const authors = response.map(r => r.author)

    expect(response).toHaveLength(helper.initialBlogs.length + 1)
    expect(authors).toContain(
      'Livius'
    )
  })

  test('without title or url is not added', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const newBlog = {
      title: '',
      author: 'Carole Raddato',
      url: 'https://followinghadrian.com/2023/01/24/felicem-diem-natalem-hadriane-%f0%9f%8e%82/',
      likes: 20,
      __v: 0
    }

    const newBlog2 = {
      title: 'Felicem diem natalem, Hadriane! 🎂',
      author: 'Carole Raddato',
      url: '',
      likes: 20,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token1}` })
      .expect(400)

    const response = await helper.blogsInDb()

    expect(response).toHaveLength(blogsAtStart.length)

    await api
      .post('/api/blogs')
      .send(newBlog2)
      .set({ Authorization: `Bearer ${token1}` })
      .expect(400)

    const response2 = await helper.blogsInDb()

    expect(response2).toHaveLength(blogsAtStart.length)
  })

  test('without likes has zero likes', async() => {
    const newBlog = {
      title: 'Felicem diem natalem, Hadriane! 🎂',
      author: 'Carole Raddato',
      url: 'https://followinghadrian.com/2023/01/24/felicem-diem-natalem-hadriane-%f0%9f%8e%82/',
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `Bearer ${token1}` })
      .expect(201)

    const response = await helper.blogsInDb()
    expect(response.find(({ author }) => author === 'Carole Raddato').likes).toBe(0)
  })

})

describe('another user´s blog ', () => {

  test('cannot be deleted', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToBeDeleted = blogsAtStart[0]

    const result = await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .set({ Authorization: `Bearer ${token2}` })
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(result.body.error).toContain('cannot delete another user`s blog')
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

    const urls = blogsAtEnd.map(n => n.url)

    expect(urls).toContain(blogToBeDeleted.url)
  })

  test('cannot be updated', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToBeUpdated = blogsAtStart[0]

    const newBlog = {
      title: 'I hate blogs',
      author: 'Blogiest Blog',
      url: 'https://www.blogssuck.blog',
      user: blogToBeUpdated.user,
      likes: 5,
      __v: 0
    }

    const result = await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .send(newBlog)
      .set({ Authorization: `Bearer ${token2}` })
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(result.body.error).toContain('cannot change another user`s blog')
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

    const urls = blogsAtEnd.map(n => n.url)

    expect(urls).toContain(blogToBeUpdated.url)
    expect(urls).not.toContain(newBlog.url)
  })

})

test('blogs can be updated', async() => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToBeUpdated = blogsAtStart[0]

  const newBlog = {
    title: 'When Did Vampires and Werewolves Start Hating Each Other?',
    author: 'Rick Marshall',
    url: 'https://www.mentalfloss.com/posts/why-do-vampires-and-werewolves-hate-each-other',
    likes: 5,
    user: blogToBeUpdated.user,
    __v: 0
  }

  await api
    .put(`/api/blogs/${blogToBeUpdated.id}`)
    .send(newBlog)
    .set({ Authorization: `Bearer ${token1}` })
    .expect(201)

  const blogsAtEnd = await helper.blogsInDb()

  const urls = blogsAtEnd.map(n => n.url)

  expect(urls).not.toContain(blogToBeUpdated.url)
  expect(urls).toContain(newBlog.url)
})


test('blogs can be deleted', async() => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToBeDeleted = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToBeDeleted.id}`)
    .set({ Authorization: `Bearer ${token1}` })
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(blogsAtStart.length-1)

  const urls = blogsAtEnd.map(n => n.url)

  expect(urls).not.toContain(blogToBeDeleted.url)
})

describe('cannot without authorization ', () => {
  test('delete blogs', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToBeDeleted = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToBeDeleted.id}`)
      .set({ Authorization: 'Bearer 123' })
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

    const urls = blogsAtEnd.map(n => n.url)

    expect(urls).toContain(blogToBeDeleted.url)
  })
  test('add blogs', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const newBlog = {
      title: 'Blog Mcblog',
      author: 'blogger',
      url: 'https://www.blog.com/blog',
      likes: 20,
      __v: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: 'Bearer 31231' })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await helper.blogsInDb()

    const authors = response.map(r => r.author)

    expect(response).toHaveLength(blogsAtStart.length)
    expect(authors).not.toContain(
      'blogger'
    )
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})