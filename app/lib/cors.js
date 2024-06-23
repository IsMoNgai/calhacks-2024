// lib/cors.js
import Cors from 'cors';

// Initialize the CORS middleware
const corsMiddleware = Cors({
  origin: '*', // Change this to your actual domain in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

export default corsMiddleware;
