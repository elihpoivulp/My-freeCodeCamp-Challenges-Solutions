function palindrome(str) {
    const clean = word => word.toLowerCase().replace(/[\W_\s]/g, '');
    str = clean(str);
    return str === str.split('').reverse().join('');
  }
  
  
  
  palindrome("eye");