var selectedText = "";
var selectedTextMaxLength = 20;
var sourceToggle = false;
var numberTabs = 1;
var activeTab = 1;
var maxTabs = 10;
var sourceMaxWidth = 30;
var sourceIncrement = 5;
var highlightRange = [[100, 200], [350, 400]];
//var highlightRange = [[0,80],[656,716]];
var highlightColor = "yellow";
var wasUnlocked = null;
/*
$(window).bind("beforeunload",function(){
	if(($("#txta-source-1").val() != "") || ($("#txta-source-2").val() != "") || ($("#txta-source-3").val() != "") || ($("#txta-source-4").val() != "") || ($("#txta-source-5").val() != "")) {
		return confirm("Confirm refresh");
	}
});
*/
//ONLOAD FUNCTION
$(window).load(function() {
	uploadText();
	sampleText();
	createSVG();
	createSchemeDropdown();
	showTab(1);
	toggleSource(1);
	textareaRemoveActive();

	var w = $("svg").width();
	var h = $("svg").height();

	console.log("svg w="+w);
	console.log("svg h="+h);

	moveElementsToFit(w, h);

	// Set the text currently in the tab to the data object tabs sub-array
	$(".txta-source").on("keyup paste", function() {
		var currentTab = (activeTab-1);
		data.tabs[currentTab].text = this.value;
	});
});

function createSchemeDropdown() {
	console.log("createSchemeDropdown()");
	var schemeTypeArray = [];

	console.log("schemeTypeArray.length="+schemeTypeArray.length);

	if(schemeTypeArray.length > 0) {
		$.each(schemeTypeArray, function(index, value) {
			$("#ul-scheme").append("<li><a href=''>"+schemeTypeArray[index]+"</a></li>");
		});
	}
}

function panelResize(type) {
	// If the parameter is 0 - start dragging - else end
	if(Number(type) == 0) {
		console.log("Resizing Start");
		$("#txta-source-"+activeTab).addClass("noSelect");
		// Start - if the tab is not readonly (aka you could edit this)
		if(!$("#txta-source-"+activeTab).prop("readonly")) {
			console.log("you could edit this tab");
			// Prevent editing
			$("#txta-source-"+activeTab).prop("readonly", true);
			wasUnlocked = true;
		}
	} else {
		console.log("Resizing End");
		$("#txta-source-"+activeTab).removeClass("noSelect");
		if(wasUnlocked == true) {
			console.log("wasUnlocked == true!");
			$("#txta-source-"+activeTab).prop("readonly", false);
		}
		// Update the node positions when a drag is finished
		var w = $("#svg-vis").width();
		var h = $("#svg-vis").height();

		moveElementsToFit(w,h);
	}
}

function genRandColor() {
	var color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
	console.log("color="+color);
	return color.toString();
}

function testHighlight() {
	//highlightRange.push([90,90]);
	//console.log(highlightRange[0]);
	//console.log(highlightRange[1]);
	/*
	console.log(JSON.stringify(highlightRange));
	$("#txta-source-1").highlightTextarea({
		//color: highlightColor,
		//ranges: highlightRange
		ranges: highlightRange
	});
	*/
	$("#txta-source-1").highlightWithinTextarea(onInputArray);
	//The function call above locks (doesnt actually lock but makes the text uneditable) the tab - update the icon here
	lockTab();
}

function test() {
	console.log("hwt-content="+$(".hwt-content").val());
}

function removeLastRangeElement() {
	highlightRange.pop();
	console.log("highlightRange="+JSON.stringify(highlightRange));
}

function onInputArray(input) {
	return highlightRange;
}

// Update the width attribute of the SVG - for the saving library
function getSVGWidth() {
	var w = $("#col-right").css("width");
	console.log("col-right width="+w);

	console.log($("#svg-vis").css("width"));
	console.log("svg-vis width="+$("#svg-vis").attr("width"));

	$("#svg-vis").attr("width",w);

	console.log("svg-vis width="+$("#svg-vis").attr("width"));
}

