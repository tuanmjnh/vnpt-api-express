String.prototype.trimChars = function (char) {
  const regx = new RegExp(char + '$', 'g');
  return this.replace(regx, '');
};
