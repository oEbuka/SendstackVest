const Transaction = require('../Models/Transaction');

class SplitEntity {
    constructor(splitType, splitValue, splitEntityId) {
      this.SplitType = splitType;
      this.SplitValue = splitValue;
      this.SplitEntityId = splitEntityId;
    }
}
class TransactionController {
  static async computeSplitPayments(req, res) {
    const transactionData = req.body;
    console.log(transactionData)
    try {
      const transaction = new Transaction(
        transactionData.ID,
        transactionData.Amount,
        transactionData.Currency,
        transactionData.CustomerEmail,
        transactionData.SplitInfo.map((splitData) => {
          return new SplitEntity(splitData.SplitType, splitData.SplitValue, splitData.SplitEntityId);
        })
      );

      const splitBreakdown = await transaction.computeSplitBreakdown();
      const Balance = transaction.Amount - splitBreakdown.reduce((acc, split) => acc + split.Amount, 0);

      res.status(200).json({
        ID: transaction.ID,
        Balance: Balance,
        SplitBreakdown: splitBreakdown,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}


module.exports = TransactionController;