$(onReady);

function onReady()
{
	$("#addImagesButton").hammer().on("tap", addImages);
	
	function addImages()
	{
		//remove button
		$("#buttonHolder").remove();
		
		for(var i = 1; i <= 6; i++)
		{
			//add image to each image holder.
			$("#imageHolder" + i).append("<img src='assets/" + i + ".jpg' />"); 	
		}
		
		//apply multi-touch zoom to images
		$(".imageHolder img").pinchzoomer();
		
		//show image holder and info box
		$(".imageHolder").css("display", "block");
		$("#infoBox").css("display", "block");
	}
}