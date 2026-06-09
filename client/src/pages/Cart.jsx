import React, { useState, useEffect } from 'react'
import styled from "styled-components"
import { cartAPI, ordersAPI } from '../utils/api';
import Button from '../components/Button';

const Container = styled.div`
    padding: 20px 30px;
    padding-bottom:200px;
    height: 100%;
    overflow-y:scroll;
    display: flex;
    align-items:center;
    flex-direction:column;
    gap: 30px;
    @media (max-width:768){
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
    gap:28px;
`;

const Title = styled.div`
    font-size: 28px;
    font-weight: 500;
    display: flex;
    justify-content: ${({center}) => (center ? "center" : "space-between")};
    align-items: center;
    `;
const Wrapper =styled.div`
  display: flex;
  gap: 32px;
  width: 100%;
  padding: 12px;
  @media(max-width: 750px){
    flex-direction: column;
  }
`;
const Left = styled.div`
  flex: 1;
  background: red;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 750px){
    flex : 1.2;
  }
`;
const Table = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 30px;
  ${({head}) => head && `margin-bottom: 22px`}
`;
const TableItem = styled.div`
  ${({flex}) => flex && `flex:1; `}
  ${({bold}) => 
    bold &&
    `font-weight: 600;
    font-size: 18px;`
  }
`;
const Counter = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  border: 1px solid${({theme}) => theme.text_secondary + 40};
  border-radius: 8px;
  padding: 4px 12px;
`;
const Product = styled.div`
  display: flex;
  gap: 16px;
`;
const Img = styled.div`
  height: 80px;
`;
const Details = styled.div``;
const Protitle = styled.div`
  color: ${({theme}) => theme.primary};
  font-size: 16px;
  font-weight: 500;
`;
const ProDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({theme}) => theme.text_primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const ProSize = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const Right = styled.div`
  flex: 1;
  background: blue;
    display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 750px){
    flex : 0.8;
  }

`;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderProcessing, setOrderProcessing] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, user not logged in');
          setLoading(false);
          return;
        }
        const response = await cartAPI.get();
        setCartItems(response.data);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        if (error.response?.status === 401) {
          console.log('User not authenticated for cart');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleRemoveFromCart = async (productId, size) => {
    try {
      await cartAPI.remove(productId, size);
      const response = await cartAPI.get();
      setCartItems(response.data);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const handleCheckout = async () => {
    setOrderProcessing(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          size: item.size
        })),
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      };
      
      await ordersAPI.create(orderData);
      alert('Order placed successfully!');
      setCartItems([]);
    } catch (error) {
      alert('Failed to place order');
    } finally {
      setOrderProcessing(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  if (loading) {
    return <Container><Section><Title>Loading cart...</Title></Section></Container>;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return (
      <Container>
        <Section>
          <Title>Your Shopping Cart</Title>
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={{fontSize: '18px', marginBottom: '16px'}}>
              Please sign in to view your cart
            </div>
            <div style={{color: 'var(--text-secondary)'}}>
              You need to be logged in to see your cart items
            </div>
          </div>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <Title>Your Shopping Cart</Title>
        <Wrapper>
          <Left>
            <Table head>
              <TableItem bold flex>
                Product
              </TableItem>
              <TableItem bold>Price</TableItem>
              <TableItem bold>Quantity</TableItem>
              <TableItem bold>Subtotal</TableItem>
              <TableItem bold>Action</TableItem>
            </Table>
            {cartItems.length === 0 ? (
              <div>Your cart is empty</div>
            ) : (
              cartItems.map((item, index) => (
                <Table key={index}>
                  <TableItem flex>
                    <Product>
                      <Img>
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          style={{height: '80px', width: '80px', objectFit: 'cover', borderRadius: '8px'}}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop';
                          }}
                        />
                      </Img>
                      <Details>
                        <Protitle>{item.product.name}</Protitle>
                        <ProDesc>{item.product.description}</ProDesc>
                        <ProSize>Size: {item.size}</ProSize>
                      </Details>
                    </Product>
                  </TableItem>
                  <TableItem>${item.product.price}</TableItem>
                  <TableItem>
                    <Counter>
                      <div>{item.quantity}</div>
                    </Counter>
                  </TableItem>
                  <TableItem>${(item.product.price * item.quantity).toFixed(2)}</TableItem>
                  <TableItem>
                    <Button text="Remove" small onClick={() => handleRemoveFromCart(item.product._id, item.size)} />
                  </TableItem>
                </Table>
              ))
            )}
          </Left>
          <Right>
            <Title>Order Summary</Title>
            <div>
              <div>Subtotal: ${calculateTotal().toFixed(2)}</div>
              <div>Shipping: $0.00</div>
              <div><strong>Total: ${calculateTotal().toFixed(2)}</strong></div>
            </div>
            <Button 
              text={orderProcessing ? "Processing..." : "Checkout"} 
              onClick={handleCheckout}
              isDisabled={cartItems.length === 0 || orderProcessing}
            />
          </Right>
        </Wrapper>
      </Section>
    </Container>
  )
}

export default Cart