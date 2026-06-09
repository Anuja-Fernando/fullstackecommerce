import styled,{ThemeProvider} from "styled-components";
import {lightTheme} from "./utils/Themes";
import {BrowserRouter,Route,Routes} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Authentication from "./pages/Authentication"
import { useState, useEffect } from 'react';
import ShopListing from "./pages/ShopListing";
import Favorite from './pages/Favourite'; 
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Contact from './pages/Contact';
import NewArrivals from './pages/NewArrivals';
import ProductDetail from './pages/ProductDetail';
import Search from './pages/Search';



const Container = styled.div`
  width:100%;
  height: 100vh;
  display: flexbox;
  flex-direction: ViewColumn;
  background: ${({theme}) => theme.big};
  color: ${({theme}) => theme.text_primary};
  overflow-x: Hidden;
  overflow-y: Hidden;
  transition: all 0.2 ease;

  `;


function App() {
  const[openAuth, setOpenAuth] = useState(false); 
  const[user, setUser] = useState(null);

  useEffect(() => {
    // Check for existing user session on app load
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        console.log('User session restored:', JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to restore user session:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <ThemeProvider theme={lightTheme}>
        <BrowserRouter>
          <Container>
            <Navbar setOpenAuth={setOpenAuth} user={user} setUser={setUser}/>
             <Routes>
              <Route path="/" exact element={<Home/>}/>
              <Route path="/shop" exact element={<ShopListing/>}/>
              <Route path="/new-arrivals" exact element={<NewArrivals/>}/>
              <Route path="/orders" exact element={<Orders/>}/>
              <Route path="/contact" exact element={<Contact/>}/>
              <Route path="/favorite" exact element={<Favorite/>}/>
              <Route path="/cart" exact element={<Cart/>}/>
              <Route path="/product/:id" exact element={<ProductDetail/>}/>
              <Route path="/search" exact element={<Search/>}/>

             </Routes>
             {openAuth && <Authentication openAuth={openAuth} setOpenAuth={setOpenAuth} setUser={setUser}/>}
          </Container>
        </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
