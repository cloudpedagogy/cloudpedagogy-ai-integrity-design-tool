import React, { useState } from 'react';

interface ListEditorCardProps {
  title: string;
  description: string;
  items: string[];
  onChange: (items: string[]) => void;
  starterExamples?: string[];
}

export const ListEditorCard: React.FC<ListEditorCardProps> = ({ title, description, items, onChange, starterExamples }) => {
  const [newItemText, setNewItemText] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim()) {
      onChange([...items, newItemText.trim()]);
      setNewItemText('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  const handleAddStarter = (example: string) => {
    if (!items.includes(example)) {
      onChange([...items, example]);
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
          items.map((item, index) => (
            <div key={index} className="cp-list-item">
              <span className="cp-list-item-input cp-input" style={{ backgroundColor: 'var(--cp-secondary)' }}>{item}</span>
              <button 
                type="button" 
                className="cp-button-secondary" 
                onClick={() => handleRemoveItem(index)}
                aria-label="Remove item"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleAddItem} className="cp-list-item mt-2">
        <input 
          type="text" 
          className="cp-input cp-list-item-input" 
          placeholder="Type a new item and press Enter..." 
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
        />
        <button type="submit" className="cp-button-primary">Add</button>
      </form>

      {starterExamples && starterExamples.length > 0 && (
        <div className="mt-4">
          <p className="cp-label" style={{ fontSize: '0.875rem' }}>Starter Examples:</p>
          <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {starterExamples.map((example, index) => (
              <button 
                key={index} 
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
