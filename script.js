const registerButton = document.getElementById('register-btn');
const loginButton = document.getElementById('login-btn');
const registerAccount = document.getElementById('register-account');
const content = document.getElementById('dynamic-content');

if (registerButton) {
	registerButton.addEventListener('click', (event) => {
    event.preventDefault()
		console.log("Pressed register button")
		handleFormSubmission('/register')
});
}

if (loginButton) {
	loginButton.addEventListener('click', (event) => {
		event.preventDefault();
		handleFormSubmission('/login');
	});
}

registerAccount.addEventListener('click', (event) => {
	event.preventDefault();
	loadPartialView('/register');
})

function handleFormSubmission(url) {
	const usernameInput = document.getElementById('username').value;
	const passwordInput = document.getElementById('password').value;
	if (invalidForm(usernameInput, passwordInput)) {
		return;
	}
	console.log(usernameInput);
	console.log(passwordInput);
	submit(usernameInput, passwordInput, url);
}

async function submit(usernameInput, passwordInput, url) {
	const options = {
		headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({
			username: usernameInput,
			password: passwordInput
		})
	}
	try {
		fetch(url, options)
			.then(response => response.text())
			.then(data => {
				console.log(`Loading ${data}`);
				loadPartialView(data);
			});
	} catch (err) {
		console.log(err)
	}
}

function loadPartialView(data) {
	fetch(data)
		.then(response => response.text())
		.then(partialView => {
			content.innerHTML = partialView;
		})
		.catch(error => {
			console.error(error);
			content.innerHTML = 'Error';
		});
}

function invalidForm(usernameInput, passwordInput) {
	return usernameInput.trim() === '' || passwordInput.trim() === ''
}