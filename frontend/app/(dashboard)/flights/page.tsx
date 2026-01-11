'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Flight } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plane, Clock, TrendingUp } from 'lucide-react';

export default function FlightsPage() {
    const router = useRouter();
    const [flights, setFlights] = useState<Flight[]>([]);
    const [cities, setCities] = useState<{ departure: string[]; arrival: string[] }>({
        departure: [],
        arrival: [],
    });
    const [filters, setFilters] = useState({
        departure_city: undefined as string | undefined,
        arrival_city: undefined as string | undefined,
        sort_by: 'base_price',
        sort_order: 'asc',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await api.get('/flights/cities');
                setCities({
                    departure: response.data.departure_cities,
                    arrival: response.data.arrival_cities,
                });
            } catch (error) {
                console.error('Failed to fetch cities:', error);
            }
        };
        fetchCities();
    }, []);

    useEffect(() => {
        const fetchFlights = async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                if (filters.departure_city) params.append('departure_city', filters.departure_city);
                if (filters.arrival_city) params.append('arrival_city', filters.arrival_city);
                params.append('sort_by', filters.sort_by);
                params.append('sort_order', filters.sort_order);

                const response = await api.get(`/flights/search?${params.toString()}`);
                setFlights(response.data.flights);
            } catch (error: any) {
                toast.error(error.response?.data?.error || 'Failed to fetch flights');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFlights();
    }, [filters]);

    const formatTime = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    const handleBookFlight = (flightId: string) => {
        router.push(`/booking/${flightId}`);
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Search Flights</h1>
                <p className="text-muted-foreground">Find and book your perfect flight</p>
            </div>

            <Card className="border-blue-100 dark:border-blue-900 shadow-lg">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                    <CardDescription>Refine your search</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Departure City</label>
                            <Select
                                value={filters.departure_city || 'all'}
                                onValueChange={(value) => setFilters({ ...filters, departure_city: value === 'all' ? undefined : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All cities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All cities</SelectItem>
                                    {cities.departure.map((city) => (
                                        <SelectItem key={city} value={city}>
                                            {city}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Arrival City</label>
                            <Select
                                value={filters.arrival_city || 'all'}
                                onValueChange={(value) => setFilters({ ...filters, arrival_city: value === 'all' ? undefined : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="All cities" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All cities</SelectItem>
                                    {cities.arrival.map((city) => (
                                        <SelectItem key={city} value={city}>
                                            {city}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Sort By</label>
                            <Select
                                value={filters.sort_by}
                                onValueChange={(value) => setFilters({ ...filters, sort_by: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="base_price">Price</SelectItem>
                                    <SelectItem value="airline">Airline</SelectItem>
                                    <SelectItem value="departure_time">Departure Time</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Order</label>
                            <Select
                                value={filters.sort_order}
                                onValueChange={(value) => setFilters({ ...filters, sort_order: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asc">Ascending</SelectItem>
                                    <SelectItem value="desc">Descending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading flights...</p>
                </div>
            ) : flights.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No flights found matching your criteria</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {flights.map((flight) => (
                        <Card key={flight._id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Plane className="h-5 w-5 text-primary" />
                                            <span className="font-bold text-lg">{flight.airline}</span>
                                            <Badge variant="outline">{flight.flight_id}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div>
                                                <p className="font-semibold">{flight.departure_city}</p>
                                                <p className="text-muted-foreground">{flight.departure_time}</p>
                                            </div>
                                            <div className="flex-1 border-t border-dashed border-gray-300"></div>
                                            <div className="text-right">
                                                <p className="font-semibold">{flight.arrival_city}</p>
                                                <p className="text-muted-foreground">{flight.arrival_time}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                        <div className="text-center md:text-right">
                                            <div className="flex items-center gap-2">
                                                <p className="text-2xl font-bold">₹{flight.current_price}</p>
                                                {flight.is_surge_active && (
                                                    <Badge variant="destructive" className="flex items-center gap-1">
                                                        <TrendingUp className="h-3 w-3" />
                                                        +{flight.surge_percentage}%
                                                    </Badge>
                                                )}
                                            </div>
                                            {flight.base_price !== flight.current_price && (
                                                <p className="text-sm text-muted-foreground line-through">
                                                    ₹{flight.base_price}
                                                </p>
                                            )}
                                            {flight.is_surge_active && flight.time_until_reset && (
                                                <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>Resets in {formatTime(flight.time_until_reset)}</span>
                                                </div>
                                            )}
                                        </div>
                                        <Button onClick={() => handleBookFlight(flight._id)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