function sourceChange(type) {
	// If the parameter is 0 then decrease the source max width - else increase the value
	if(Number(type) == 0) {
		if(sourceMaxWidth > 20) {
			sourceMaxWidth = sourceMaxWidth - sourceIncrement;
			$("#input-source-display").val(sourceMaxWidth+"%");
			$(".panel-left").css("max-width",sourceMaxWidth+"%");
		}
	} else {
		if(sourceMaxWidth < 50) {
			sourceMaxWidth = sourceMaxWidth + sourceIncrement;
			$("#input-source-display").val(sourceMaxWidth+"%");
			$(".panel-left").css("max-width",sourceMaxWidth+"%");
		}
	}
}

function toggleSource(toggle) {
	if(toggle == 1) {
		sourceToggle = true;
	}
	console.log("toggleSource!");
	if(sourceToggle == false) {
		$("#col-left").hide();
		$(".splitter").hide();
		
		$("#i-source").removeClass("fa-chevron-left");
		$("#i-source").addClass("fa-chevron-right");
		
		sourceToggle = true;
	} else {
		$("#col-left").show();	
		$(".splitter").show();
		
		$("#i-source").removeClass("fa-chevron-right");
		$("#i-source").addClass("fa-chevron-left");

		var w = $("#svg-vis").width();
		var h = $("#svg-vis").height();

		moveElementsToFit(w,h);
		
		sourceToggle = false;
	}
}

function sampleText() {
	$("#txta-source").val("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in sagittis magna. Quisque augue nisl, aliquet vel vehicula sit amet, lobortis at ex."
	+"Donec quis lacinia lorem. Pellentesque venenatis eget lacus ac sagittis. Phasellus a congue purus. Vestibulum fringilla lectus ac massa volutpat cursus. Donec ac eleifend"
	+"tortor, et blandit erat. Quisque a consequat ligula, non tincidunt mauris. Quisque tincidunt ultrices tortor, a venenatis sapien facilisis sed. Aliquam nisl elit, tempor at"
	+"feugiat non, tempus quis enim. Donec cursus tempus augue, vitae dapibus sem volutpat eu. Vivamus dolor sapien, porttitor fermentum tortor at, placerat malesuada sem. Sed vitae enim scelerisque,"
	+"fringilla urna sed, tempor turpis. Fusce ac molestie dui, ut lobortis libero. Maecenas leo tellus, tempus id dictum sed, facilisis quis augue. Integer at ullamcorper enim."
	+"Sed viverra tortor non urna hendrerit euismod. In magna ligula, faucibus at lobortis at, interdum a turpis. Maecenas laoreet lobortis elit, at commodo metus congue quis. Integer"
	+"in egestas diam. In at velit ut lorem feugiat pulvinar in vestibulum leo. Aliquam eu eros non massa fermentum malesuada efficitur a ligula. Donec posuere consequat enim nec eleifend."
	+"Curabitur suscipit metus et tincidunt condimentum. Ut porttitor eros fringilla, tincidunt augue vel, ultricies elit. Integer porttitor, tellus a vulputate vulputate, mauris diam mattis"
	+"enim, et finibus sem enim maximus enim. In sollicitudin lacus fermentum tellus molestie aliquam. Donec faucibus dolor nec ex suscipit lobortis. Sed ut eros ipsum."
	+"Suspendisse pellentesque sagittis ligula non facilisis. Nulla sed turpis eget nunc pharetra lobortis elementum vitae ante. Morbi vehicula, quam ac ultricies eleifend, ante elit semper lectus,"
	+"tempor tincidunt erat sem fermentum libero. Vivamus semper nulla vel arcu tincidunt semper ut nec arcu. Sed in iaculis mauris. Vivamus molestie est dui, at iaculis dolor egestas id. Nullam pulvinar"
	+"consectetur mi sit amet aliquet. Curabitur id venenatis urna. Vivamus id massa sapien. Morbi porttitor urna fermentum mi blandit, sed lacinia mi elementum. Sed nec tempus mauris. Sed quis lorem sapien."
	+"Morbi vel maximus nisi. Ut orci mi, ultrices nec lorem sagittis, congue dictum quam. Maecenas placerat, ipsum ut consequat eleifend, metus ipsum ornare quam, eu semper purus mi nec turpis. Curabitur ut accumsan arcu."
	+"Nam dolor nunc, tincidunt sed nunc eget, pulvinar sollicitudin arcu. Nulla et dictum erat. Phasellus pulvinar blandit mauris, aliquet pellentesque tortor sagittis sit amet. Nullam vel ex odio."
	+"Maecenas posuere gravida mi tempor tristique. Nullam facilisis, lacus sed vestibulum hendrerit, dui felis mattis turpis, nec pellentesque diam leo eu nulla. Donec egestas risus erat, vitae efficitur ante gravida nec."
	+"Donec accumsan, leo semper rutrum interdum, tellus felis imperdiet libero, id rutrum libero neque interdum mauris. Phasellus pharetra molestie nisi ac ullamcorper. Vestibulum nec volutpat leo. "
	+"Maecenas eu ullamcorper metus. Aliquam commodo, justo eu accumsan sollicitudin, turpis odio rutrum ipsum, ut finibus neque lorem at nulla. Nunc eu felis volutpat, egestas felis in, vulputate ipsum."
	+"Maecenas ullamcorper. Aliquam ut finibus neque lorem at nulla. commodo, turpis odio rutrum ipsum, justo eu accumsan sollicitudin. Nunc eu felis volutpat, egestas felis in, vulputate ipsum."
	+"accumsan, leo semper rutrum interdum, tellus felis imperdiet libero, id rutr Phasellus pharetra molestie nisi ac ullamcorper. Vestibulum nec volutpat leo. "
	+"semper rutrum interdum, tet libero, id rutrum libero neque interdum mauris. Phasellus pharetra molestie npat leo. "
	+"Donec accumsan, um interdum, tellus felis  id rutrum libero neque interdum mauris. Phasellus pharetra molestie nisi ac ullamcorper. Vestibulum nec volutpat leo. ");
}

