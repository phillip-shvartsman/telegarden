$(document).ready(function(){
	//CLICK GARDEN CELL
	$('.garden-cell').on('click',function(){
		id = $(this).attr('id');
		current = $(this);
		infotab = $('#info-tab');
		$('.garden-cell-selected').toggleClass('garden-cell-selected');
		$('.selected').toggleClass('selected');
		$('#info').fadeOut('slow',function(){
			$.ajax({
				url:"http://telegarden.osumaker.space/get-status",
				method:'POST',
				data: {
					id : id,
				},
				success: function(res,status) {
					$('#info').show();
					$('#plantat').hide();
					$('#info-name').empty();
					current.toggleClass('garden-cell-selected');
					infotab.toggleClass('selected');
					if(res.data.rows[0].planted==false){
						$('#has-plant').hide();	
						$('#no-plant').show();
						$('#info').fadeIn('slow');
					}else{
						name = '<h2>'+res.data.rows[0].plant_type+'</h2>';
						$('#no-plant').hide();
						$('#has-plant').show();
						$('#info-name').append(name);
						$('#info').fadeIn('slow');
					}
				},
				error: function(res,status) {
					$('#info').empty();
					$('#info').append("<h5>Unable to Get Info From the Server</h5>");
				}
			});
		});
	});
	//CLICK INFORMATION TAB
	$('#info-tab').on('click',function(){
		//id = $(this).attr('id');
		id = $(".garden-cell-selected").attr('id');
		current = $(this);
		$('.selected').toggleClass('selected');
		$('#info').fadeOut('slow',function(){
			$.ajax({
				url:"http://telegarden.osumaker.space/get-status",
				method:'POST',
				data: {
				 	id : id,
				},
				success: function(res,status) {
					$('#info').show();
					$('#plantat').hide();
					$('#info-name').empty();
					current.toggleClass('selected');
					if(res.data.rows[0].planted==false){
						$('#has-plant').hide();	
						$('#no-plant').show();
						$('#info').fadeIn('slow');
					}else{
						name = '<h2>'+res.data.rows[0].plant_type+'</h2>';
						$('#no-plant').hide();
						$('#has-plant').show();
						$('#info-name').append(name);
						$('#info').fadeIn('slow');
					}
				},
			});
		});
	});
	//CLICK PLANTATION TAB
	$('#plant-tab').on('click',function(){
		id = $(".garden-cell-selected").attr('id');
		current = $(this);
		$('.selected').toggleClass('selected');
		$('#plantat').fadeOut('slow',function(){
			$.ajax({
				url:"/get-status",
				method:'POST',
				data: {
					id : id,
				},
				success: function(res,status) {
					$('#info').hide();
					$('#plantat').show();
					$('#plant-feedback').empty();
					current.toggleClass('selected');
					if(res.data.rows[0].planted==false){	
						//$('#plantat').append(id);
						$("#plant-choose").attr('disabled',false);
						$('#plantat').fadeIn('slow');
					}else{
						$("#plant-choose").attr('disabled',true);
						//$('#plantat').append(id);
						$('#plantat').fadeIn('slow');
					}
				},
			});
		});
	});
	//CLICK PLANT BUTTON
	$('#plant-button').on('click',function(){
		id = $(".garden-cell-selected").attr('id');
		planted = true;
		name = $("#plant-choose option:selected").text();
		name = "'"+name+"'";
		$('#plant-feedback').empty();
		current = $(this);
		$.ajax({
			url:"/get-status",
			method:'POST',
			data:{
				id : id,
			},
			success: function(res,status){
				if(res.data.rows[0].planted==false){
					$.ajax({
						url:"/update-status",
						method:'POST',
						data: {
							id : id, 
							command : 'plant',
							plant_type : name,
							planted : planted,
						},
						success: function(res,status) {
							$.ajax({
								url:"/get-status",
								method:'POST',
								data:{
									id : id,
								},
								success: function(res,status) {
									if(res.data.rows[0].planted==true){	
										$('#plant-feedback').append('Plant succeed!');
										$("#plant-choose").attr('disabled',true);
									}else{
										$('#plant-feedback').append('Plant failed!');
									}
								},
							});	
						},
					});
				}else{
					$('#plant-feedback').append('Plant existed!');
				}
			}
		});
	});
	//CLICK DESTROY BUTTON
	$('#destroy-button').on('click',function(){
		id = $(".garden-cell-selected").attr('id');
		planted = false;
		name = null;
		$('#plant-feedback').empty();
		current = $(this);
		$.ajax({
			url:"/get-status",
			method:'POST',
			data:{
				id : id,
			},
			success: function(res,status){
				if(res.data.rows[0].planted==true){
					$.ajax({
						url:"/update-status",
						method:'POST',
						data: {
							id : id, 
							command : 'plant',
							plant_type : name,
							planted : planted,
						},
						success: function(res,status) {
							$.ajax({
								url:"/get-status",
								method:'POST',
								data:{
									id : id,
								},
								success: function(res,status) {
									if(res.data.rows[0].planted==false){	
										$('#plant-feedback').append('Destroy succeed!');
										$("#plant-choose").attr('disabled',false);
									}else{
										$('#plant-feedback').append('Destroy failed!');
									}
								}
							});	
						}
					});
				}else{
					$('#plant-feedback').append('No plant existed for destroy!');
				}
			}
		});
	});
});