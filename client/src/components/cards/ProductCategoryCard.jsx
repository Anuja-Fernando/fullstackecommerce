import React from 'react'
import {useNavigate} from "react-router-dom";
import styled from "styled-components";

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
`;

const Menu = styled.div`
    widthh:90%;
    position: absolute;
    z-index: 10;
    color: ${({theme}) => theme.text_primary};
    bottom:20px;
    left: 50;
    right: 50;
    display: flex;
    gap: 12px;
`;
const Button = styled.div`
    width: 100%;
    color: ${({theme}) => theme.primary};
    padding: 12px 20px;
    background: white;
    border-radius: 12px;
    text-align: center;
    font-weight: 500;
    @media (max-width: 600px){
        padding: 6px 14px;
    }
`;
const Sale = styled.div`
    position: absolute;
    z-index: 10;
    color: ${({theme}) => theme.text_primary};
    top: 10px;
    right: 10px;
    font-size: 12px;
    font-weight: 600;
    color: white;
    background: green;
    padding: 3px 6px;
    border-radius: 4px;
    @media(max-width: 600px){
        font-size:10px;
    }

`;



const ProductCategoryCard = ({category}) => {
    const navigate = useNavigate()
  return (
    <Card onClick={() => navigate(`/shop?category=${category.name}`)}>
        <Top>
            <Image 
              src={category.img} 
              alt={category.name}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop';
              }}
            />
            <Menu>
                <Button>{category.name}</Button>
            </Menu>
            <Sale>{category.off}</Sale>
        </Top>

    </Card>
  );
};

export default ProductCategoryCard