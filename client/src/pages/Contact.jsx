import React, { useState } from 'react';
import styled from 'styled-components';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

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
    max-width: 800px;
    padding: 32px 16px;
    display: flex;
    flex-direction: column;
    gap: 28px;
`;

const Title = styled.div`
    font-size: 32px;
    font-weight: 600;
    text-align: center;
    color: ${({theme}) => theme.text_primary};
`;

const Subtitle = styled.div`
    font-size: 16px;
    text-align: center;
    color: ${({theme}) => theme.text_secondary};
    margin-bottom: 20px;
`;

const Form = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ContactInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px;
    background: ${({theme}) => theme.card_light};
    border-radius: 12px;
    border: 1px solid ${({theme}) => theme.text_secondary + 20};
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const InfoLabel = styled.div`
    font-weight: 600;
    color: ${({theme}) => theme.text_primary};
    min-width: 80px;
`;

const InfoValue = styled.div`
    color: ${({theme}) => theme.text_secondary};
`;

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        }, 1000);
    };

    if (submitted) {
        return (
            <Container>
                <Section>
                    <Title>Thank You!</Title>
                    <div style={{textAlign: 'center', padding: '40px'}}>
                        <div style={{fontSize: '18px', marginBottom: '16px'}}>
                            Your message has been sent successfully.
                        </div>
                        <div style={{color: 'var(--text-secondary)'}}>
                            We'll get back to you within 24 hours.
                        </div>
                        <Button 
                            text="Send Another Message" 
                            onClick={() => setSubmitted(false)}
                            style={{marginTop: '24px'}}
                        />
                    </div>
                </Section>
            </Container>
        );
    }

    return (
        <Container>
            <Section>
                <Title>Contact Us</Title>
                <Subtitle>We'd love to hear from you. Send us a message!</Subtitle>
                
                <Form onSubmit={handleSubmit}>
                    <TextInput
                        label="Your Name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />
                    <TextInput
                        label="Email Address"
                        placeholder="Enter your email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                    />
                    <TextInput
                        label="Subject"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                    />
                    <TextInput
                        label="Message"
                        placeholder="Tell us more..."
                        value={formData.message}
                        onChange={(e) => handleChange('message', e.target.value)}
                        multiline
                        rows={4}
                    />
                    <Button 
                        text={loading ? "Sending..." : "Send Message"} 
                        onClick={handleSubmit}
                        isDisabled={loading}
                    />
                </Form>

                <ContactInfo>
                    <Title style={{fontSize: '20px', textAlign: 'left'}}>Other Ways to Reach Us</Title>
                    <InfoItem>
                        <InfoLabel>Email:</InfoLabel>
                        <InfoValue>support@kriststore.com</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>Phone:</InfoLabel>
                        <InfoValue>+1 (555) 123-4567</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>Address:</InfoLabel>
                        <InfoValue>123 Fashion Street, NY 10001</InfoValue>
                    </InfoItem>
                    <InfoItem>
                        <InfoLabel>Hours:</InfoLabel>
                        <InfoValue>Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</InfoValue>
                    </InfoItem>
                </ContactInfo>
            </Section>
        </Container>
    );
};

export default Contact;
