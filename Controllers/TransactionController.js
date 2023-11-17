const Transaction = require('../Models/Transaction');

class SplitEntity {
  constructor(splitType, splitValue, splitEntityId) {
    this.SplitType = splitType;
    this.SplitValue = splitValue;
    this.SplitEntityId = splitEntityId;
  }
}

class TransactionController {
  static computeSplitPayments(req, res) {
    const transactionData = req.body;

    try {
      const splitEntities = transactionData.SplitInfo.map((splitData) => {
        return new SplitEntity(splitData.SplitType, splitData.SplitValue, splitData.SplitEntityId);
      });

      const transaction = new Transaction(
        transactionData.ID,
        transactionData.Amount,
        transactionData.Currency,
        transactionData.CustomerEmail,
        splitEntities
      );

      const splitBreakdown = transaction.computeSplitBreakdown();
      const totalSplitAmount = splitBreakdown.reduce((acc, split) => acc + split.Amount, 0);
      const balance = transactionData.Amount - totalSplitAmount;

      res.status(200).json({
        ID: transactionData.ID,
        Balance: balance,
        SplitBreakdown: splitBreakdown,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}

module.exports = TransactionController;
