const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const veiculoRoutes = require('./routes/veiculos');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/veiculos', veiculoRoutes);

app.listen(process.env.PORT, () => console.log(`Server em ${process.env.PORT}`));
