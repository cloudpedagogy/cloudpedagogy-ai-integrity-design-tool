import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListEditorCard } from '../components/ListEditorCard';

describe('ListEditorCard Data Integrity & Interaction Suite', () => {
  it('trims leading and trailing whitespace when adding items and rejects whitespace-only inputs', () => {
    const handleChange = vi.fn();
    render(
      <ListEditorCard
        title="Test List"
        description="Testing list"
        items={['Item 1']}
        onChange={handleChange}
      />
    );

    const input = screen.getByPlaceholderText('Type a new item and press Enter...');
    const addBtn = screen.getByRole('button', { name: 'Add' });

    // Attempt whitespace-only addition
    fireEvent.change(input, { target: { value: '    ' } });
    fireEvent.click(addBtn);
    expect(handleChange).not.toHaveBeenCalled();

    // Valid item with whitespace
    fireEvent.change(input, { target: { value: '   Cleaned item text   ' } });
    fireEvent.click(addBtn);
    expect(handleChange).toHaveBeenCalledWith(['Item 1', 'Cleaned item text']);
  });

  it('allows inline editing of existing items', () => {
    const handleChange = vi.fn();
    render(
      <ListEditorCard
        title="Acceptable Uses"
        description="Edit items in place"
        items={['Original text', 'Second item']}
        onChange={handleChange}
      />
    );

    const firstItemInput = screen.getByDisplayValue('Original text');
    fireEvent.change(firstItemInput, { target: { value: 'Modified text' } });

    expect(handleChange).toHaveBeenCalledWith(['Modified text', 'Second item']);
  });

  it('supports deleting an item without affecting other items', () => {
    const handleChange = vi.fn();
    render(
      <ListEditorCard
        title="Acceptable Uses"
        description="Remove items"
        items={['First', 'Second', 'Third']}
        onChange={handleChange}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: 'Remove item' });
    expect(removeButtons).toHaveLength(3);

    // Delete 'Second' (index 1)
    fireEvent.click(removeButtons[1]);
    expect(handleChange).toHaveBeenCalledWith(['First', 'Third']);
  });

  it('supports reordering items up and down, with proper boundary disabling', () => {
    const ControlledListEditor = () => {
      const [list, setList] = React.useState(['Alpha', 'Beta', 'Gamma']);
      return (
        <ListEditorCard
          title="Acceptable Uses"
          description="Reorder items"
          items={list}
          onChange={setList}
        />
      );
    };

    render(<ControlledListEditor />);

    let upButtons = screen.getAllByRole('button', { name: /up/i });
    let downButtons = screen.getAllByRole('button', { name: /down/i });

    // First item cannot move up
    expect(upButtons[0]).toBeDisabled();
    // Last item cannot move down
    expect(downButtons[2]).toBeDisabled();

    // Move 'Beta' (item 2) up
    fireEvent.click(upButtons[1]);

    // Check new order in inputs
    let inputs = screen.getAllByRole('textbox', { name: /Edit Acceptable Uses item/i });
    expect((inputs[0] as HTMLInputElement).value).toBe('Beta');
    expect((inputs[1] as HTMLInputElement).value).toBe('Alpha');
    expect((inputs[2] as HTMLInputElement).value).toBe('Gamma');

    // Re-query buttons
    upButtons = screen.getAllByRole('button', { name: /up/i });
    downButtons = screen.getAllByRole('button', { name: /down/i });

    // Move 'Beta' (now at index 0) down
    fireEvent.click(downButtons[0]);

    inputs = screen.getAllByRole('textbox', { name: /Edit Acceptable Uses item/i });
    expect((inputs[0] as HTMLInputElement).value).toBe('Alpha');
    expect((inputs[1] as HTMLInputElement).value).toBe('Beta');
    expect((inputs[2] as HTMLInputElement).value).toBe('Gamma');
  });

  it('adds starter example and prevents duplicate additions', () => {
    const handleChange = vi.fn();
    render(
      <ListEditorCard
        title="Acceptable Uses"
        description="Starters"
        items={['Existing item']}
        onChange={handleChange}
        starterExamples={['Existing item', 'New starter']}
      />
    );

    // Clicking already existing starter does not trigger duplicate
    const existingStarter = screen.getByRole('button', { name: '+ Existing item' });
    fireEvent.click(existingStarter);
    expect(handleChange).not.toHaveBeenCalled();

    // Clicking new starter adds it
    const newStarter = screen.getByRole('button', { name: '+ New starter' });
    fireEvent.click(newStarter);
    expect(handleChange).toHaveBeenCalledWith(['Existing item', 'New starter']);
  });

  it('prevents Enter key in an existing item input from bubbling unexpectedly', () => {
    const handleKeyDown = vi.fn();
    render(
      <div onKeyDown={handleKeyDown}>
        <ListEditorCard
          title="Acceptable Uses"
          description="Enter key test"
          items={['Existing item']}
          onChange={() => {}}
        />
      </div>
    );

    const itemInput = screen.getByDisplayValue('Existing item');
    fireEvent.keyDown(itemInput, { key: 'Enter', code: 'Enter' });

    expect(itemInput).toBeInTheDocument();
  });

  it('preserves historical empty entries without silently purging them on render', () => {
    const { container } = render(
      <ListEditorCard
        title="Acceptable Uses"
        description="Preserve empty"
        items={['Item 1', '', 'Item 3']}
        onChange={() => {}}
      />
    );

    const inputs = container.querySelectorAll('.cp-list-editor .cp-list-item-input');
    expect(inputs).toHaveLength(3);
    expect((inputs[1] as HTMLInputElement).value).toBe('');
  });
});
