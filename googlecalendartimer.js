/**
 * replaces the element with a table with the list of upcoming events and a timer
 * @param element Element selector
 * @param calendar Calendar ID from Google Calendar
 * @param endDays Number of days into the future
 */
function calendarTimer(element,calender,endDays){

	var calID = calender;
		
	
	var apiKey = 'AIzaSyB4yrmasPnJxZm9OlYvrSJNW0sDoiNUyFI';
		
	var result;
      
	function timeDiff(date1, date2){
		var text = "";		
		if (date1.getTime()<date2.getTime()){
			text = "<td>"
			var sec = (date2.getTime()-date1.getTime())/1000;
			if (sec>=86400)	{
				var day=Math.floor(sec/86400);
				text+= day + " day";
				if (day!=1) text += "s";
			}
			var timedate = new Date(sec*1000);
			
			var hour = Math.floor(sec % 86400 /3600);
			text += "</td><td>" + Math.floor(sec % 86400 /3600) + " hour";
			if (hour!=1) text += "s";
			
			text += "</td><td>" + timedate.getMinutes() + " minute";
			if (timedate.getMinutes()!=1) text += "s";
			
			text += "</td><td>" + timedate.getSeconds() + " second";
			if (timedate.getSeconds()!=1) text += "s";			
			
			text += "</td>"
		}
		return text;
	}
	var today=new Date();
	var eventData={};
	
	function update(){
		setTimeout(update,1000-((new Date().getTime()+500) % 1000));
		var html="<table style='text-align:right'>";
		var eventdate;
		for (events in eventData){
			if (eventData[events].start.dateTime==undefined){
				eventdate = new Date(eventData[events].start.date + "T00:00:00-04:00");
			}
			else {
				eventdate = new Date(eventData[events].start.dateTime);
			}
			var desc="#";
			 if (eventData[events].description!=undefined)desc=eventData[events].description;
			html = html + "<tr><td style='text-align:left'>" + eventData[events].summary + "</td>" + timeDiff(new Date(),eventdate) + "</tr>";
		}
		html = html + "</table>"
		document.querySelector(element).innerHTML=html;
	}
	
      $.ajax({
	    	url: "https://www.googleapis.com/calendar/v3/calendars/"+ encodeURIComponent(calID) +"/events",
	    	type: 'get',
	        dataType: 'json',
	    	data: {key: apiKey, 
		    	orderBy: "startTime",
		    	singleEvents: "true",
		    	timeMin: today.toISOString(),
		    	timeMax: new Date(today.getTime() + 86400000*endDays).toISOString()},
	    	success: function(request){
				result=request;
				var html="";
				for (events in request.items){
					var eventdate;
					eventData[events] = request.items[events];
	    			//html = html + "<br>" + eventdate.getTime()/1000;
				}
	    		update();
	    	}
	    });
}