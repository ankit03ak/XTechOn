'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, logout, isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        router.push('/login');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <Link href="/flights" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                ✈️ Flight Booking
                            </Link>
                            <div className="hidden md:flex space-x-4">
                                <Link href="/flights">
                                    <Button variant="ghost" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">Search Flights</Button>
                                </Link>
                                <Link href="/wallet">
                                    <Button variant="ghost" className="hover:bg-green-50 dark:hover:bg-green-900/20">Wallet</Button>
                                </Link>
                                <Link href="/history">
                                    <Button variant="ghost" className="hover:bg-purple-50 dark:hover:bg-purple-900/20">My Bookings</Button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-muted-foreground hidden sm:block">
                                Welcome, <span className="font-semibold text-blue-600 dark:text-blue-400">{user?.name}</span>
                            </span>
                            <Button variant="outline" onClick={handleLogout} className="border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:hover:bg-red-900/20">
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
