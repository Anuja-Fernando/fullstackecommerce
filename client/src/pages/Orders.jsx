import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ordersAPI } from '../utils/api';

const Container = styled.div`
    padding: 20px 30px;
    padding-bottom: 200px;
    height: 100%;
    overflow-y: scroll;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 30px;
    @media (max-width: 768) {
        padding: 20px 12px;
    }
    background: ${({theme}) => theme.bg};
`;

const Section = styled.div`
    width: 100%;
    max-width: 1400px;
    padding: 32px 16px;
    display: flex;
    flex-direction: column;
    gap: 28px;
`;

const Title = styled.div`
    font-size: 28px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const OrderCard = styled.div`
    background: ${({theme}) => theme.card_light};
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    border: 1px solid ${({theme}) => theme.text_secondary + 20};
`;

const OrderHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid ${({theme}) => theme.text_secondary + 20};
`;

const OrderId = styled.div`
    font-weight: 600;
    color: ${({theme}) => theme.primary};
`;

const OrderStatus = styled.div`
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    background: ${({status, theme}) => 
        status === 'pending' ? theme.warning + 30 :
        status === 'completed' ? theme.success + 30 :
        theme.error + 30
    };
    color: ${({status, theme}) => 
        status === 'pending' ? theme.warning :
        status === 'completed' ? theme.success :
        theme.error
    };
`;

const OrderItems = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const OrderItem = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
`;

const ItemImage = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
`;

const ItemDetails = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const ItemName = styled.div`
    font-weight: 500;
    color: ${({theme}) => theme.text_primary};
`;

const ItemMeta = styled.div`
    font-size: 14px;
    color: ${({theme}) => theme.text_secondary};
`;

const ItemPrice = styled.div`
    font-weight: 500;
    color: ${({theme}) => theme.text_primary};
`;

const OrderTotal = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid ${({theme}) => theme.text_secondary + 20};
    font-weight: 600;
`;

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                console.log('Fetching orders...');
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log('No token found, user not logged in');
                    setLoading(false);
                    return;
                }
                const response = await ordersAPI.getUserOrders();
                console.log('Orders response:', response.data);
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                if (error.response?.status === 401) {
                    console.log('User not authenticated');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <Container><Section><Title>Loading orders...</Title></Section></Container>;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        return (
            <Container>
                <Section>
                    <Title>Your Orders</Title>
                    <div style={{textAlign: 'center', padding: '40px'}}>
                        <div style={{fontSize: '18px', marginBottom: '16px'}}>
                            Please sign in to view your orders
                        </div>
                        <div style={{color: 'var(--text-secondary)'}}>
                            You need to be logged in to see your order history
                        </div>
                    </div>
                </Section>
            </Container>
        );
    }

    return (
        <Container>
            <Section>
                <Title>Your Orders</Title>
                {orders.length === 0 ? (
                    <div>You have no orders yet</div>
                ) : (
                    orders.map((order) => (
                        <OrderCard key={order._id}>
                            <OrderHeader>
                                <OrderId>Order #{order._id.slice(-8)}</OrderId>
                                <OrderStatus status={order.status}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </OrderStatus>
                            </OrderHeader>
                            <OrderItems>
                                {order.items.map((item, index) => (
                                    <OrderItem key={index}>
                                        <ItemImage src={item.product.image} alt={item.product.name} />
                                        <ItemDetails>
                                            <ItemName>{item.product.name}</ItemName>
                                            <ItemMeta>Size: {item.size} | Quantity: {item.quantity}</ItemMeta>
                                        </ItemDetails>
                                        <ItemPrice>${item.price * item.quantity}</ItemPrice>
                                    </OrderItem>
                                ))}
                            </OrderItems>
                            <OrderTotal>
                                <span>Total Amount:</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </OrderTotal>
                        </OrderCard>
                    ))
                )}
            </Section>
        </Container>
    );
};

export default Orders;
