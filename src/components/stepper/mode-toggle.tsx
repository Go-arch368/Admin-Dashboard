'use client';
import { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Plus } from 'lucide-react';

interface ModeToggleProps {
  initialHasData?: boolean;
}

export function ModeToggle({ initialHasData = false }: ModeToggleProps) {
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [hasData, setHasData] = useState(initialHasData);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const checkForData = () => {
      try {
        const apiResponse = localStorage.getItem('apiResponse');
        if (!apiResponse || apiResponse === '""') return false;

        const parsed = JSON.parse(apiResponse);
        return (
          parsed &&
          typeof parsed === 'object' &&
          Object.keys(parsed).length > 0 &&
          parsed.isPublished === true
        );
      } catch (e) {
        console.error('Error parsing apiResponse:', e);
        return false;
      }
    };

    const dataExists = checkForData();
    setHasData(dataExists);

    const forceCreateMode = localStorage.getItem('forceCreateMode');
    setMode(forceCreateMode === 'true' || !dataExists ? 'create' : 'edit');

    if (forceCreateMode === 'true') {
      localStorage.removeItem('forceCreateMode');
    }
  }, []);

  const handleCreateClick = () => {
    setIsCreating(true);
    // Save current theme before clearing
    const currentTheme = localStorage.getItem('theme');
    // Clear storage but preserve theme
    localStorage.clear();
    if (currentTheme) {
      localStorage.setItem('theme', currentTheme);
    }
    localStorage.setItem('forceCreateMode', 'true');
    setMode('create');
    setHasData(false);

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleCreateClick}
        isDisabled={isCreating}
        color={mode === 'create' ? 'primary' : 'default'}
        startContent={<Plus className="h-4 w-4" />}
        variant={mode === 'create' ? 'solid' : 'bordered'}
        size="sm"
        radius="full"
        className="mt-3 ml-5"
      >
        {isCreating ? 'Creating...' : 'Create'}
      </Button>
    </div>
  );
}