function convertToRoman(num) {
    const COMBO = {
      1:    'I',
      4:    'IV',
      5:    'V',
      9:    'IX',
      10:   'X',
      40:   'XL',
      50:   'L',
      90:   'XC',
      100:  'C',
      400:  'CD',
      500:  'D',
      900:  'CM',
      1000: 'M'  
    }
    function IntToRoman(n) {
      this.num = n;
  
      this._toPlaceValue = (num) => {
        const str = num.toString();
        const len = str.length;
        const d = parseInt(str[0]);
        let val = '0';
        if (d === 4 | d === 9) {
          val = d.toString();
        } else if (d <= 3) {
          val = '1';
        } else {
          val = '5'
        }
        return parseInt(val.concat(`${'0'.repeat(len - 1)}`));
      }
  
      this.convert = () => {
        let roman = '';
        let r = this.num;
        let q = 0;
        do {
          const placeValue = this._toPlaceValue(r);
          [q, r] = [Math.floor(r / placeValue), r % placeValue];
          roman += COMBO[placeValue].repeat(q);
        } while (r !== 0);
        return roman;
      }
    }
  
    let roman = new IntToRoman(num);
    return roman.convert();
  }
  
  convertToRoman(2);