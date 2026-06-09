import React, { useState, useEffect } from 'react'
import styled from "styled-components"
import ProductCard from '../components/cards/ProductCard';
import { favoritesAPI } from '../utils/api';

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
const CardWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap:24px;
    justify-content: center;
    @media(max-width: 750px){
        gap: 14px;
    }
`;


const Favourite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, user not logged in');
          setLoading(false);
          return;
        }
        const response = await favoritesAPI.get();
        setFavorites(response.data);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
        if (error.response?.status === 401) {
          console.log('User not authenticated for favorites');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <Container>
      <Section>
        <Title>Your favorites</Title>
        <CardWrapper>
          {loading ? (
            <div>Loading favorites...</div>
          ) : !localStorage.getItem('token') ? (
            <div style={{textAlign: 'center', padding: '40px'}}>
              <div style={{fontSize: '18px', marginBottom: '16px'}}>
                Please sign in to view your favorites
              </div>
              <div style={{color: 'var(--text-secondary)'}}>
                You need to be logged in to see your favorite products
              </div>
            </div>
          ) : favorites.length === 0 ? (
            <div>You have no favorite products yet</div>
          ) : (
            favorites.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </CardWrapper>
      </Section>
    </Container>
  )
}

export default Favourite