window.onload = function () {
	chrome.storage.local.get({ profiles: [], defaultProfile: [], 'shopifyAtcSwitch': {},'shopifyAcoSwitch': {}}, (results) => {	
        profile = results.profiles.find(profile => profile.profileName === results.defaultProfile);
        atcSwitchState = results['shopifyAtcSwitch'];
        acoSwitchState = results['shopifyAcoSwitch'];
		if (atcSwitchState === true) {
            console.log("SWITCH IS ACTIVE")
			if (profile) {
                console.log("Profile IS ACTIVE")
				if (currentStep() === 'contact_information') {
					let fields = {
						'[name="checkout[email_or_phone]"]': profile.email,
						'[name="checkout[email]"]': profile.email,
						'#checkout_email': profile.email,
						'#checkout_email_or_phone': profile.email,
						'#checkout_shipping_address_first_name': profile.firstName,
						'#checkout_shipping_address_last_name': profile.lastName,
						'#checkout_shipping_address_address1': profile.addressLine1,
						'#checkout_shipping_address_address2': profile.addressLine2,
						'#checkout_shipping_address_city': profile.city,
						'#checkout_shipping_address_zip': profile.postalCode,
						'#checkout_shipping_address_phone': profile.phoneNumber,
						'#checkout_billing_address_first_name': profile.firstName,
						'#checkout_billing_address_last_name': profile.lastName,
						'#checkout_billing_address_address1': profile.addressLine1,
						'#checkout_billing_address_address2': profile.addressLine2,
						'#checkout_billing_address_city': profile.city,
						'#checkout_billing_address_zip': profile.postalCode,
						'#checkout_billing_address_phone': profile.phoneNumber
					};

					Object.keys(fields).forEach(id => {
						fillField(id, fields[id]);
					});

					fillField('#checkout_shipping_address_country', profile.country, true);
					fillField('#checkout_shipping_address_province', profile.province, true);

					fillField('#checkout_billing_address_country', profile.country, true);
					fillField('#checkout_billing_address_province', profile.province, true);

					console.log(hasCaptcha());

					if (atcSwitchState === true && !hasCaptcha()) {
						continueToNextStep();
					}
				} else if (currentStep() === 'shipping_method') {
					if (atcSwitchState === true) {
						continueToNextStep();
					}
                    
				}

                if (acoSwitchState === true) {
                    continueToNextStep()
                }
			}
		}
	});
};





const currentStep = () => {
	let element = document.querySelector('[data-step]');
	return element.dataset.step;
};


function fillField(id, value, select = false) {
	let element = document.querySelector(id);
	if (element) {
		element.focus();
        element.value = value;
        element.dispatchEvent(new Event('change'));
		element.blur();
	}
}


function hasCaptcha() {
	return document.getElementById('g-recaptcha') !== null;
}

function continueToNextStep() {
	let continueButton = document.querySelector('#continue_button');
	continueButton.click();
}
