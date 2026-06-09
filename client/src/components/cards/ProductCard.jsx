import React, { useState } from 'react'
import styled from 'styled-components';
import {CircularProgress,Rating} from "@mui/material"
import { useNavigate } from 'react-router-dom';
import FavoriteRounded from "@mui/icons-material/FavoriteRounded";
import AddShoppingCartOutlined from "@mui/icons-material/AddShoppingCartOutlined";
import { cartAPI, favoritesAPI } from '../../utils/api';

const Card = styled.div`
    width:250px;
    display: flex;
    flex-direction: column;
    gap:16px;
    transition: all 0.3 ease-out;
    cursor: pointer;
    @media (max-width: 750px){
        width:180px;
    }
`;
const Image = styled.img`
    width: 100%;
    height:320px;
    border-radius:6px;
    object-fit:cover;
    transition: all 0.3 ease-out;
    @media(max-width: 600px){
        height: 240px;
    }
`;

const MenuItem = styled.div`
    border-radius: 50%;
    width: 18px;
    height: 18px;
    background: white;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
`;

const Menu = styled.div`
    position: absolute;
    z-index: 10;
    color: ${({theme}) => theme.text_primary};
    bottom:20px;
    left: 50;
    right: 50;
    display: none;
    gap: 12px;
`;
const Top = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 6px;
    transition: all 0.3 ease-out;
    &:hover{
        background-color: ${({theme}) => theme.primary};
    }
    &:hover ${Image}{
        opacity: 0.8;
    }
    &:hover${Menu}{
        display:flex
    }
`;
const Rate = styled.div`
    position:absolute;
    z-index: 10;
    color: ${({theme}) => theme.text_primary};
    bottom:8px;
    left:8px;
    padding: 4px 8px;
    border-radius::4px;
    background: white;
    display:flex;
    align-items:center;
    opacity:0.9;
`;
const Details = styled.div`
    display:flex;
    gap: 6px;
    flex-direction: column;
    padding: 4px 10px;

`;
const Title = styled.div`
    font-size: 16px;
    font-weight: 700;
    color: ${({theme}) => theme.text_primary};

`;
const Desc = styled.div`
    font-size: 16px;
    font-weight: 400;
    color: ${({theme}) => theme.text_primary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const Price = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 500;
    color: ${({theme}) => theme.text_primary};
`;


const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await cartAPI.add({ 
        productId: product._id, 
        quantity: 1, 
        size: product.sizes[0] 
      });
      alert('Product added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async (e) => {
    e.stopPropagation();
    try {
      await favoritesAPI.add(product._id);
      alert('Product added to favorites!');
    } catch (error) {
      alert('Failed to add to favorites');
    }
  };

  return (
    <Card onClick={() => navigate(`/product/${product._id}`)}>
        <Top>
            <Image 
              src={product.image} 
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop';
              }}
            />
            <Menu>
                <MenuItem onClick={handleAddToFavorites}>
                    <FavoriteRounded sx={{fontSize:"20px", color:"red"}}/>            
                </MenuItem>{" "}
                <MenuItem onClick={handleAddToCart}>
                    {loading ? (
                        <CircularProgress size={20} />
                    ) : (
                        <AddShoppingCartOutlined
                        sx={{color: "inherit", fontSize:"20px"}}
                        />
                    )}
                </MenuItem>
            </Menu>
                <Rate>
                    <Rating value={4} sx={{fontSize: "14px"}}/>
                </Rate>
        </Top>
        <Details>
            <Title>{product.name}</Title>
            <Desc>{product.description}</Desc> 
            <Price>${product.price}</Price>        
        </Details>
    </Card>
  )
}

export default ProductCard