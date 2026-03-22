import express from 'express';
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

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/startups', startupsRoutes);
app.use('/api/v1/mentor-requests', mentorRequestsRoutes);
app.use('/api/v1/applications', applicationsRoutes);
app.use('/api/v1/sessions', sessionsRoutes);
app.use('/api/v1/incubators', incubatorsRoutes);
app.use('/api/v1/cohorts', cohortsRoutes);
app.use('/api/v1/messages', messagesRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
