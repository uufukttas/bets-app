'use client';

import React, { useState, forwardRef, ReactNode } from 'react';
import { SearchIcon } from '@/public/icons/SearchIcon';

type InputSize = 'xs' | 'sm' | 'md' | 'lg';
type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local';
type InputVariant = 'outlined' | 'filled' | 'unstyled';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  size?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  inputClassName?: string;
  containerClassName?: string;
  labelClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error = false,
      errorText,
      size = 'md',
      variant = 'outlined',
      fullWidth = false,
      startAdornment,
      endAdornment,
      className = '',
      inputClassName = '',
      containerClassName = '',
      labelClassName = '',
      helperTextClassName = '',
      errorClassName = '',
      disabled = false,
      required = false,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const sizeClasses = {
      xs: 'py-1 px-2 text-xs',
      sm: 'py-1.5 px-3 text-sm',
      md: 'py-2 px-4 text-base',
      lg: 'py-3 px-5 text-lg',
    };

    const variantClasses = {
      outlined: `bg-transparent border ${
        error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
      }`,
      filled: `border-none ${
        error ? 'bg-red-50 focus:bg-red-50 focus:ring-red-500' : 'bg-gray-100 focus:bg-gray-50 focus:ring-blue-500'
      }`,
      unstyled: 'border-none bg-transparent focus:ring-0 p-0',
    };

    const stateClasses = {
      disabled: 'opacity-60 cursor-not-allowed',
      error: 'text-red-500',
      focused: 'ring-2',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const baseInputClass = `outline-none rounded transition-colors ${disabled ? stateClasses.disabled : ''} ${
      sizeClasses[size]
    } ${variantClasses[variant]} ${widthClass} ${inputClassName}`;

    return (
      <div className={`${fullWidth ? 'w-full' : 'inline-block'} ${containerClassName}`}>
        {label && (
          <label
            htmlFor={props.id}
            className={`block mb-1 ${error ? 'text-red-500' : 'text-gray-700'} ${
              disabled ? 'opacity-60' : ''
            } font-medium ${labelClassName}`}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {startAdornment && (
            <div className="absolute left-3 flex items-center pointer-events-none text-gray-500">{startAdornment}</div>
          )}

          <input
            ref={ref}
            type={type}
            disabled={disabled}
            required={required}
            className={`${baseInputClass} ${startAdornment ? 'pl-10' : ''} ${endAdornment ? 'pr-10' : ''} ${className}`}
            onFocus={e => {
              setIsFocused(true);
              props.onFocus && props.onFocus(e);
            }}
            onBlur={e => {
              setIsFocused(false);
              props.onBlur && props.onBlur(e);
            }}
            {...props}
          />

          {endAdornment && (
            <div className="absolute right-3 flex items-center pointer-events-none text-gray-500">{endAdornment}</div>
          )}
        </div>

        {(helperText || (error && errorText)) && (
          <p
            className={`mt-1 text-sm ${
              error ? `text-red-500 ${errorClassName}` : `text-gray-500 ${helperTextClassName}`
            }`}
          >
            {error ? errorText : helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

export const SearchInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>((props, ref) => {
  return <Input ref={ref} type="search" startAdornment={<SearchIcon />} {...props} />;
});

SearchInput.displayName = 'SearchInput';

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  Omit<InputProps, 'type' | 'startAdornment' | 'endAdornment'> & {
    rows?: number;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
    onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  }
>((props, ref) => {
  const {
    label,
    helperText,
    error = false,
    errorText,
    size = 'md',
    variant = 'outlined',
    fullWidth = false,
    className = '',
    inputClassName = '',
    containerClassName = '',
    labelClassName = '',
    helperTextClassName = '',
    errorClassName = '',
    disabled = false,
    required = false,
    rows = 4,
    onChange,
    onFocus,
    onBlur,
    ...rest
  } = props;

  const sizeClasses = {
    xs: 'py-1 px-2 text-xs',
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-5 text-lg',
  };

  const variantClasses = {
    outlined: `bg-transparent border ${
      error
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
    }`,
    filled: `border-none ${
      error ? 'bg-red-50 focus:bg-red-50 focus:ring-red-500' : 'bg-gray-100 focus:bg-gray-50 focus:ring-blue-500'
    }`,
    unstyled: 'border-none bg-transparent focus:ring-0 p-0',
  };

  const stateClasses = {
    disabled: 'opacity-60 cursor-not-allowed',
    error: 'text-red-500',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const baseTextareaClass = `outline-none rounded transition-colors ${disabled ? stateClasses.disabled : ''} ${
    sizeClasses[size]
  } ${variantClasses[variant]} ${widthClass} ${inputClassName}`;

  return (
    <div className={`${fullWidth ? 'w-full' : 'inline-block'} ${containerClassName}`}>
      {label && (
        <label
          htmlFor={rest.id}
          className={`block mb-1 ${error ? 'text-red-500' : 'text-gray-700'} ${
            disabled ? 'opacity-60' : ''
          } font-medium ${labelClassName}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        required={required}
        className={`${baseTextareaClass} ${className}`}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />

      {(helperText || (error && errorText)) && (
        <p
          className={`mt-1 text-sm ${
            error ? `text-red-500 ${errorClassName}` : `text-gray-500 ${helperTextClassName}`
          }`}
        >
          {error ? errorText : helperText}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';
