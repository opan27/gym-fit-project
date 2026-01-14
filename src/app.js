require('dotenv').config();
const cors = require('cors');
const express = require('express');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/missions', require('./routes/mission.routes'));
app.use('/api/user-missions', require('./routes/userMission.routes'));
app.use('/api/me', require('./routes/me.routes'));
app.use('/api/user-sessions', require('./routes/userSession.routes'));
app.use('/api/me', require('./routes/me.routes'));




module.exports = app;
