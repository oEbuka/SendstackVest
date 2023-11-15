

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

    for (const splitEntity of this.SplitInfo) {
      let splitAmount = 0;

      switch (splitEntity.SplitType) {
        case 'FLAT':
          splitAmount = splitEntity.SplitValue;
          break;
        case 'PERCENTAGE':
          splitAmount = (splitEntity.SplitValue / 100) * balance;
          break;
        case 'RATIO':
          // Ratio computation is done at the end
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

    
    if (this.SplitInfo.some((splitEntity) => splitEntity.SplitType === 'RATIO')) {
      const totalRatio = this.SplitInfo.reduce((acc, splitEntity) => {
        if (splitEntity.SplitType === 'RATIO') {
          acc += splitEntity.SplitValue;
        }

        return acc;
      }, 0);

      const ratioSplitAmounts = splitBreakdown.filter((splitEntity) => splitEntity.SplitType === 'RATIO');

      for (const ratioSplitEntity of ratioSplitAmounts) {
        const ratio = ratioSplitEntity.SplitValue / totalRatio;
        const amount = ratio * balance;

        balance -= amount;

        ratioSplitEntity.Amount = amount;
      }
    }

    if (balance < 0) {
      throw new Error('Sum of split amounts cannot be greater than transaction amount');
    }

    return splitBreakdown;
  }
}

module.exports = Transaction;