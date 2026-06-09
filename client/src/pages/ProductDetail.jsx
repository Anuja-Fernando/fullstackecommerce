import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { productsAPI, cartAPI, favoritesAPI } from '../utils/api';
import Button from '../components/Button';
import { AddShoppingCartOutlined, FavoriteBorder } from '@mui/icons-material';

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
    max-width: 1200px;
    padding: 32px 16px;
    display: flex;
    gap: 40px;
    @media (max-width: 768) {
        flex-direction: column;
        gap: 24px;
    }
`;

const ImageSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const MainImage = styled.img`
    width: 100%;
    height: 500px;
    object-fit: cover;
    border-radius: 12px;
    @media (max-width: 768) {
        height: 300px;
    }
`;

const DetailsSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ProductName = styled.h1`
    font-size: 32px;
    font-weight: 600;
    color: ${({theme}) => theme.text_primary};
    margin: 0;
`;

const ProductPrice = styled.div`
    font-size: 28px;
    font-weight: 500;
    color: ${({theme}) => theme.primary};
`;

const ProductDescription = styled.div`
    font-size: 16px;
    line-height: 1.6;
    color: ${({theme}) => theme.text_secondary};
`;

const SizeSelector = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const SizeLabel = styled.div`
    font-weight: 500;
    color: ${({theme}) => theme.text_primary};
`;

const SizeOptions = styled.div`
    display: flex;
    gap: 12px;
`;

const SizeOption = styled.button`
    padding: 8px 16px;
    border: 2px solid ${({theme}) => theme.text_secondary + 40};
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
        border-color: ${({theme}) => theme.primary};
    }
    ${({selected, theme}) => selected && `
        border-color: ${theme.primary};
        background: ${theme.primary + 20};
        color: ${theme.primary};
    `}
`;

const QuantitySelector = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const QuantityLabel = styled.div`
    font-weight: 500;
    color: ${({theme}) => theme.text_primary};
`;

const QuantityControls = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1px solid ${({theme}) => theme.text_secondary + 40};
    border-radius: 8px;
    padding: 4px 12px;
`;

const QuantityButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    font-size: 18px;
    color: ${({theme}) => theme.text_primary};
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const QuantityValue = styled.div`
    min-width: 20px;
    text-align: center;
    font-weight: 500;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 16px;
    @media (max-width: 768) {
        flex-direction: column;
    }
`;

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [cartLoading, setCartLoading] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await productsAPI.getById(id);
                setProduct(response.data);
                if (response.data.sizes && response.data.sizes.length > 0) {
                    setSelectedSize(response.data.sizes[0]);
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }

        setCartLoading(true);
        try {
            await cartAPI.add({
                productId: product._id,
                quantity,
                size: selectedSize
            });
            alert('Product added to cart!');
        } catch (error) {
            alert('Failed to add to cart');
        } finally {
            setCartLoading(false);
        }
    };

    const handleAddToFavorites = async () => {
        setFavoriteLoading(true);
        try {
            await favoritesAPI.add(product._id);
            alert('Product added to favorites!');
        } catch (error) {
            alert('Failed to add to favorites');
        } finally {
            setFavoriteLoading(false);
        }
    };

    const updateQuantity = (change) => {
        const newQuantity = quantity + change;
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    if (loading) {
        return <Container><div>Loading product...</div></Container>;
    }

    if (!product) {
        return <Container><div>Product not found</div></Container>;
    }

    return (
        <Container>
            <Section>
                <ImageSection>
                    <MainImage 
                    src={product.image} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop';
                    }}
                />
                </ImageSection>
                <DetailsSection>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>${product.price}</ProductPrice>
                    <ProductDescription>{product.description}</ProductDescription>
                    
                    {product.sizes && product.sizes.length > 0 && (
                        <SizeSelector>
                            <SizeLabel>Select Size:</SizeLabel>
                            <SizeOptions>
                                {product.sizes.map((size) => (
                                    <SizeOption
                                        key={size}
                                        selected={selectedSize === size}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </SizeOption>
                                ))}
                            </SizeOptions>
                        </SizeSelector>
                    )}

                    <QuantitySelector>
                        <QuantityLabel>Quantity:</QuantityLabel>
                        <QuantityControls>
                            <QuantityButton onClick={() => updateQuantity(-1)}>-</QuantityButton>
                            <QuantityValue>{quantity}</QuantityValue>
                            <QuantityButton onClick={() => updateQuantity(1)}>+</QuantityButton>
                        </QuantityControls>
                    </QuantitySelector>

                    <ActionButtons>
                        <Button
                            text={cartLoading ? "Adding..." : "Add to Cart"}
                            onClick={handleAddToCart}
                            isDisabled={cartLoading}
                            startIcon={<AddShoppingCartOutlined />}
                            flex="1"
                        />
                        <Button
                            text={favoriteLoading ? "Adding..." : "Add to Favorites"}
                            onClick={handleAddToFavorites}
                            isDisabled={favoriteLoading}
                            startIcon={<FavoriteBorder />}
                            outlined
                        />
                    </ActionButtons>
                </DetailsSection>
            </Section>
        </Container>
    );
};

export default ProductDetail;
