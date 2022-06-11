function addMember(username){
	const table = document.getElementById('userTable');
	
	const newRow = table.insertRow();
	
	const newCell1 = newRow.insertCell(0);
	const newCell2 = newRow.insertCell(1);
	
	newCell1.innerText = username;
	newCell2.innerText = "active";
}

function deleteMember(username){
	const table = document.getElementById('userTable');

	const tbody = table.getElementsByTagName("tbody")[0];
	
	const trs = tbody.getElementsByTagName("tr");
	
	var deletePos; 
	
	for (var i=0;i<trs.length;i++){
		console.log(trs[i].getElementsByTagName("td")[0] );
		if(username === trs[i].getElementsByTagName("td")[0].innerText ) deletePos = i; 
		
	}
	
	table.deleteRow(deletePos+1);
}

function setMember(members){
	for (var i=0;i<members.length;i++) addMember(members[i]);
}