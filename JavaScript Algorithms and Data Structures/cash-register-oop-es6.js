function checkCashRegister(price, cash, cid) {
    class CashRegister {
        #change;
        #breakdown;
        #hasEnoughFund;
        #status;
        #statuses = {
            'in': 'INSUFFICIENT_FUNDS',
            'op': 'OPEN',
            'cl': 'CLOSED'
        }

        constructor(price, cash, cid) {
            this.price = price;
            this.cash = cash;
            this.cid = cid;
            this.sumOfFunds = CashRegister.sum(this.cid.map(row => row[1]));
            this.#change = this.cash - this.price;
            this.#breakdown = [];
            this.#status = this.#statuses.in
            this.#hasEnoughFund = () => {
                const change = this.#change;
                const sumOfCents = CashRegister.sum(this.cid.filter((_, i) => i < 4).map(row => row[1]));
                return !(change > this.sumOfFunds || (change < 1 && change > sumOfCents));
            };
        }

        get result() {
            let result = this.#breakdown;
            if (Boolean(result)) {
                result = this.generateBreakdown();
            }
            return result;
        }

        // get change() {
        //     return this.#change;
        // }
        //
        // get breakdown() {
        //     return this.result.change;
        // }
        //
        // get status() {
        //     return this.#status;
        // }

        generateBreakdown() {
            let breakdown = this.#breakdown;
            let status = this.#status;
            let report = {status: status, change: breakdown};
            if (!this.#hasEnoughFund()) return report;
            /*
            * Alter the order of CID into descending order based on denomination value.
            * The loop will be implemented on the #DENOMINATIONS therefore it will be
            * easier to access (the index of) funds in CID if they have same sequence.
            * Sorting can be done through the `sort` function; since the CID has specific
            * initial ordering, I can just use slice to reorder the rows.
            * */
            const cid = this.cid.slice(4).reverse().concat(this.cid.slice(0, 4).reverse());
            CashRegister.denominations.reduce((accumulated, row, index) => {
                const denomination = row[0];
                const currency = row[1];  // the currency or denomination value. I.E. DIME would be 0.10
                const availableFund = cid[index][1];  // the available amount in CID for that specific currency. I.E. DIME has 1.20
                let result = CashRegister.decompose(accumulated, currency);

                // if the `result` is greater than the available fund, get the difference of `availableFund` and the `result` and subtract the difference to the `result`.
                if (result > availableFund) result -= (result - availableFund);

                // if the `result` > 0, or if the available is zero by default, append it to the return object.
                if (result > 0 || availableFund === 0) breakdown.push([denomination, result]);

                // subtract the `result` from the `accumulated` previous result.
                // needs to have at least two decimal values so that it returns accurate result.
                return CashRegister.fix(accumulated - result, 2);
            }, this.#change);

            status = CashRegister.sum(breakdown.map(r => r[1])) === this.sumOfFunds ? this.#statuses.cl : this.#statuses.op;

            // sort result highest to lowest based on amount, and if the amount is 0, sort the list according to the row key/index.
            breakdown = breakdown.sort((x, y) => y[1] - x[1] || breakdown.indexOf(y) - breakdown.indexOf(x));

            this.#status = status;
            this.#breakdown = breakdown;
            report = {
                status: status,
                change: breakdown
            }
            return report;
        }

        static #DENOMINATIONS = [
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

        static decompose(value, currency) {
            // e.g Math.floor(90.45 / 20) * 20, where 20 is the value for TWENTY.
            return Math.floor(value / currency) * currency;
        }

        static get denominations() {
            return CashRegister.#DENOMINATIONS;
        }

        static sum = (a) => a.reduce((a, b) => CashRegister.fix(a + b, 2));

        static fix = (num, fraction) => +(num).toFixed(fraction);
    }

    let cr = new CashRegister(price, cash, cid);
    return cr.result;
}


checkCashRegister(19.5, 20, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]])
// should return {status: "OPEN", change: [["QUARTER", 0.5]]}.


checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]])
// should return {status: "OPEN", change: [["TWENTY", 60], ["TEN", 20], ["FIVE", 15], ["ONE", 1], ["QUARTER", 0.5], ["DIME", 0.2], ["PENNY", 0.04]]}.


checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]])
// should return {status: "INSUFFICIENT_FUNDS", change: []}.


checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]])
// should return {status: "INSUFFICIENT_FUNDS", change: []}.


let x = checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]])
// should return {status: "CLOSED", change: [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]}.

console.log(x)