function textareaRemoveActive() {
	// When any textarea is clicked, remove the active element from d3.js
	$(".txta-source").on("focus",function() {
		removeActive();
		removeDragLine();
		removeTextOverlay();
		clearTextRow();
	});
}

function lockTab() {
	// If the current tab (source and title) is readonly (locked) unlock it - else lock it
	if($("#txta-tab-"+activeTab).prop("readonly") && $("#txta-source-"+activeTab).prop("readonly")) {
		$("#txta-tab-"+activeTab).prop("readonly", false);
		$("#txta-source-"+activeTab).prop("readonly", false);

		$("#i-lock-tab").removeClass("fa-unlock");
		$("#i-lock-tab").addClass("fa-lock");
		$("#span-lock").text(" Lock Tab");
	} else {
		$("#txta-tab-"+activeTab).prop("readonly", true);
		$("#txta-source-"+activeTab).prop("readonly", true);

		// If the tab title is empty when they lock it - set the title to default (Tab X).
		if(!$("#txta-tab-"+activeTab).val()) {
			console.log("tab title empty locking!");
			$("#txta-tab-"+activeTab).val("Tab "+activeTab);
		}

		$("#i-lock-tab").removeClass("fa-lock");
		$("#i-lock-tab").addClass("fa-unlock");
		$("#span-lock").text(" Unlock Tab");
	}
}

function clearSource() {
	// Clear the textarea of the current textarea
	$("#txta-source-"+activeTab).val("");
}

