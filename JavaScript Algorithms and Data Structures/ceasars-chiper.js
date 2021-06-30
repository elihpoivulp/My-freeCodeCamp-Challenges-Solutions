function rot13(str) {
    const alpha = Array.from({length: 26}, (_, i) => String.fromCharCode(i + 65)).join('');
    return str.split('').map(c => {
      if (/[A-Z]/.test(c)) {
        const alphaIndex = alpha.indexOf(c);
        let idx = alphaIndex + 13
        if (alphaIndex + 13 >= 26) {
          idx = alphaIndex - 13;
        }
        return alpha[idx];
      }
      return c;
    }).join('');
  }
  
  rot13("SERR PBQR PNZC");
  // NOPQRSTUVWXYZABCDEFGHIJKLM
  // ABCDEFGHIJKLMNOPQRSTUVWXYZ