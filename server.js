const express = require('express');
const TransactionController = require('./Controllers/TransactionController');


const app = express();
const PORT = 3000;

app.use(express.json())
app.post('/split-payments/compute', TransactionController.computeSplitPayments);

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});