function uploadText() {
	// This function allows the upload button to read and upload the text back to back
	$("#fileInput").on("click", function(e){
    	$(this).prop("value", "");
	});

	$("#fileInput").on("change", function(e) {
		var name = readFile(this.files[0], function(e) {
			// Get the text of the current file
			var currentFile = e.target.result;
			
			$("#txta-source-"+activeTab).val("");
			console.log("text="+currentFile);
			$("#txta-source-"+activeTab).val(currentFile);
		});

		// Set the name of the tab to the name of the uploaded file
		$("#txta-tab-"+activeTab).val(name);
	});
}

function readFile(file, callback) {
    var reader = new FileReader();
    reader.onload = callback;
    reader.readAsText(file);
	console.log(file.name);
	// Return the file name
	return file.name;
}

// Save the current tab content as a .txt
function saveTextAsFile() {
	try {
		var elementName = "#txta-source-"+activeTab;
		var textToWrite = $(elementName).val();
		var textFileAsBlob = new Blob([ textToWrite ], { type: 'text/plain' });
		//var fileNameToSaveAs = "ecc.plist";
		var fileNameToSaveAs = "MonkeyPuzzleTab"+activeTab;

		var downloadLink = document.createElement("a");
		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = "Download File";
		if(window.URL != null) {
			// Chrome allows the link to be clicked without actually adding it to the DOM.
			downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		} else {
			// Firefox requires the link to be added to the DOM before it can be clicked.
			downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
			downloadLink.onclick = destroyClickedElement;
			downloadLink.style.display = "none";
			document.body.appendChild(downloadLink);
		}
		downloadLink.click();
	}
	catch (e) {
		logMyErrors(e); // pass exception object to error handler
	}
}

function addTab() {
	// If the current number of tabs is less than the maximum allowed
	if(numberTabs < maxTabs) {
		// Insert the new tab after the last tab
		$(".source-tab:last").after("<div id='div-source-tab-"+(numberTabs+1)+"' class='source-tab no-padding-lr col-md-1'><button class='btn btn-source btn-block' onclick='showTab("+(numberTabs+1)+")'></span>"+(numberTabs+1)+"</button></div>");
		// Set the number of tabs
		numberTabs = $(".source-tab").length;
		showTab(numberTabs);
	} else {
		// Show max tab modal
		showModal(10);
	}
}

function removeTab() {
	var sourceTextArray = [];
	var sourceTitleArray = [];

	// If there is only one tab - you can not remove it - else remove tab
	if(numberTabs == 1)  {
		console.log("removeTab activeTab="+activeTab);
		showModal(8);
	} else {
		// Log the active tab
		console.log("activeTab="+activeTab);

		// Log the contents of each tab text and tab title
		$(".txta-source").each(function(index) {
			console.log("txta-source-"+(index+1)+$("#txta-source-"+(index+1)).val());
			console.log("txta-tab-"+(index+1)+$("#txta-tab-"+(index+1)).val());
		});

		// Remove the tab header
		$("#div-source-tab-"+activeTab).remove();

		// Loop through each source
		$(".txta-source").each(function(index) {
			if((index+1) <= numberTabs) {
				// If the source id is not the active tab - this is required because we don't want the title of current tab (it is being deleted!)
				if($(".txta-source").eq(index).attr("id") != ("txta-source-"+activeTab)) {
					// Log the contents of each tab text and title
					console.log("txta-source-"+(index+1)+"="+$(".txta-source").eq(index).val());
					console.log("txta-tab-"+(index+1)+"="+$(".txta-tab").eq(index).val());
					// Add the value in both the tab text and title to arrays
					sourceTextArray.push($(".txta-source").eq(index).val());
					sourceTitleArray.push($(".txta-tab").eq(index).val());
				}
			}
		});

		// Correct the number of tabs
		numberTabs = $(".source-tab").length;
		console.log("numberTabs="+Number(numberTabs));

		// Log the arrays
		console.log("sourceTextArray="+JSON.stringify(sourceTextArray));
		console.log("sourceTitleArray="+JSON.stringify(sourceTitleArray));

		// When removing tabs - set the current tab view to the first
		showTab(1);
		// Reorder tabs - orders tabs by number and updates button attributes - pass the array of source textarea values to get tabs moved
		reorderTabs(sourceTextArray,sourceTitleArray);
	}
}

