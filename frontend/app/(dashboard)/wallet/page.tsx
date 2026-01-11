'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Wallet as WalletType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

export default function WalletPage() {
    const [wallet, setWallet] = useState<WalletType | null>(null);
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchWallet = async () => {
        try {
            const response = await api.get('/wallet');
            setWallet(response.data);
        } catch (error) {
            toast.error('Failed to load wallet');
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    const handleAddFunds = async () => {
        const amountNum = parseFloat(amount);
        if (!amountNum || amountNum <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/wallet/add-funds', { amount: amountNum });
            toast.success(`₹${amountNum} added to wallet successfully!`);
            setAmount('');
            fetchWallet();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to add funds');
        } finally {
            setIsLoading(false);
        }
    };

    if (!wallet) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Loading wallet...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Wallet</h1>
                <p className="text-muted-foreground">Manage your wallet balance and view transactions</p>
            </div>

            {/* Balance Card */}
            <Card className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white shadow-xl border-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Wallet className="h-6 w-6" />
                        Current Balance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-5xl font-bold">₹{wallet.balance.toLocaleString()}</p>
                </CardContent>
            </Card>

            {/* Add Funds */}
            <Card>
                <CardHeader>
                    <CardTitle>Add Funds</CardTitle>
                    <CardDescription>Top up your wallet balance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="1"
                        />
                        <Button onClick={handleAddFunds} disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add Funds'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction History */}
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                        {wallet.transactions.length} transaction{wallet.transactions.length !== 1 ? 's' : ''}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {wallet.transactions.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No transactions yet</p>
                    ) : (
                        <div className="space-y-4">
                            {wallet.transactions.map((transaction, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {transaction.type === 'credit' ? (
                                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                                                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                </div>
                                            ) : (
                                                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                                                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium">{transaction.description}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(new Date(transaction.timestamp), 'PPpp')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                                            </p>
                                        </div>
                                    </div>
                                    {index < wallet.transactions.length - 1 && <Separator className="mt-4" />}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
