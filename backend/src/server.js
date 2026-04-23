import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { authenticateFirebaseToken } from './middlewares/auth.middleware.js';
import usersRoutes from './routes/users.routes.js';
import startupsRoutes from './routes/startups.routes.js';
import mentorRequestsRoutes from './routes/mentorRequests.routes.js';
import applicationsRoutes from './routes/applications.routes.js';
import sessionsRoutes from './routes/sessions.routes.js';
import incubatorsRoutes from './routes/incubators.routes.js';
import cohortsRoutes from './routes/cohorts.routes.js';
import messagesRoutes from './routes/messages.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/startups', authenticateFirebaseToken, startupsRoutes);
app.use('/api/v1/mentor-requests', authenticateFirebaseToken, mentorRequestsRoutes);
app.use('/api/v1/applications', authenticateFirebaseToken, applicationsRoutes);
app.use('/api/v1/sessions', authenticateFirebaseToken, sessionsRoutes);
app.use('/api/v1/incubators', incubatorsRoutes);
app.use('/api/v1/cohorts', cohortsRoutes);
app.use('/api/v1/messages', authenticateFirebaseToken, messagesRoutes);

const startServer = async () => {
  const isDbConnected = await connectDB();

  if (!isDbConnected) {
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
};

startServer();
