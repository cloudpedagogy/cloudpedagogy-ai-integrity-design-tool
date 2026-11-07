import React, { useState } from 'react';

interface ListEditorCardProps {
  title: string;
  description: string;
  items: string[];
  onChange: (items: string[]) => void;
  starterExamples?: string[];
}

let keyCounter = 0;
const generateKey = () => `item-key-${++keyCounter}`;

export const ListEditorCard: React.FC<ListEditorCardProps> = ({
  title,
  description,
  items,
  onChange,
  starterExamples,
}) => {
  const [newItemText, setNewItemText] = useState('');
  const [keys, setKeys] = useState<string[]>(() => items.map(() => generateKey()));
  const [prevItemsLength, setPrevItemsLength] = useState(items.length);

  const titleSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Synchronize keys state when item count changes from parent without using an effect
  if (items.length !== prevItemsLength) {
    setPrevItemsLength(items.length);
    setKeys(prev => {
      if (prev.length === items.length) return prev;
      return items.map((_, i) => prev[i] || generateKey());
    });
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newItemText.trim();
    if (trimmed) {
      setKeys(prev => [...prev, generateKey()]);
      onChange([...items, trimmed]);
      setNewItemText('');
    }
  };

  const handleEditItem = (index: number, val: string) => {
    const updated = [...items];
    updated[index] = val;
    onChange(updated);
  };

  const handleRemoveItem = (index: number) => {
    setKeys(prev => prev.filter((_, i) => i !== index));
    const updated = [...items];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setKeys(prev => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(index - 1, 0, moved);
      return next;
    });

    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(index - 1, 0, moved);
    onChange(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index >= items.length - 1) return;
    setKeys(prev => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(index + 1, 0, moved);
      return next;
    });

    const updated = [...items];
    const [moved] = updated.splice(index, 1);
    updated.splice(index + 1, 0, moved);
    onChange(updated);
  };

  const handleAddStarter = (example: string) => {
    const trimmed = example.trim();
    if (trimmed && !items.includes(trimmed)) {
      setKeys(prev => [...prev, generateKey()]);
      onChange([...items, trimmed]);
    }
  };

  const handleItemKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <div className="cp-card">
      <div className="cp-card-header">
        <h2 className="cp-card-title">{title}</h2>
        <p className="cp-card-description">{description}</p>
      </div>

      <div className="cp-list-editor mb-4">
        {items.length === 0 ? (
          <div className="cp-empty-state">No items added yet.</div>
        ) : (
          items.map((item, index) => {
            const key = keys[index] || `item-${index}`;
            return (
              <div key={key} className="cp-list-item">
                <input
                  type="text"
                  className="cp-list-item-input cp-input"
                  value={item}
                  onChange={(e) => handleEditItem(index, e.target.value)}
                  onKeyDown={handleItemKeyDown}
                  aria-label={`Edit ${title} item ${index + 1}`}
                />
                <button
                  type="button"
                  className="cp-button-secondary"
                  style={{ padding: '0.25rem 0.5rem', minWidth: '2rem' }}
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  aria-label={`Move item ${index + 1} up`}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="cp-button-secondary"
                  style={{ padding: '0.25rem 0.5rem', minWidth: '2rem' }}
                  onClick={() => handleMoveDown(index)}
                  disabled={index === items.length - 1}
                  aria-label={`Move item ${index + 1} down`}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="cp-button-secondary"
                  style={{ padding: '0.25rem 0.5rem', minWidth: '2rem' }}
                  onClick={() => handleRemoveItem(index)}
                  aria-label="Remove item"
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleAddItem} className="cp-list-item mt-2">
        <label className="visually-hidden" htmlFor={`new-item-${titleSlug}`}>
          Add new item to {title}
        </label>
        <input
          id={`new-item-${titleSlug}`}
          type="text"
          className="cp-input cp-list-item-input"
          placeholder="Type a new item and press Enter..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
        />
        <button type="submit" className="cp-button-primary">
          Add
        </button>
      </form>

      {starterExamples && starterExamples.length > 0 && (
        <div className="mt-4">
          <p className="cp-label" style={{ fontSize: '0.875rem' }}>
            Starter Examples:
          </p>
          <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {starterExamples.map((example, index) => (
              <button
                key={index}
                type="button"
                className="cp-button-secondary"
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                onClick={() => handleAddStarter(example)}
              >
                + {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
