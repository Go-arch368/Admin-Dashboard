
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Plus } from 'lucide-react';

export function ModeToggle({}: object) {
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const checkForData = () => {
      try {
        const apiResponse = localStorage.getItem('apiResponse');
        if (!apiResponse) return false;

        const parsed = JSON.parse(apiResponse);

        return parsed && typeof parsed === 'object' &&
               Object.keys(parsed).length > 0 &&
               Object.values(parsed).some(val => val !== undefined && val !== null);
      } catch (_) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return false;
      }
    };

    const dataExists = checkForData();

    const forceCreateMode = localStorage.getItem('forceCreateMode');
    setMode(forceCreateMode === 'true' || !dataExists ? 'create' : 'edit');

    if (forceCreateMode === 'true') {
      localStorage.removeItem('forceCreateMode');
    }
  }, []);

  const handleCreateClick = () => {
    setIsCreating(true);
    localStorage.clear();
    localStorage.removeItem('apiResponse');
    localStorage.setItem('forceCreateMode', 'true');
    setMode('create');

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