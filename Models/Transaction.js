

class Transaction {
  constructor(id, amount, currency, customerEmail, splitInfo) {
    this.ID = id;
    this.Amount = amount;
    this.Currency = currency;
    this.CustomerEmail = customerEmail;
    this.SplitInfo = splitInfo;
  }

  computeSplitBreakdown() {
    const splitBreakdown = [];
    let balance = this.Amount;
    let totalRatio = 0;

    for (const splitEntity of this.SplitInfo) {
      const splitType = splitEntity.SplitType;
      let splitAmount = 0;

      switch (splitType) {
        case 'FLAT':
          splitAmount = splitEntity.SplitValue;
          break;
        case 'PERCENTAGE':
          splitAmount = (splitEntity.SplitValue / 100) * balance;
          break;
        case 'RATIO':
          totalRatio += splitEntity.SplitValue;
          break;
        default:
          throw new Error('Invalid split type');
      }

      if (splitAmount > balance) {
        throw new Error('Split amount cannot be greater than transaction amount');
      }

      if (splitAmount < 0) {
        throw new Error('Split amount cannot be less than 0');
      }

      balance -= splitAmount;

      splitBreakdown.push({
        SplitEntityId: splitEntity.SplitEntityId,
        Amount: splitAmount,
      });
    }

    for (const splitEntity of splitBreakdown) {
      if (splitEntity.SplitType === 'RATIO') {
        const ratio = splitEntity.Amount / totalRatio;

        balance -= amount;

        splitEntity.Amount = amount;
      }
    }

    if (balance < 0) {
      throw new Error('Sum of split amounts cannot be greater than transaction amount');
    }

    return splitBreakdown;
  }
}

module.exports = Transaction;