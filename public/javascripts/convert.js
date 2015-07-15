// Markdown Converter
window.onload = function () {
  var converter = new showdown.Converter();
  var pad = document.getElementById('pad');
  var markdownArea = document.getElementById('markdown');

  var convertTextAreaToMarkdown = function () {
    var markdownText = pad.value;
    html = converter.makeHtml(markdownText);
    markdownArea.innerHTML = html;
  };

  pad.addEventListener('input', convertTextAreaToMarkdown);

  sharejs.open('home', 'text', function (error, doc) {
    doc.attach_textarea(pad);
  });
};
