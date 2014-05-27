var StripyTables =

{
    init:function()
   {
      var tables = Core.getElementsByClass("dataTable");

      for  (var i = 0; i < tables.length; i++)
      {
        
      var tbodys = tables[i].getElementsByTagName("tbody");


      for  (var j = 0; j < tbodys.length; j++)
      {
        var rows = tbodys[j].getElementsByTagName("tr");

        for (var k = 1; k < rows.length; k += 2)
       {
          Core.addClass(rows[k], "alt");
       }
      }
     }
    }
   };

Core.start(StripyTables);


$(document).ready(function(){
  $(':submit').click(function(e) {
    $(':text').each(function() {
      if($(this).val().length == 0) {
        $(this).css('border', '2px solid red');
      }
    });
    e.preventDefault();
  });
});


$(document).ready(function(){
  $('#signup form').validate({
    rules: {
     contactname: {
        required: true,
      },
      telephone: {
        required: true,
        telephone: true
      },
      email: {
        required: true,
        email:true
      },
      eventname: {
        
        required: true
      },
      eventdate: {
        required: true
      }
    },
    success: function(label) {
      label.text('OK!').addClass('valid');
    }
  });
});


$(function(){
   $('.slider').movingBoxes({ startPanel: 3 });
   
   // Example of how to move the panel from outside the plugin, only works on first on called.
   // $('.slider').data('movingBoxes').currentPanel(1);  // 1 = move to first panel, blank = return current panel

  });