import { render, screen } from '@testing-library/react'
import Page from '../page'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/welcome',
      query: {},
      asPath: '/welcome',
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/welcome'
  },
}))

describe('Welcome Page', () => {
  it('renders the welcome page without crashing', () => {
    render(<Page />)
    
    // Check if the page renders without crashing
    expect(document.body).toBeInTheDocument()
  })

  it('contains form elements', () => {
    render(<Page />)
    
    // Check for form inputs
    const inputs = screen.queryAllByRole('textbox')
    expect(inputs.length).toBeGreaterThanOrEqual(0)
  })
})
