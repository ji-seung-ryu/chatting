function connect(event) {
    username = document.querySelector('#name').value.trim();

    if(username) {
		var params = new URLSearchParams();
		params.append("name", username);
		axios.post('/login', params)
					.then(
						response => {
							console.log (response.data);
							var userParams = new URLSearchParams();
							userParams.append("userId", response.data.userId);
							location.href = '/home/userList?' + userParams; 
							}
					)
					.catch(response => { alert(response); });
		
    }
    event.preventDefault();
}

var usernameForm = document.querySelector('#usernameForm');
usernameForm.addEventListener('submit', connect, true);
