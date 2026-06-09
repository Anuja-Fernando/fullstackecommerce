import React, { useState } from 'react'
import styled from "styled-components"
import TextInput from "./TextInput"
import  Button  from './Button'
import { authAPI } from '../utils/api';

const Container = styled.div`
    width:100%;
    max-width:500px;
    display: flex;
    flex-direction: column;
    gap: 36px;
`;
const Title = styled.div`
    font-size: 30px;
    font-weight: 800;
    color: ${({theme}) => theme.primary};
`;
const Span = styled.div`
    font-size: 16px;
    font-weight: 400;
    color: ${({theme}) => theme.text_secondary};
`;


const SignIn = ({ setOpenAuth, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    
    console.log('=== LOGIN DEBUG START ===');
    console.log('Attempting login with:', { email, password });
    console.log('API URL:', process.env.REACT_APP_API_URL);
    console.log('Full API URL:', `${process.env.REACT_APP_API_URL}/auth/login`);
    
    // Test basic connectivity first
    try {
      console.log('Testing basic connectivity...');
      const testResponse = await fetch('http://localhost:5000/api/products');
      console.log('Basic connectivity test status:', testResponse.status);
    } catch (testError) {
      console.error('Basic connectivity failed:', testError);
    }
    
    try {
      console.log('Making login API call...');
      const response = await authAPI.login({ email, password });
      console.log('Login response received:', response);
      console.log('Login response data:', response.data);
      
      if (response.data && response.data.token) {
        console.log('Token received, saving to localStorage...');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setOpenAuth(false);
        
        console.log('Login successful, user set:', response.data.user);
      } else {
        console.error('Invalid response format:', response.data);
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('=== LOGIN ERROR ===');
      console.error('Error object:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
      console.log('=== LOGIN DEBUG END ===');
    }
  };

  return <Container>
    <div>
        <Title>Welcome to Krist</Title>
        <Span>Please login with your details here</Span>
    </div>
    <div style={{display:"flex",gap: "20px", flexDirection:"column"}}>
        <TextInput
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
        />
        <TextInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
        />
        {error && <Span style={{ color: 'red' }}>{error}</Span>}
        <Button 
          text={loading ? "Signing In..." : "Sign In"} 
          onClick={handleLogin}
          isDisabled={loading}
        />
        <div style={{marginTop: '10px'}}>
          <button 
            onClick={() => console.log('Test button clicked!')}
            style={{padding: '10px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px'}}
          >
            Test Console Log
          </button>
        </div>
    </div>

  </Container>
}

export default SignIn