function reorderTabs(sourceTextArray,sourceTitleArray) {
	// For each tab - get the text into an array - set the id of the containing div - the button onclick parameter - the button text (note index starts at 0)
	$(".source-tab").each(function(index) {
		// If the tab source value is not empty - add the text to the sourceTextArray
		/*
		if($("#txta-source-"+(index+1)).val() != "") {
			sourceTextArray.push($("#txta-source-"+(index+1)).val());
			//sourceTitleArray.push($("#txta-source-"+(index+1)).val());
		}
		*/
		// Update the tab title container properties - id - the parameter passed in the onclick - the text - the tab titles 
		$(this).attr("id","div-source-tab-"+(index+1));
		$(this).children().attr("onclick","showTab("+(index+1)+")");
		$(this).children().text((index+1));
	});

	// Empty the source textareas - replace content with values from array
	$(".txta-source").val("");
	$(".txta-tab").val("");

	// Set the value of the textarea to the correct text - based on tabs being removed
	$(".source-tab").each(function(index) {
		// If the loop index plus 1 is less than or equal to the sourceTextArrayLength
		if((index+1) <= sourceTextArray.length) {
			$("#txta-source-"+(index+1)).val(sourceTextArray[index]);
			$("#txta-tab-"+(index+1)).val(sourceTitleArray[index]);
		}
	});

	// Loop and update the tab titles after being reordered
	$(".txta-tab").each(function(index) {
		if($("#txta-tab-"+(index+1)).val() == "") {
			$("#txta-tab-"+(index+1)).val("Tab "+(index+1));
		}
	});
}

function showTab(num) {
	// Based on parameter - hide all the textereas and then show only the current tab textarea
	$(".txta-source").hide();
	$(".txta-tab").hide();
	$("#txta-source-"+num).show();
	$("#txta-tab-"+num).show();

	// If the tab is locked when you show it - set the lock icon else set the unlock icon
	if($("#txta-tab-"+num).prop("readonly") && $("#txta-source-"+num).prop("readonly")) {
		$("#i-lock-tab").removeClass("fa-lock");
		$("#i-lock-tab").addClass("fa-unlock");
	} else {
		$("#i-lock-tab").removeClass("fa-unlock");
		$("#i-lock-tab").addClass("fa-lock");
	}

	// Remove the active tab css and add it to the new activeTab
	$(".source-tab").children().removeClass("active-tab");
	$("#div-source-tab-"+num).children().addClass("active-tab");

	activeTab = num;
	console.log("activeTab="+activeTab);
}

function copyNodeText() {
	console.log("copyNodeText!");
	if($("#txta-node-text").val() != "") {
		window.prompt("Copy to clipboard: Ctrl+C -> Enter", $("#txta-node-text").val());
	}
}

function saveSVG() {
	var filename = $("#input-file-name").val();

	console.log("filename="+filename);

	// Remove active element from the visualisation when saving
	removeActive();

	/* This can be used to identify what content the serialized svg will have
	var svg  = document.getElementById('svg-vis');
    var xml  = new XMLSerializer().serializeToString(svg);
	console.log("xml="+xml);
	*/

	saveSvgAsPng(document.getElementById("svg-vis"), filename);
}

function showMissingTextOption() {
	$("#txta-missing").val("");
	$("#div-add-missing-text").show();
}

//TODO: check uploaded JSON for correct format
function uploadJSON() {

}
//TODO: allow the data object to be downloaded
function downloadJSON() {

}

function getActiveTab() {
	console.log("activeTab="+activeTab);
}