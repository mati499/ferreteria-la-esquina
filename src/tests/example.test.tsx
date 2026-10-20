import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('example', () => {
  it('renders correctly', () => {
    render(<div data-testid="hello">Hola mundo</div>)
    expect(screen.getByTestId('hello')).toHaveTextContent('Hola mundo')
  })
})
