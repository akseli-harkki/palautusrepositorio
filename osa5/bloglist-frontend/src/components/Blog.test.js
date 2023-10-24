import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog', () => {

  const blog ={
    title: 'blog',
    author: 'author',
    url: 'url',
    user: {
      username: 'käyttäjä',
      name: 'K. Äyttäjä',
      id: 123
    }
  }

  const testUser = {
    username: 'käyttäjä',
    name: 'K. Äyttäjä',
    id: 123
  }

  const mockHandler = jest.fn()

  beforeEach(() => {
    render(<Blog blog={blog} user={testUser} update={mockHandler}/> )
  })

  test('renders content', () => {
    const element = screen.findByText('blog')
    expect(element).toBeDefined()
  })

  test('hides content at the start', () => {
    const div = screen.getByTestId('info')
    expect(div).not.toBeVisible()
  })

  test('after clicking "view", more information is shown', async() => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = screen.getByTestId('info')
    expect(div).toBeVisible()
  })

  test('clicking the like button twice calls the event handler twice', async() => {

    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})