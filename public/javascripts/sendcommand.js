//var websocket = new WebSocket("ws://telegarden.osumaker.space");
$(document).ready(function(){
	$('#sendcommand').on('click',function(){
		$.ajax({
			url:"http://telegarden.osumaker.space/command",
			method:'POST',
			data: {
				command : $('#command').val(),
				value : $('#value').val()
			},
			success: function(res,status) {
				//websocket.send('sending websocket as well');
				$('#results').append('<div class="result">Sent Command to Server</div>');
				if(res.complete!=true)
				{
						$('#results').append('<div class="result">Command Could Not Be Executed</div>');
				}
				if(res.complete==true)
				{
						$('#results').append('<div class="result">Command Executed</div>');
				}
				$('#results').append('<br>');
			},
			error: function(res,status) {
				$('#results').append('<div class="result">Error SENDING TO SERVER</div>');
			}
		});
	});
});