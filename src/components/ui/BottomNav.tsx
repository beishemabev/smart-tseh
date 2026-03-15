'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Учет',
      href: '/',
      icon: LayoutDashboard
    },
    {
      label: 'Швеи',
      href: '/employees',
      icon: Users
    },
    {
      label: 'Отчеты',
      href: '/reports',
      icon: FileText
    },
    {
      label: 'Настройки',
      href: '/settings',
      icon: Settings
    }
  ];

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 flex justify-center pb-safe">
      <nav className="flex justify-around items-center h-[4.5rem] bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)] px-2 w-full max-w-md">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full space-y-1 group"
            >
              <motion.div 
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex items-center justify-center w-12 h-8 rounded-full transition-all duration-300",
                  isActive ? "bg-blue-100" : "bg-transparent group-hover:bg-gray-50"
                )}
              >
                <Icon className={cn(
                  "w-[22px] h-[22px] transition-colors duration-300", 
                  isActive ? "text-blue-600 stroke-[2.5px]" : "text-slate-400 stroke-2 group-hover:text-slate-600"
                )} />
              </motion.div>
              <span className={cn(
                "text-[10px] font-semibold tracking-wide transition-colors duration-300",
                isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
