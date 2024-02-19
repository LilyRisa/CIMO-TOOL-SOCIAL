




  function renderHtml(element, file, func = null){
    $.ajax({
        url: './components/'+ file,
        dataType: 'html',
      }).done(resp => {
        $(element).html(resp);
        if(func != null){
          func();
        }
        
      });
  }

  function loadScriptFile(path){
    jQuery.loadScript = function (path, callback) {
      jQuery.ajax({
          url: url,
          dataType: 'script',
          success: callback,
          async: true
      });
  }
  }

  module.exports = {renderHtml, loadScriptFile}
