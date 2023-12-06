window.onload = function () {
	chrome.storage.local.get({ profiles: [], defaultProfile: [], 'shopifyAtcSwitch': {}}, (results) => {	
        profile = results.profiles.find(profile => profile.profileName === results.defaultProfile);
		atcSwitchState = results['shopifyAtcSwitch'];

		if (atcSwitchState === true) {
			if (profile) {
				let fields = {
					'number': profile.cardNumber,
					'name': profile.firstName + " " + profile.lastName,
					'expiry': profile.expiryDate,
					'verification_value': profile.cvv,
				}

				Object.keys(fields).forEach(id => {
					fillField(id, fields[id]);
				});
				
				
			}	
		}
	});
}

function fillField(id, value) {
	let element = document.getElementById(id);
	if (element) {
		element.focus();
		element.value = value;
		element.dispatchEvent(new Event('change'));
		element.blur();
	}
}

function continueToNextStep() {
	let continueButton = document.querySelector('#continue_button');
	continueButton.click();
}

