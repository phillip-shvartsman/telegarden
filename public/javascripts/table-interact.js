$(document).ready(function(){
	$('.garden-cell').on('click',function(){
		$('#'+('#current').text).toggleClass('garden-cell-selected');
		id = $(this).attr('id');
		current = $(this);
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
			
					cell_info = "<h5>Garden Cell "+res.data.rows[0].id+"</h5>";
					plant_icon = "<img src='/images/plant.png' style='width:10px height:10px'>";
					plant_status = "<h5>Nothing Planted Here</h5>";
					$('#request').append(cell_info);
					current.toggleClass('garden-cell-selected');
					$('#current').text(id);
					$('#request').append(plant_status)
					$('#request').append(plant_icon);
				}
				
			},
			error: function(res,status) {
				$('#request').empty();
				$('#request').append("<h5>Unable to Get Info From the Server</h5>");
			}
		});
		
	});
});