import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 overflow-hidden relative pb-[72px] md:pb-0">
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0 overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-200 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-200 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Sidebar className="z-10" />
      <div className="flex flex-col flex-grow z-10 overflow-hidden relative">
        <Navbar />
        <main className="flex-grow overflow-y-auto w-full p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
