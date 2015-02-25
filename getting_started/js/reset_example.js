$(onReady);

function onReady()
{
	var arr = [1, 2, 3, 4, 5, 6];
	
	//add tap listener to "reset" button
	$("#resetButton").hammer().on("tap", resetAll);
	
	function resetAll(e)
	{
		//static function PinchZoomer.removeAll removes all PinchZoomer instances
		PinchZoomer.removeAll();
		//remove anything that is inside each image holder
		$(".imageHolder").empty(); 	
		
		//shuffle array
		arr = Utils.shuffleArray(arr);
		
		for(var i = 0; i < 6; i++)
		{
			$("#imageHolder" + (i + 1)).append("<img src='assets/" + arr[i] + ".jpg'/>");
		}
		
		$(".imageHolder img").pinchzoomer();
		
	}
}