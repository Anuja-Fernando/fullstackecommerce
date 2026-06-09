import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProductCard from '../components/cards/ProductCard';
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

const SearchBar = styled.div`
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
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

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setProducts([]);
            setSearched(false);
            return;
        }

        const searchProducts = async () => {
            setLoading(true);
            try {
                const response = await productsAPI.getAll({ search: searchTerm });
                setProducts(response.data);
                setSearched(true);
            } catch (error) {
                console.error('Failed to search products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(searchProducts, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    return (
        <Container>
            <Section>
                <Title>Search Products</Title>
                <SearchBar>
                    <input
                        type="text"
                        placeholder="Search for products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            fontSize: '16px',
                            border: '1px solid var(--text-secondary)',
                            borderRadius: '8px',
                            background: 'var(--card-light)',
                            color: 'var(--text-primary)',
                            outline: 'none'
                        }}
                    />
                </SearchBar>
                <CardWrapper>
                    {loading ? (
                        <div>Searching...</div>
                    ) : !searched ? (
                        <div>Enter a search term to find products</div>
                    ) : products.length === 0 ? (
                        <div>No products found for "{searchTerm}"</div>
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

export default Search;
