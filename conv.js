(() => {
  const text = document.selection ? document.selection.createRange().text : document.getSelection().toString();
  prompt('変換結果:', convert(text));
  
  function convert(text) {
    //tail: true -> 単語の最終文字のみ変換
    const rules = [
      { from: 'フォ', to: 'ヒョ', tail: false },
      { from: 'ラ',   to: 'ヤ',  tail: false },
      { from: 'ル',   to: 'ユ',  tail: false },
      { from: 'ト',   to: 'ヨ',  tail: false },
      { from: 'ド',   to: 'ヨ',  tail: false },
      { from: 'ロ',   to: 'ヨ',  tail: false },
    ];
    
    function isKatakana(text) {
      return text.match(/^[ァ-ヶー]+$/) ? true : false;
    }
    
    //単語の最終文字ならtrue(長音は無視)
    function isLastInWord(text, i) {
      const len = text.length;
      if(i >= len) throw new Error("Illegal index");
      
      return (
        i === len - 1 ||
        i === len - 2 && text[len - 1] === 'ー' ||
        !isKatakana(text[i + 1]) ||
        text[i + 1] === 'ー' && !isKatakana(text[i + 2])
      )  
    }
    
    const froms = rules.map(r => r.from).join('|');
    const map = new Map(rules.map(r => [r.from, r]));
    
    return text.replace(new RegExp('(' + froms + ')', 'g'), (match, contents, offset) => {
      const rule = map.get(match);
      const endOffset = offset + match.length;
      if(rule.tail && !isLastInWord(text, endOffset - 1)) {
        return match;
      }
      return rule.to;
    });
  }
})();