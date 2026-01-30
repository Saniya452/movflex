'use client';

import { useState, useRef, useEffect } from 'react';

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
}

interface DropdownProps<T extends string = string> {
  id: string;
  label?: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  /** Min width of the trigger (e.g. min-w-[140px]) */
  triggerClassName?: string;
}

export default function Dropdown<T extends string = string>({
  id,
  label,
  value,
  options,
  onChange,
  placeholder = 'All',
  className = '',
  triggerClassName = 'min-w-[140px]',
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleSelect = (option: DropdownOption<T>) => {
    onChange(option.value);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(options[index]);
    }
    if (e.key === 'ArrowDown' && index < options.length - 1) {
      e.preventDefault();
      (e.currentTarget.nextElementSibling as HTMLElement)?.focus();
    }
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      (e.currentTarget.previousElementSibling as HTMLElement)?.focus();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label id={`${id}-label`} htmlFor={id} className="block text-sm text-zinc-400 whitespace-nowrap mb-1">
          {label}
        </label>
      )}
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((o) => !o);
          }
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={label ? `${id}-label` : undefined}
        className={`
          w-full flex items-center justify-between gap-2
          bg-zinc-800 text-white text-sm
          rounded-lg px-3 py-2
          transition-colors
          ${open ? 'border-2 border-emerald-500 ring-2 ring-emerald-500/20' : 'border border-zinc-700 hover:border-zinc-600'}
          focus:outline-none focus:border-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
          ${triggerClassName}
        `}
      >
        <span className="truncate text-left">{displayLabel}</span>
        <svg
          className={`h-4 w-4 shrink-0 text-white/80 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-activedescendant={value ? `${id}-option-${value}` : undefined}
          className="
            dropdown-list
            absolute z-50 mt-1 w-full max-h-60 overflow-y-auto
            bg-zinc-800 border border-zinc-700 rounded-lg
            py-1 shadow-xl
          "
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value}
                id={`${id}-option-${option.value}`}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onClick={() => handleSelect(option)}
                className={`
                  px-3 py-2 text-sm text-white cursor-pointer
                  transition-colors
                  ${isSelected ? 'bg-emerald-500/90 text-white' : 'hover:bg-zinc-700'}
                `}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
