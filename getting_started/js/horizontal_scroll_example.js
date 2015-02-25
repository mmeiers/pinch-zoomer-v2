$(function() 
{
	$( "#slider" ).slider();
	$( "#slider" ).on("slide", onSliderChange);
	
	function onSliderChange(e, ui)
	{
		var maxScrollWidth = $("#scrollHolder")[0].scrollWidth - $("#scrollHolder")[0].clientWidth;
		$("#scrollHolder").scrollLeft((ui.value / 100) * maxScrollWidth);
	}
	
	prettyPrint();
});