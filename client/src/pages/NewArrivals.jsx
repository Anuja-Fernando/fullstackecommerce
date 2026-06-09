import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import ProductCard from "../components/cards/ProductCard";
import { productsAPI } from '../utils/api';

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
    text-align: center;
    color: ${({theme}) => theme.text_primary};
`;

const CardWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;
    @media (max-width: 750px) {
        gap: 14px;
    }
`;

const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                console.log('Fetching new arrivals...');
                console.log('API URL:', process.env.REACT_APP_API_URL);
                const response = await productsAPI.getAll();
                console.log('New arrivals response:', response.data);
                console.log('Products count:', response.data?.length || 0);
                setProducts(response.data || []);
            } catch (error) {
                console.error('Failed to fetch new arrivals:', error);
                console.error('Error details:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNewArrivals();
    }, []);

    return (
        <Container>
            <Section>
                <Title>New Arrivals</Title>
                <CardWrapper>
                    {loading ? (
                        <div>Loading new arrivals...</div>
                    ) : products.length === 0 ? (
                        <div>No new arrivals at the moment</div>
                    ) : (
                        products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    )}
                </CardWrapper>
            </Section>
        </Container>
    );
};

export default NewArrivals;