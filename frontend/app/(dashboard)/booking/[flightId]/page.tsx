'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema, BookingFormData } from '@/lib/validations/schemas';
import api from '@/lib/api';
import { Flight, Wallet } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Plane, Wallet as WalletIcon, AlertCircle } from 'lucide-react';

export default function BookingPage() {
    const router = useRouter();
    const params = useParams();
    const flightId = params.flightId as string;

    const [flight, setFlight] = useState<Flight | null>(null);
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            passenger_name: '',
            flightId: flightId,
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [flightRes, walletRes] = await Promise.all([
                    api.get(`/flights/${flightId}`),
                    api.get('/wallet'),
                ]);
                setFlight(flightRes.data);
                setWallet(walletRes.data);
            } catch (error: any) {
                toast.error('Failed to load booking details');
                router.push('/flights');
            }
        };
        fetchData();
    }, [flightId, router]);

    const onSubmit = async (data: BookingFormData) => {
        if (!flight || !wallet) return;

        if (wallet.balance < flight.current_price) {
            toast.error('Insufficient wallet balance!');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/bookings', {
                flightId: flight._id,
                passenger_name: data.passenger_name,
            });

            toast.success('Booking successful!');
            router.push(`/booking-confirmation/${response.data.booking._id}`);
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Booking failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (!flight || !wallet) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    const hasInsufficientFunds = wallet.balance < flight.current_price;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Complete Your Booking</h1>
                <p className="text-muted-foreground">Review flight details and enter passenger information</p>
            </div>

            {/* Flight Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plane className="h-5 w-5" />
                        Flight Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-lg">{flight.airline}</p>
                            <Badge variant="outline">{flight.flight_id}</Badge>
                        </div>
                        {flight.is_surge_active && (
                            <Badge variant="destructive">Surge Pricing Active</Badge>
                        )}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Departure</p>
                            <p className="font-semibold">{flight.departure_city}</p>
                            <p className="text-sm">{flight.departure_time}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Arrival</p>
                            <p className="font-semibold">{flight.arrival_city}</p>
                            <p className="text-sm">{flight.arrival_time}</p>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Price</p>
                            <p className="text-2xl font-bold">₹{flight.current_price}</p>
                            {flight.base_price !== flight.current_price && (
                                <p className="text-sm text-muted-foreground line-through">₹{flight.base_price}</p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Wallet Balance</p>
                            <p className={`text-2xl font-bold ${hasInsufficientFunds ? 'text-destructive' : 'text-green-600'}`}>
                                ₹{wallet.balance}
                            </p>
                        </div>
                    </div>

                    {hasInsufficientFunds && (
                        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
                            <AlertCircle className="h-5 w-5" />
                            <p className="text-sm font-medium">
                                Insufficient balance. Please add ₹{flight.current_price - wallet.balance} to your wallet.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Passenger Details Form */}
            <Card>
                <CardHeader>
                    <CardTitle>Passenger Details</CardTitle>
                    <CardDescription>Enter the passenger information</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="passenger_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Passenger Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading || hasInsufficientFunds}
                                    className="flex-1"
                                >
                                    {isLoading ? 'Processing...' : `Pay ₹${flight.current_price}`}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
