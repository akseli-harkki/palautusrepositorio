import React from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlog from './BlogForm'

test('Form sends the right information onward', async () => {
  const mockHandler = jest.fn()

  render(<CreateBlog handleCreation={mockHandler} />)

  const titleEl = screen.getByLabelText('Title')
  const authorEl = screen.getByLabelText('Author')
  const urlEl = screen.getByLabelText('Url')

  fireEvent.change(titleEl, { target: { value: 'otsikko' } })
  fireEvent.change(authorEl, { target: { value: 'tekijä' } })
  fireEvent.change(urlEl, { target: { value: 'urli' } })

  const user = userEvent.setup()
  const button = screen.getByText('Create')
  await user.click(button)

  expect(mockHandler.mock.calls[0][0].title).toContain('otsikko')
  expect(mockHandler.mock.calls[0][0].author).toContain('tekijä')
  expect(mockHandler.mock.calls[0][0].url).toContain('urli')
})
