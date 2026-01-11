'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Booking } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Plane, Calendar, User, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { DownloadTicketButton } from '@/components/booking/TicketPDF';

export default function HistoryPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get('/bookings/history');
                setBookings(response.data.bookings);
            } catch (error) {
                toast.error('Failed to load booking history');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const handleDownloadTicket = (bookingId: string) => {
        // This will be implemented with PDF generation
        toast.info('PDF download feature coming soon!');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Loading bookings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">My Bookings</h1>
                <p className="text-muted-foreground">
                    {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
                </p>
            </div>

            {bookings.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <Plane className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">No bookings yet</p>
                            <p className="text-muted-foreground">Start by searching for flights!</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {bookings.map((booking) => (
                        <Card key={booking._id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Plane className="h-5 w-5" />
                                        {booking.flight_details.airline} - {booking.flight_details.flight_id}
                                    </CardTitle>
                                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'destructive'}>
                                        {booking.status}
                                    </Badge>
                                </div>
                                <CardDescription>PNR: {booking.pnr}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Flight Route */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">From</p>
                                        <p className="font-semibold">{booking.flight_details.departure_city}</p>
                                        <p className="text-sm">{booking.flight_details.departure_time}</p>
                                    </div>
                                    <div className="flex-1 border-t border-dashed border-gray-300 mx-4"></div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">To</p>
                                        <p className="font-semibold">{booking.flight_details.arrival_city}</p>
                                        <p className="text-sm">{booking.flight_details.arrival_time}</p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Booking Details */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Passenger</p>
                                            <p className="font-medium">{booking.passenger_name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Booked On</p>
                                            <p className="font-medium">
                                                {format(new Date(booking.booking_date), 'PP')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Amount Paid</p>
                                            <p className="font-medium">₹{booking.final_price}</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Actions */}
                                <div className="flex justify-end">
                                    <DownloadTicketButton booking={booking} variant="outline" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
