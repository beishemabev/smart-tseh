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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
      <nav className="flex justify-around items-center h-[4.5rem] bg-slate-900 shadow-2xl rounded-full px-2 ring-1 ring-white/10">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full space-y-1 group px-1"
            >
              <motion.div 
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex items-center justify-center w-12 h-8 rounded-full transition-all duration-300",
                  isActive ? "bg-white/20" : "bg-transparent group-hover:bg-white/10"
                )}
              >
                <Icon className={cn(
                  "w-[22px] h-[22px] transition-colors duration-300", 
                  isActive ? "text-white stroke-[2.5px]" : "text-white/60 stroke-2 group-hover:text-white/90"
                )} />
              </motion.div>
              <span className={cn(
                "text-[10px] font-semibold tracking-wide transition-colors duration-300",
                isActive ? "text-white" : "text-white/60 group-hover:text-white/90"
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
