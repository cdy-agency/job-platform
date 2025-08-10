// components/FileInput.tsx
import React, { forwardRef, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  onChange?: (files: FileList | null) => void;
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText, 
    onChange, 
    selectedFiles = [], 
    onRemoveFile,
    accept,
    multiple,
    ...props 
  }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.files);
    };

    const handleButtonClick = () => {
      inputRef.current?.click();
    };

    const handleRemoveFile = (index: number) => {
      onRemoveFile?.(index);
    };

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
            multiple={multiple}
            {...props}
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            className={cn(
              'w-full h-24 border-2 border-dashed border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center gap-2',
              error && 'border-red-500',
              className
            )}
          >
            <Upload className="h-6 w-6 text-gray-400" />
            <span className="text-sm text-gray-500">
              Click to upload {multiple ? 'files' : 'file'}
            </span>
          </Button>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-700">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      ({Math.round(file.size / 1024)}KB)
                    </div>
                  </div>
                  {onRemoveFile && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FileInput.displayName = 'FileInput';

export { FileInput };