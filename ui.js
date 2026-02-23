
(function(){
  var chk = document.getElementById('chk-dyslexic');
  if (!chk) return;
  if (localStorage.getItem('dyslexic') === '1') { document.body.classList.add('dyslexic'); chk.checked = true; }
  chk.addEventListener('change', function(){
    document.body.classList.toggle('dyslexic', this.checked);
    localStorage.setItem('dyslexic', this.checked ? '1' : '0');
  });
})();
