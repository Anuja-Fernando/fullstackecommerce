import React, { useState, useEffect } from 'react'
import ProductCard from "../components/cards/ProductCard";
import styled from "styled-components";
import {filter} from "../utils/data"
import Slider from '@mui/material/Slider';
import { productsAPI } from '../utils/api';

const Container = styled.div`
    padding: 20px 30px;
    padding-bottom:200px;
    height: 100vh;
    overflow-y:hidden;
    display: flex;
    align-items:center;
    flex-direction:column;
    gap: 30px;
    @media (max-width:768){
        padding: 20px 12px;
        flex-direction: column;
        overflow-y : scroll;
    }
        background: ${({theme}) => theme.bg};
`;
const Filters = styled.div`
  width: 100%;
  height: fit-content;
  overflow-y: hidden;
  padding: 20px 16px;
  @media (max-width: 768px){
   width: 100%;
  height: 100%;
   overflow-y: scroll;
  }
`;
const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
`;
const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
`;

const  Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const Products = styled.div`
  padding: 12px;
  overflow-y: hidden;
  @media (min-width: 768px){
   width: 100%;
   overflow-y: scroll;
   height: 100%;
  }

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
const Item = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
const SelectableItem = styled.div`
  cursor: pointer;
  display: flex;
  border: 1px solid ${({theme}) => theme.text_secondary+90};
  color: ${({theme}) => theme.text_secondary+90};
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 16px;
  width: fit-content;
  ${({selected,theme}) =>
    selected &&
    `
    border: 1px solid ${theme.text_primary};
    color: ${theme.text_primary};
    background: ${theme.text_primary+30};
    font-weight: 500;
    `
  }
`;



const ShopListing = () => {
  const[priceRange,setPriceRange] = useState([0,1000]);
  const[selectedSizes,setSelectedSizes] = useState(["S","M","L","XL"]);
  const[selectedCategories,setSelectedCategories] = useState([]);
  const[products, setProducts] = useState([]);
  const[loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sizes: selectedSizes.join(','),
          category: selectedCategories.join(',')
        };
        
        // Remove empty params
        Object.keys(params).forEach(key => {
          if (!params[key] || (Array.isArray(params[key]) && params[key].length === 0)) {
            delete params[key];
          }
        });

        const response = await productsAPI.getAll(params);
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [priceRange, selectedSizes, selectedCategories]);

  return (
    <Container>
      <Filters>
        <Menu>
          {filter.map((filters) => (
            <FilterSection key={filters.value}>
              <Title>{filters.name}</Title>
              {filters.value === "price"?(
                <>
                  <Slider
                    aria-label = "Price"
                    value={priceRange}
                    min={0}
                    max={1000}
                    valueLabelDisplay="auto"
                    marks={[
                      {value:0,label:"$0"},
                      {value:1000,label: "$1000"},
                    ]}
                    onChange={(e,newValue) => setPriceRange(newValue)}
                  />
                </>
              ) : filters.value === "size"?(
                <Item>
                  {filters.items.map((item) => (
                    <SelectableItem 
                    key={item}
                    selected={selectedSizes.includes(item)}
                    onClick={() => 
                      setSelectedSizes((prevSizes) => 
                        prevSizes.includes(item)
                         ? prevSizes.filter(
                          (category) => category !== item
                        ) : [...prevSizes,item]
                      )
                    }

                    >{item}</SelectableItem>
                  ))}
                </Item>
              ) :filters.value === "category" ? (
                <Item>
                  {filters.items.map((item) => (
                    <SelectableItem 
                    key={item}
                    selected={selectedCategories.includes(item)}
                    onClick={() => setSelectedCategories((prevCategories) => prevCategories.includes(item) ? prevCategories.filter((category) => category !== item) : [...prevCategories,item])}
                    >{item}</SelectableItem>
                  ))}
                </Item>
              ): null}
            </FilterSection>
          ))}
        </Menu>
      </Filters>
      <Products>
        <CardWrapper>
          {loading ? (
            <div>Loading products...</div>
          ) : (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </CardWrapper>
      </Products>
    </Container>
  )
}

export default ShopListing