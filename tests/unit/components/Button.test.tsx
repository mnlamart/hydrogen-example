import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Example test for a button component
// This demonstrates TDD approach - write tests first, then implement
describe('Button Component (Example TDD Test)', () => {
  it('renders button with text', () => {
    render(
      <button type="button" className="btn">
        Click me
      </button>
    );
    expect(screen.getByRole('button', {name: /click me/i})).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <button type="button" onClick={handleClick}>
        Click
      </button>
    );
    const button = screen.getByRole('button');
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const {container} = render(
      <button type="button" className="custom-class">
        Test
      </button>
    );
    const button = container.querySelector('button');
    expect(button).toHaveClass('custom-class');
  });
});

