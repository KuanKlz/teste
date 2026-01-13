import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { 
  LayoutDashboard, 
  Users, 
  Scissors, 
  CalendarPlus, 
  BarChart3, 
  Menu, 
  X,
  LogOut
} from 'lucide-react';
import { base44 } from 'api/base44Client';
import { cn } from 'lib/utils';

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: createPageUrl('Dashboard'), icon: LayoutDashboard, page: 'Dashboard' },
    { name: 'Atendimentos', href: createPageUrl('Appointments'), icon: CalendarPlus, page: 'Appointments' },
    { name: 'Barbeiros', href: createPageUrl('Barbers'), icon: Users, page: 'Barbers' },
    { name: 'Serviços', href: createPageUrl('Services'), icon: Scissors, page: 'Services' },
    { name: 'Relatórios', href: createPageUrl('Reports'), icon: BarChart3, page: 'Reports' },
  ];

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <style>{`
        :root {
          --gold: #d4af37;
          --gold-light: #e5c76b;
          --dark: #0a0a0a;
          --dark-secondary: #1a1a1a;
          --dark-tertiary: #252525;
        }
      `}</style>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-72 bg-[#1a1a1a] border-r border-white/5 transform transition-transform duration-300 ease-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded-xl flex items-center justify-center">
                <Scissors className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-white font-semibold tracking-tight">BarberPro</h1>
                <p className="text-xs text-white/40">Gestão de Barbearia</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-r from-[#d4af37]/20 to-transparent text-[#d4af37] border-l-2 border-[#d4af37]" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 h-16 bg-[#1a1a1a]/95 backdrop-blur-lg border-b border-white/5 flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-white/60 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#d4af37] to-[#b8962e] rounded-lg flex items-center justify-center">
              <Scissors className="w-4 h-4 text-black" />
            </div>
            <span className="text-white font-semibold">BarberPro</span>
          </div>
          <div className="w-10" />
        </header>

        {/* Page content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}