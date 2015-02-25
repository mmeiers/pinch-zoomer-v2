$(onReady);

function onReady()
{
	var removeCtr = 0;
	//add tap listener to "remove all" button
	$("#removeAllButton").hammer().on("tap", removeAll);
	
	for(var i = 1; i <= 6; i++)
	{
		//add tap listener to each "remove image" button
		$("#removeImage" + i).hammer().on("tap", { imgNum:i }, removeImage);
	}
	
	function removeImage(e)
	{
		var i = e.data.imgNum;
		//static function PinchZoomer.remove using id of the image to remove one image
		PinchZoomer.remove("img" + i);
		$("#imageHolder" + i).remove(); 	
		
		//check if all images are removed
		removeCtr ++;
		if(removeCtr == 6)
		{
			//if all images are removed, remove also the remove all button
			$("#buttonHolder").remove();
		}
	}
	
	function removeAll(e)
	{
		//static function PinchZoomer.removeAll removes all PinchZoomer instances
		PinchZoomer.removeAll();
		$(".imageHolder").remove(); 	
		$("#buttonHolder").remove();
	}
}