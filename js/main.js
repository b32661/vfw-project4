/**
 *   Jeremy Criddle
 *   VFW 1302
 *   Project 4
 *  02-28-2013
 */
 
//Wait to load until DOM is ready.
window.addEventListener("DOMContentLoaded", function(){
	//getElemtntById Function
	function $(x){
		var myElement = document.getElementById(x);
		return myElement;
	}
	
	//Create select field element and populate it with options.
	function formatTime(){
		var formTag = document.getElementsByTagName("form"), //formTag is an array of all the form tags.
			selectLi = $('select'),
			makeSelection = document.createElement('select');
			makeSelection.setAttribute("id", "groups");
		for(var i=0, j=grouping.length; i<j; i++){
				var myOption = document.createElement('option');
				var optText = grouping[i];
				myOption.setAttribute("value", optText);
				myOption.innerHTML = optText;
				makeSelection.appendChild(myOption);
		}
		selectLi.appendChild(makeSelection);
		
	}
	
	//Find value of selected radio button.
	function getRightRadio(){
		var radioBut = document.forms[0].timeF;
		for(var i=0; i<radioBut.length; i++){
			if(radioBut[i].checked){
				preferred = radioBut[i].value;
			}
		}
	}
		
	function toggleSwitch(n){
		switch(n){
			case "on":
				$('stomper').style.display = "none";
				$('clean').style.display = "inline";
				$('displayIt').style.display = "none";
				$('addNew').style.display = "inline";
				break;
			case "off":
				$('stomper').style.display = "block";
				$('clean').style.display = "inline";
				$('displayIt').style.display = "inline";
				$('addNew').style.display = "none";
				$('items').style.display = "none";
				break;
			default:
				return false;
		}
	}
	
	function storeToLocal(key){
	//if there is no key, this is a brand new item and we need a new key
		if(!key){
			var id = Math.floor(Math.random()*100000001);
		}else{
		//set the id to the existion key we're edition so that it will record over the data
			id = key;
		}
		//Gather up all our form field values and store them in an object. Object properties contain array with the form label and input value
		getRightRadio();
		var item = {};
			item.group = ["Group:", $('groups').value];
			item.sure = ["Sure:", $('sure').value];
			item.preFormat = ["Format:", preferred];
			item.eventName = ["Name:", $('eventName').value];
			item.eventDescription = ["Description:", $('eventDescription').value];
			item.eventTime = ["Time:", $('eventTime').value];
			item.eventDate = ["Date:", $('eventDate').value];
		//record data into Local Storage: Use Stringify to convert our object to a string.
		localStorage.setItem(id, JSON.stringify(item));
		alert("Timestomp was successful!");
		window.location.reload();
		}
	
	function grabData(){
		toggleSwitch("on");
		if(localStorage.length === 0){
			alert("There are no Stomped times to display, so I'll fill in dummy data.");
			dummyData();
		}
		//Write Data from Local Storage to the browser.
		var makeDiv = document.createElement('div');
		makeDiv.setAttribute("id", "items");
		var makeList = document.createElement('ul');
		makeDiv.appendChild(makeList);
		document.body.appendChild(makeDiv);
		$('items').style.display = "block";
		for(var i=0, len=localStorage.length; i<len; i++){
			var makeLi = document.createElement('li');
			var linksLi = document.createElement('li');
			makeList.appendChild(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			//convert the string from local storage value back to an object by using JSON.parse()
			var obj = JSON.parse(value);			
			var makeSubList = document.createElement('ul');
			makeLi.appendChild(makeSubList);
			getImage(obj.group[1], makeSubList);
			for(var n in obj){
				var makeSubli = document.createElement('li')
				makeSubList.appendChild(makeSubli);
				var optSubText = obj[n][0]+" "+obj[n][1];
				makeSubli.innerHTML = optSubText;
				makeSubList.appendChild(linksLi)
	}
			makeSomeLinks(localStorage.key(i), linksLi);
	}
		
	}
	
	function getImage(catName, makeSubList){
		var imageLi = document.createElement('li');
		makeSubList.appendChild(imageLi);
		var newImg = document.createElement('img');
		var setSrc = newImg.setAttribute("src", "img/"+ catName + ".png");
		imageLi.appendChild(newImg);	
	}
	
	function dummyData(){
		for(var n in json){
			var id = Math.floor(Math.random()*100000001);
			localStorage.setItem(id, JSON.stringify(json[n]));
			}	
	}
	
	function makeSomeLinks(key, linksLi){
		var editLink = document.createElement('a');
		editLink.href = "#";
		editLink.key = key;
		var editText = "Edit Stomp";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);
		
		// add line break
		var breakTag = document.createElement('br');
		linksLi.appendChild(breakTag);
		
		//add delete single item link
		var deleteStomp = document.createElement('a')
		deleteStomp.href = "#";
		deleteStomp.key = key;
		var wipeText = "Delete a Stomp";
		deleteStomp.addEventListener("click", deleteSingle);
		deleteStomp.innerHTML = wipeText;
		linksLi.appendChild(deleteStomp);
	}
	
	// edit single item
	function editItem(){
		//get the data from my item from local storage
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);
		
		//show the form
		toggleSwitch("off");
		
		$('groups').value = item.group[1];
		$('sure').value = item.sure[1];
		var radioBut = document.forms[0].timeF;
		for(var i=0; i<radioBut.length; i++){
			if(radioBut[i].value == "Standard" && item.preFormat[1] == "Standard"){
				radioBut[i].setAttribute("checked", "checked");
			} else if(radioBut[i].value == "Military" && item.preFormat[1] == "Military"){
				radioBut[i].setAttribute("checked", "checked");	
			}
		}		
		$('eventName').value = item.eventName[1];
		$('eventDescription').value = item.eventDescription[1];
		$('eventDate').value = item.eventDate[1];
		$('eventTime').value = item.eventTime[1];		
		
		record.removeEventListener("click", storeToLocal);
		$('submit').value = "Edit Contact";
		var editSubmit = $('submit');
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;
		
	}
	
	function deleteSingle(){
		var question = confirm("Are you sure you want to delete this stomp?");
		if(question){
			localStorage.removeItem(this.key);
			window.location.reload();
			alert("Stomp was deleted.")
		} else{
			alert("Stomp was NOT deleted.");
			
		}
		
	}
	
	function cleanLocal(){
		if(localStorage.length === 0){
			alert("There are no stomps to clean.");
		}else{
			localStorage.clear();
			alert("All stomps are removed!");
			window.location.reload();
			return false;
		}
		
	}
	
	function validate(e){
		var getGroup = $('groups');
		var getName = $('eventName');
		var getTime = $('eventTime');
		var getDate = $('eventDate');
		
		//reset error messages
		errorMes.innerHTML = "";
		getGroup.style.border = "1px solid black";		
		getName.style.border = "1px solid black";		
		getTime.style.border = "1px solid black";
		getDate.style.border = "1px solid black";
		
				
		//get error messages		
		var messageArray = [];
		if(getGroup.value == "--What--"){
			var groupError = "Please choose the first option.";
			getGroup.style.border = "2px solid red";
			messageArray.push(groupError);
		}
		
		//name validation
		if(getName.value === ""){
			var getNameError = "Please enter a name.";
			getName.style.border = "2px solid red";
			messageArray.push(getNameError);
		}
		//time validation
		if(getTime.value === ""){
			var getTimeError = "Please enter a time.";
			getTime.style.border = "2px solid red";
			messageArray.push(getTimeError);
		}
		
		if(getDate.value === ""){
			var getDateError = "Please enter a date.";
			getDate.style.border = "2px solid red";
			messageArray.push(getDateError);
		}	
		//if there were errorList, display them on the screen
		if(messageArray.length >= 1){
			for(var i=0, j=messageArray.length; i<j; i++){
				var txt = document.createElement('li');
				txt.innerHTML = messageArray[i];
				errorMes.appendChild(txt);
			}
			e.preventDefault();
			return false;	
		} else {
		//if all is ok, record our data. send the key value(which came from the editData function. remember this key value was passed through the editSubmit event listener as a property
			storeToLocal(this.key);
		}
	}
		
	// Variable defaults
	var grouping = ["--What--", "Start", "End", "Arrival", "Departure" ],
	preferred,
	errorMes = $('errorList');
	formatTime();
	
	//set link $ submit click events
	var displayMe = $('displayIt');
	displayMe.addEventListener("click", grabData);
	var cleanLink = $('clean');
	cleanLink.addEventListener("click", cleanLocal);
	var record = $('submit');
	record.addEventListener("click", validate);
	
});