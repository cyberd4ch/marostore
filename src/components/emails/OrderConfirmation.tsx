import {
    Body, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text,
} from '@react-email/components';
import * as React from 'react';

interface OrderConfirmationEmailProps {
    orderId: string;
    cartItems: any[];
    total: number;
}

export const OrderConfirmationEmail = ({ orderId, cartItems, total }: OrderConfirmationEmailProps) => (
    <Html>
        <Head />
        <Preview>Your marostore order confirmation</Preview>
        <Body style={{ backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
            <Container style={{ margin: '0 auto', padding: '20px 0 48px', width: '580px' }}>
                <Heading style={{ fontSize: '32px', fontWeight: 'bold', letterSpacing: '-1px' }}>
                    marostore
                </Heading>
                <Text style={{ fontSize: '18px', lineHeight: '26px' }}>
                    Thank you for your purchase! We're preparing your order for shipment.
                </Text>
                <Section>
                    <Text style={{ fontWeight: 'bold' }}>Order Reference: {orderId}</Text>
                    <Hr />
                    {cartItems.map((item) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <Text>{item.name} x{item.quantity}</Text>
                            <Text>₵{(item.price * item.quantity).toFixed(2)}</Text>
                        </div>
                    ))}
                    <Hr />
                    <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>Total: ₵{total.toFixed(2)}</Text>
                </Section>
                <Text style={{ color: '#8898aa', fontSize: '12px' }}>
                    marostore, Curated High-Fashion & Sustainability.
                </Text>
            </Container>
        </Body>
    </Html>
);