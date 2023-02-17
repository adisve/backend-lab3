const content = document.getElementById('dynamic-content');
addListenerForLoginButton();
addListenerForRegisterAccountButton();
addListenerForRegisterButton();

const LOGIN = 'login';
const REGISTER = 'register';

const observer = new MutationObserver(function(mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
			addListenerForLoginButton()
			addListenerForRegisterAccountButton()
			addListenerForRegisterButton()
    }
  }
});

observer.observe(content, { childList: true });

function addListenerForRegisterButton() {
	if (document.getElementById('register-button')) {
		document.getElementById('register-button').addEventListener('click', (event) => {
			event.preventDefault()
			handleFormSubmission('/register', REGISTER)
		});
	}
}

function addListenerForLoginButton() {
	if (document.getElementById('login-button')) {
		document.getElementById('login-button').addEventListener('click', (event) => {
			event.preventDefault();
			handleFormSubmission('/login', LOGIN);
		})
	}
}

function addListenerForRegisterAccountButton() {
	if (document.getElementById('register-account')) {
		document.getElementById('register-account').addEventListener('click', (event) => {
			event.preventDefault();
			loadPartialView('/register');
		})
	}
}

function handleFormSubmission(url, type) {
	const usernameInput = document.getElementById(type == REGISTER ? 'register-username' : 'login-username').value;
	const passwordInput = document.getElementById(type == REGISTER ? 'register-password' : 'login-password').value;
	if (invalidForm(usernameInput, passwordInput)) {
		return;
	}
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