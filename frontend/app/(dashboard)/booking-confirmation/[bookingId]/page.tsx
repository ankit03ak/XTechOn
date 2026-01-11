'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Booking } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Home } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Link from 'next/link';
import { DownloadTicketButton } from '@/components/booking/TicketPDF';

export default function BookingConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const bookingId = params.bookingId as string;
    const [booking, setBooking] = useState<Booking | null>(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await api.get(`/bookings/${bookingId}`);
                setBooking(response.data.booking);
            } catch (error) {
                toast.error('Failed to load booking details');
                router.push('/history');
            }
        };
        fetchBooking();
    }, [bookingId, router]);



    if (!booking) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Success Message */}
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full animate-pulse">
                        <CheckCircle className="h-16 w-16 text-white" />
                    </div>
                </div>
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Booking Confirmed!</h1>
                    <p className="text-muted-foreground">Your flight has been successfully booked</p>
                </div>
            </div>

            {/* Booking Details */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Booking Details</CardTitle>
                        <Badge variant="default">Confirmed</Badge>
                    </div>
                    <CardDescription>PNR: {booking.pnr}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Flight Info */}
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Flight Information</p>
                        <div className="p-4 bg-muted rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold">{booking.flight_details.airline}</p>
                                <Badge variant="outline">{booking.flight_details.flight_id}</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="font-medium">{booking.flight_details.departure_city}</p>
                                    <p className="text-muted-foreground">{booking.flight_details.departure_time}</p>
                                </div>
                                <div className="flex-1 border-t border-dashed border-gray-400 mx-4"></div>
                                <div className="text-right">
                                    <p className="font-medium">{booking.flight_details.arrival_city}</p>
                                    <p className="text-muted-foreground">{booking.flight_details.arrival_time}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Passenger & Payment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Passenger Name</p>
                            <p className="font-medium">{booking.passenger_name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Booking Date</p>
                            <p className="font-medium">{format(new Date(booking.booking_date), 'PPpp')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Amount Paid</p>
                            <p className="font-medium text-green-600">₹{booking.final_price}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">PNR Number</p>
                            <p className="font-medium font-mono">{booking.pnr}</p>
                        </div>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <DownloadTicketButton booking={booking} className="flex-1" />
                        <Link href="/flights" className="flex-1">
                            <Button variant="outline" className="w-full flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Book Another Flight
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Important Notice */}
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                <CardContent className="pt-6">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                        <strong>Important:</strong> Please save your PNR number ({booking.pnr}) for future reference.
                        You can view all your bookings in the "My Bookings" section.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
