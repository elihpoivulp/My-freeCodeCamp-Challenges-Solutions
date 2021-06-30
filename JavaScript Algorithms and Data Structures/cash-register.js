function checkCashRegister(price, cash, cid) {
    const DENOMINATION_VALUES = [
        ['ONE HUNDRED', 100],
        ['TWENTY', 20,],
        ['TEN', 10,],
        ['FIVE', 5,],
        ['ONE', 1,],
        ['QUARTER', 0.25,],
        ['DIME', 0.10,],
        ['NICKEL', 0.05,],
        ['PENNY', 0.01,],
    ];

    const sum = a => a.reduce((acc, current) => +(acc + current).toFixed(2));
    const cid_sum = sum(cid.map(row => row[1]));
    let change = cash - price;
    let status = 'INSUFFICIENT_FUNDS';
    let breakdown = [];
    if (change > cid_sum || (change < 1 && change > sum(cid.filter((_, i) => i < 4).map(r => r[1])))) return {
        status: status,
        change: []
    };

    cid = cid.slice(4).reverse().concat(cid.slice(0, 4).reverse());

    DENOMINATION_VALUES.reduce((acc, row, i) => {
        const val = row[1];
        const denom = row[0];
        const available = cid[i][1];
        let result = Math.floor(acc / val) * val;
        if (result > available) result -= (result - available);
        if (result > 0 || cid[i][1] === 0) breakdown.push([denom, result]);
        return +(acc - result).toFixed(2);
    }, change);
    status = sum(breakdown.map(row => row[1])) === cid_sum ? 'CLOSED' : 'OPEN';
    return {
        status: status,
        change: breakdown.sort((x, y) => y[1] - x[1] || breakdown.indexOf(y) - breakdown.indexOf(x))
    };
}
checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]])
// should return {status: "OPEN", change: [["QUARTER", 0.5]]}