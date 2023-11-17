const express = require('express');
const TransactionController = require('./Controllers/TransactionController');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.post('/split-payments/compute', TransactionController.splitPayment);

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});