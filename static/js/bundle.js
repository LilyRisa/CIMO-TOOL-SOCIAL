




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

  module.exports = {renderHtml}
