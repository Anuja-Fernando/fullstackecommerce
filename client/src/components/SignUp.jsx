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
    color: ${({theme}) => theme.text_secondary+90};
`;


const SignUp = ({ setOpenAuth, setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    
    console.log('Attempting registration with:', { name, email, password });
    console.log('API URL:', process.env.REACT_APP_API_URL);
    
    try {
      const response = await authAPI.register({ name, email, password });
      console.log('Registration response:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      setOpenAuth(false);
      
      console.log('Registration successful, user set:', response.data.user);
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return <Container>
    <div>
        <Title>Create New Account</Title>
        <Span>Please enter details to create a new account</Span>
    </div>
    <div style={{display:"flex",gap: "20px", flexDirection:"column"}}>
    <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
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
          text={loading ? "Creating Account..." : "Sign Up"}
          onClick={handleRegister}
          isDisabled={loading}
        />
    </div>

  </Container>
}

export default SignUp