'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import styles from './QuickActionForm.module.css';

interface QuickActionFormProps {
    title: string;
    actionLabel: string;
    inputType: 'text' | 'number' | 'select';
    placeholder?: string;
    selectOptions?: { value: string; label:string }[];
    onSubmit: (value: string | number) => void;
    isLoading?: boolean;
    onCancel: () => void;
}

const QuickActionForm: React.FC<QuickActionFormProps> = ({
    title,
    actionLabel,
    inputType,
    placeholder,
    selectOptions,
    onSubmit,
    isLoading = false,
    onCancel,
}) => {
    const [value, setValue] = useState<string | number>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value) {
            onSubmit(value);
            setValue('');
        }
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.title}>{title}</div>
            <form onSubmit={handleSubmit}>
                <div className={styles.inputRow}>
                    {inputType === 'select' ? (
                        <Select onValueChange={(val) => setValue(val)} value={value.toString()}>
                            <SelectTrigger style={{width: '100%'}} >
                                <SelectValue placeholder={`Select...`} />
                            </SelectTrigger>
                            <SelectContent>
                                {selectOptions?.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Input
                            type={inputType}
                            placeholder={placeholder || 'Enter Amount...'}
                            value={value}
                            onChange={(e) => setValue(inputType === 'number' ? Number(e.target.value) : e.target.value)}
                            autoFocus
                        />
                    )}
                    <Button type="submit" disabled={!value || isLoading}>{actionLabel}</Button>
                    <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
                </div>
            </form>
        </div>
    );
};

export default QuickActionForm; 