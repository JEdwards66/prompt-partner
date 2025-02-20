/**
 * @file MasterPrompt.test.js
 * @description Unit tests for the <MasterPrompt /> component. Ensures the combined
 *              prompt text is displayed and that copying works as expected.
 *
 * @dependencies
 * - React
 * - @testing-library/react
 * - MasterPrompt (component under test)
 *
 * @notes
 * - Mocks the Clipboard API (navigator.clipboard.writeText) with Jest so `.toHaveBeenCalledWith()` works.
 * - Also verifies the copy button is disabled if there's no text.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MasterPrompt from '../MasterPrompt';

describe('<MasterPrompt />', () => {
  beforeEach(() => {
    // Make sure navigator.clipboard.writeText is a Jest mock so we can check calls
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn(),
      },
      writable: true,
    });
  });

  test('renders the combined text in the textarea', () => {
    render(<MasterPrompt selectedPromptsText="Example combined text" />);

    expect(
      screen.getByPlaceholderText(/Selected prompts will appear here.../i)
    ).toHaveValue('Example combined text');
  });

  test('copy button is disabled if no text is present', () => {
    render(<MasterPrompt selectedPromptsText="" />);
    const copyButton = screen.getByRole('button', { name: /Copy to Clipboard/i });
    expect(copyButton).toBeDisabled();
  });

  test('clicking copy button writes text to clipboard if text is present', () => {
    render(<MasterPrompt selectedPromptsText="Some text" />);
    const copyButton = screen.getByRole('button', { name: /Copy to Clipboard/i });
    expect(copyButton).not.toBeDisabled();

    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Some text');
  });
});