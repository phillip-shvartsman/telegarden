
$(document).ready(function(){
	$('.garden-cell').on('click',function(){
		id = $(this).attr('id');
		current = $(this);
		$('.garden-cell-selected').toggleClass('garden-cell-selected');
		$('#request').fadeOut('slow',function(){
			$.ajax({
				url:"http://telegarden.osumaker.space/get-status",
				method:'POST',
				data: {
					id : id,
				},
				success: function(res,status) {
					$('#request').empty();
					if(res.data.rows[0].planted==false)
					{	
				
						//cell_info = "<h5>Garden Cell "+res.data.rows[0].id+"</h5>";
						plant_icon = "<span id='plant'><img src='/images/plant.png' id='plant-icon'><h2 id = 'plant-req-text'>Plant</h2></div>";
						plant_status = "<h2 id='no-plant-text'>Nothing Planted Here</h2>";
						//$('#request').append(cell_info);
						current.toggleClass('garden-cell-selected');
						$('#current').text(id);
						$('#request').append(plant_status)
						$('#request').append(plant_icon);
						$('#request').fadeIn('slow');
					}
					
				},
				error: function(res,status) {
					$('#request').empty();
					$('#request').append("<h5>Unable to Get Info From the Server</h5>");
				}
			});
		});
	});
});