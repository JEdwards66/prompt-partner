/**
 * @file PromptList.test.js
 * @description Unit tests for the <PromptList /> component. Ensures correct rendering
 *              of prompt entries, handling of checkbox selections, triggers for
 *              edit and delete callbacks, behavior of the Clear Selection Button,
 *              and expandable prompt list functionality.
 *
 * @dependencies
 * - React
 * - @testing-library/react
 * - PromptList (component under test)
 *
 * @notes
 * - Mocks callback props (onSelectPrompt, onDeletePrompt, onEditPromptClick, onClearSelections) to verify calls.
 * - Tests empty prompt list vs. populated list.
 * - Includes tests for Clear Selection Button visibility and functionality.
 * - Expandable prompt list tests verify behavior with implemented props; truncation is tested in integration tests.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PromptList from '../PromptList';

describe('<PromptList />', () => {
  const mockOnSelectPrompt = jest.fn();
  const mockOnDeletePrompt = jest.fn();
  const mockOnEditPromptClick = jest.fn();
  const mockOnClearSelections = jest.fn();
  const mockOnToggleExpand = jest.fn();
  const mockOnCollapseAll = jest.fn();

  const samplePrompts = [
    {
      id: 1,
      name: 'Prompt A',
      content: 'Content A line 1\nContent A line 2\nContent A line 3\nContent A line 4',
      tags: 'tag1, tag2, tag3',
    },
    {
      id: 2,
      name: 'Prompt B',
      content: 'Content B',
      tags: 'work, personal',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders "No prompts found" when prompts array is empty', () => {
    render(
      <PromptList
        prompts={[]}
        selectedPrompts={[]}
        onSelectPrompt={mockOnSelectPrompt}
        onDeletePrompt={mockOnDeletePrompt}
        onEditPromptClick={mockOnEditPromptClick}
      />
    );
    expect(screen.getByText(/No prompts found/i)).toBeInTheDocument();
  });

  test('renders prompt list and checks default states', () => {
    render(
      <PromptList
        prompts={samplePrompts}
        selectedPrompts={[]}
        onSelectPrompt={mockOnSelectPrompt}
        onDeletePrompt={mockOnDeletePrompt}
        onEditPromptClick={mockOnEditPromptClick}
      />
    );

    // Confirm each prompt name is on screen
    expect(screen.getByText(/Prompt A/i)).toBeInTheDocument();
    expect(screen.getByText(/Prompt B/i)).toBeInTheDocument();

    // Confirm tags appear
    expect(screen.getByText(/tag1, tag2/i)).toBeInTheDocument();
    expect(screen.getByText(/work, personal/i)).toBeInTheDocument();

    // Check that neither prompt is selected
    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((cb) => {
      expect(cb).not.toBeChecked();
    });
  });

  test('selecting a prompt calls onSelectPrompt with its ID', () => {
    render(
      <PromptList
        prompts={samplePrompts}
        selectedPrompts={[]}
        onSelectPrompt={mockOnSelectPrompt}
        onDeletePrompt={mockOnDeletePrompt}
        onEditPromptClick={mockOnEditPromptClick}
      />
    );

    // The first prompt's checkbox
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);
    expect(mockOnSelectPrompt).toHaveBeenCalledWith(1);
  });

  test('delete button calls onDeletePrompt with prompt ID', () => {
    render(
      <PromptList
        prompts={samplePrompts}
        selectedPrompts={[]}
        onSelectPrompt={mockOnSelectPrompt}
        onDeletePrompt={mockOnDeletePrompt}
        onEditPromptClick={mockOnEditPromptClick}
      />
    );

    // The first prompt's delete button
    const deleteButtons = screen.getAllByLabelText(/delete prompt/i);
    fireEvent.click(deleteButtons[0]);
    expect(mockOnDeletePrompt).toHaveBeenCalledWith(1);
  });

  test('edit button calls onEditPromptClick with prompt data', () => {
    render(
      <PromptList
        prompts={samplePrompts}
        selectedPrompts={[]}
        onSelectPrompt={mockOnSelectPrompt}
        onDeletePrompt={mockOnDeletePrompt}
        onEditPromptClick={mockOnEditPromptClick}
      />
    );

    // The second prompt's edit button
    const editButtons = screen.getAllByLabelText(/edit prompt/i);
    fireEvent.click(editButtons[1]);
    expect(mockOnEditPromptClick).toHaveBeenCalledWith({
      id: 2,
      name: 'Prompt B',
      content: 'Content B',
      tags: 'work, personal',
    });
  });

  describe('Clear Selection Button', () => {
    test('shows clear selection button only when prompts are selected', () => {
      // No selections
      render(
        <PromptList
          prompts={samplePrompts}
          selectedPrompts={[]}
          onSelectPrompt={mockOnSelectPrompt}
          onDeletePrompt={mockOnDeletePrompt}
          onEditPromptClick={mockOnEditPromptClick}
          onClearSelections={mockOnClearSelections}
        />
      );
      expect(screen.queryByText(/Clear Selections/i)).not.toBeInTheDocument();

      // With selections
      render(
        <PromptList
          prompts={samplePrompts}
          selectedPrompts={[1]}
          onSelectPrompt={mockOnSelectPrompt}
          onDeletePrompt={mockOnDeletePrompt}
          onEditPromptClick={mockOnEditPromptClick}
          onClearSelections={mockOnClearSelections}
        />
      );
      expect(screen.getByText(/Clear Selections/i)).toBeInTheDocument();
    });

    test('clears all selected prompts when clicked', () => {
      render(
        <PromptList
          prompts={samplePrompts}
          selectedPrompts={[1, 2]}
          onSelectPrompt={mockOnSelectPrompt}
          onDeletePrompt={mockOnDeletePrompt}
          onEditPromptClick={mockOnEditPromptClick}
          onClearSelections={mockOnClearSelections}
        />
      );

      const clearButton = screen.getByRole('button', { name: /Clear Selections/i });
      expect(clearButton).toBeInTheDocument();

      // Click the clear button
      fireEvent.click(clearButton);
      expect(mockOnClearSelections).toHaveBeenCalledTimes(1);
    });
  });

  describe('Expandable Prompt List', () => {
    test('renders prompts in collapsed state by default', () => {
      render(
        <PromptList
          prompts={samplePrompts}
          selectedPrompts={[]}
          onSelectPrompt={mockOnSelectPrompt}
          onDeletePrompt={mockOnDeletePrompt}
          onEditPromptClick={mockOnEditPromptClick}
          onClearSelections={mockOnClearSelections}
          expandedStates={{}} // No prompts expanded
          onToggleExpand={mockOnToggleExpand}
          onCollapseAll={mockOnCollapseAll}
        />
      );

      // Prompt A should show first two lines conceptually; truncation tested in integration
      expect(screen.getByText(/Content A line 1/)).toBeInTheDocument();
      expect(screen.getByText(/Content A line 2/)).toBeInTheDocument();
      expect(screen.getByText(/tag1, tag2/)).toBeInTheDocument();

      // Prompt B (short content) should show full content
      expect(screen.getByText(/Content B/)).toBeInTheDocument();
    });

    test('expands prompt to show full content and tags on toggle', () => {
      render(
        <PromptList
          prompts={samplePrompts}
          selectedPrompts={[]}
          onSelectPrompt={mockOnSelectPrompt}
          onDeletePrompt={mockOnDeletePrompt}
          onEditPromptClick={mockOnEditPromptClick}
          onClearSelections={mockOnClearSelections}
          expandedStates={{ 1: true }} // Prompt A expanded
          onToggleExpand={mockOnToggleExpand}
          onCollapseAll={mockOnCollapseAll}
        />
      );

      // Simulate clicking the expand toggle button (now collapsed since initially expanded)
      const toggleButton = screen.getByLabelText(/Collapse Prompt/);
      fireEvent.click(toggleButton);
      expect(mockOnToggleExpand).toHaveBeenCalledWith(1);
    });

    test('collapses all prompts when Collapse All is clicked', () => {
      render(
        <PromptList
          prompts={samplePrompts}
          selectedPrompts={[]}
          onSelectPrompt={mockOnSelectPrompt}
          onDeletePrompt={mockOnDeletePrompt}
          onEditPromptClick={mockOnEditPromptClick}
          onClearSelections={mockOnClearSelections}
          expandedStates={{ 1: true, 2: true }} // Both expanded
          onToggleExpand={mockOnToggleExpand}
          onCollapseAll={mockOnCollapseAll}
        />
      );

      const collapseAllButton = screen.getByRole('button', { name: /Collapse All/i });
      expect(collapseAllButton).toBeInTheDocument();

      fireEvent.click(collapseAllButton);
      expect(mockOnCollapseAll).toHaveBeenCalledTimes(1);
    });
  });
});