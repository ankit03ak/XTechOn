import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Booking } from '@/types';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#ffffff',
    },
    header: {
        marginBottom: 30,
        borderBottom: '2 solid #000',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        fontSize: 11,
        color: '#666',
        width: '40%',
    },
    value: {
        fontSize: 11,
        fontWeight: 'bold',
        width: '60%',
    },
    pnrBox: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        marginVertical: 20,
        borderRadius: 5,
    },
    pnrLabel: {
        fontSize: 10,
        color: '#666',
        marginBottom: 5,
    },
    pnrValue: {
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    route: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15,
        padding: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 5,
    },
    routeCity: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    routeTime: {
        fontSize: 10,
        color: '#666',
        marginTop: 5,
    },
    arrow: {
        fontSize: 20,
        color: '#666',
    },
    footer: {
        marginTop: 30,
        paddingTop: 20,
        borderTop: '1 solid #ddd',
        fontSize: 9,
        color: '#999',
        textAlign: 'center',
    },
});

interface TicketPDFProps {
    booking: Booking;
}

const TicketPDF: React.FC<TicketPDFProps> = ({ booking }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>Flight Ticket</Text>
                <Text style={styles.subtitle}>Booking Confirmation</Text>
            </View>

            <View style={styles.pnrBox}>
                <Text style={styles.pnrLabel}>PNR Number</Text>
                <Text style={styles.pnrValue}>{booking.pnr}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Passenger Details</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Passenger Name:</Text>
                    <Text style={styles.value}>{booking.passenger_name}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Booking Date:</Text>
                    <Text style={styles.value}>
                        {format(new Date(booking.booking_date), 'PPpp')}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Status:</Text>
                    <Text style={styles.value}>{booking.status.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Flight Details</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Airline:</Text>
                    <Text style={styles.value}>{booking.flight_details.airline}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Flight Number:</Text>
                    <Text style={styles.value}>{booking.flight_details.flight_id}</Text>
                </View>
            </View>

            <View style={styles.route}>
                <View>
                    <Text style={styles.routeCity}>{booking.flight_details.departure_city}</Text>
                    <Text style={styles.routeTime}>{booking.flight_details.departure_time}</Text>
                </View>
                <Text style={styles.arrow}>→</Text>
                <View>
                    <Text style={styles.routeCity}>{booking.flight_details.arrival_city}</Text>
                    <Text style={styles.routeTime}>{booking.flight_details.arrival_time}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Payment Details</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Total Amount Paid:</Text>
                    <Text style={styles.value}>₹{booking.final_price}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text>This is a computer-generated ticket and does not require a signature.</Text>
                <Text>Please carry a valid ID proof while traveling.</Text>
                <Text>Thank you for choosing our service!</Text>
            </View>
        </Page>
    </Document>
);

interface DownloadTicketButtonProps {
    booking: Booking;
    variant?: 'default' | 'outline';
    className?: string;
}

export const DownloadTicketButton: React.FC<DownloadTicketButtonProps> = ({
    booking,
    variant = 'default',
    className = ''
}) => {
    return (
        <PDFDownloadLink
            document={<TicketPDF booking={booking} />}
            fileName={`ticket-${booking.pnr}.pdf`}
            className={className}
        >
            {({ loading }) => (
                <Button variant={variant} className={`flex items-center gap-2 ${className}`}>
                    <Download className="h-4 w-4" />
                    {loading ? 'Generating PDF...' : 'Download Ticket'}
                </Button>
            )}
        </PDFDownloadLink>
    );
};

export default TicketPDF;
