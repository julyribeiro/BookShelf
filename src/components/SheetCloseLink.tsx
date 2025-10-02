// src/components/SheetCloseLink.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet'; // Importe SheetClose
import React from 'react';

// Defina as props que seu link no menu mobile precisa
interface SheetCloseLinkProps {
  href: string;
  label: string;
  icon: React.ElementType; // Para receber FaHome, FaBookOpen, etc.
}

export function SheetCloseLink({ href, label, icon: Icon }: SheetCloseLinkProps) {
  return (
    <SheetClose asChild>
      <Link href={href} className="w-full">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 btn-focus hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors dark:text-gray-200 dark:hover:text-blue-400 dark:hover:bg-gray-800"
          aria-label={`Ir para ${label}`}
        >
          <span className="flex items-center gap-2">
            <Icon /> {label}
          </span>
        </Button>
      </Link>
    </SheetClose>
  );
}