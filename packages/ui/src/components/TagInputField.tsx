"use client"
import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface TagInputFieldProps {
  value?: string
  onChange: (tags: string[]) => void;
}

export const TagInputField: React.FC<TagInputFieldProps> = ({ onChange, value: externalTags }) => {
  const [internalTags, setInternalTags] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  console.log(externalTags)

  const tags = externalTags ? Array.isArray(externalTags) ? externalTags : [...externalTags] : internalTags;
  const setTags = (newTags: string[]) => {
    onChange(newTags);
    setInternalTags(newTags);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      if (input) {
        const newTags = [...tags, input];
        setTags(newTags);
        setInput('');
      }
    } else if (event.key === 'Backspace' && input === '') {
      event.preventDefault();
      if (selectedTags.length > 0) {

        const newTags = tags.filter(tag => !selectedTags.includes(tag));
        setTags(newTags);
        setSelectedTags([]); 
      } else {
        const newTags = [...tags];
        newTags.pop();
        setTags(newTags);
      }
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();
      setSelectedTags(selectedTags.length === tags.length ? [] : tags);
    } else if(event.key === 'Escape') {
      event.preventDefault();
      setSelectedTags([]);
    }
  };

  const handleDelete = (tagToDelete: string) => {
    const newTags = tags.filter((tag) => tag !== tagToDelete);
    setTags(newTags);
  };

  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (input !== '') {
      const div = inputRef.current;
      if (div) {
        const range = document.createRange();
        range.selectNodeContents(div);
        range.collapse(false);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [input]);


  return (
    <div onClick={() => inputRef.current?.focus()} onTouchEnd={() => inputRef.current?.focus()} className="flex h-full gap-2 items-center cursor-text bg-primary-900 border rounded px-2 py-2 m-h-10">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div key={index} className={`bg-primary-400 antialiased text-xs h-[24px] border border-border rounded items-center gap-2 px-2 flex ${selectedTags.includes(tag) ? 'bg-primary-800 border-link' : ''}`}>
            {tag}
            <button onClick={(e) => {  handleDelete(tag); }} onTouchEnd={(e) => { handleDelete(tag); }} className="text-sm"><X className="w-3 h-3 text-link" /></button>
          </div>
        ))}

        <div
          ref={inputRef}
          contentEditable
          role="textbox"
          aria-multiline="true"
          aria-label="Tag input field"
          suppressContentEditableWarning
          onInput={(e) => setInput((e.target as HTMLDivElement).textContent || '')}
          onKeyDown={handleKeyDown}
          className="bg-transparent antialiased flex items-center outline-none text-sm"
        >
          {input}
        </div>
      </div>
    </div>
  );
};
