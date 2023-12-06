// Retrieve elements from the DOM
const profileSelect = document.getElementById('profileSelect');
const profileNameInput = document.getElementById('profileName');
const emailInput = document.getElementById('email');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const addressLine1Input = document.getElementById('addressLine1');
const addressLine2Input = document.getElementById('addressLine2');
const cityInput = document.getElementById('city');
const provinceInput = document.getElementById('province');
const countryInput = document.getElementById('country');
const postalCodeInput = document.getElementById('postalCode');
const phoneNumberInput = document.getElementById('phoneNumber');
const cardNumberInput = document.getElementById('cardNumber');
const expiryDateInput = document.getElementById('expiryDate');
const cvvInput = document.getElementById('cvv');
const saveButton = document.getElementById('saveProfile');
const deleteButton = document.getElementById('deleteProfile');
const createProfileButton = document.getElementById('createProfile');

let defaultProfile = null;

// Function to clear the form fields
function clearFormFields() {
  // Clear the value of each input field
  profileNameInput.value = '';
  emailInput.value = '';
  firstNameInput.value = '';
  lastNameInput.value = '';
  addressLine1Input.value = '';
  addressLine2Input.value = '';
  cityInput.value = '';
  provinceInput.value = '';
  countryInput.value = '';
  postalCodeInput.value = '';
  phoneNumberInput.value = '';
  cardNumberInput.value = '';
  expiryDateInput.value = '';
  cvvInput.value = '';
}

// Function to populate the form fields with profile data
function populateFormFields(profileData) {
  profileNameInput.value = profileData.profileName;
  emailInput.value = profileData.email;
  firstNameInput.value = profileData.firstName;
  lastNameInput.value = profileData.lastName;
  addressLine1Input.value = profileData.addressLine1;
  addressLine2Input.value = profileData.addressLine2;
  cityInput.value = profileData.city;
  provinceInput.value = profileData.province;
  countryInput.value = profileData.country;
  postalCodeInput.value = profileData.postalCode;
  phoneNumberInput.value = profileData.phoneNumber;
  cardNumberInput.value = profileData.cardNumber;
  expiryDateInput.value = profileData.expiryDate;
  cvvInput.value = profileData.cvv;
}

function saveProfile(event) {
  event.preventDefault(); // Prevent form submission

  // Retrieve the entered profile name
  const enteredProfileName = profileNameInput.value.trim();

  // Check if the entered profile name is empty
  if (enteredProfileName === '') {
    alert('Please enter a profile name.');
    return;
  }

  // Get the saved profiles
  getSavedProfiles(savedProfiles => {
    // Check if a profile with the same name already exists
    const existingProfileIndex = savedProfiles.findIndex(
      profile => profile.profileName === enteredProfileName
    );

    if (existingProfileIndex !== -1) {
      // Overwrite the existing profile with the new data

      // Save the profile data
      const profileData = {
        profileName: enteredProfileName,
        email: emailInput.value,
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        addressLine1: addressLine1Input.value,
        addressLine2: addressLine2Input.value,
        city: cityInput.value,
        province: provinceInput.value,
        country: countryInput.value,
        postalCode: postalCodeInput.value,
        phoneNumber: phoneNumberInput.value,
        cardNumber: cardNumberInput.value,
        expiryDate: expiryDateInput.value,
        cvv: cvvInput.value,
      };

      // Update the existing profile in the saved profiles array
      savedProfiles[existingProfileIndex] = profileData;

      // Update the profiles in storage
      chrome.storage.local.set({ profiles: savedProfiles }, () => {
        // Set the selected profile as the default profile
        chrome.storage.local.set({ defaultProfile: profileData.profileName }, () => {
          // Clear the form fields
          clearFormFields();
        });
      });
    } else {
      // Create a new profile option
      const profileOption = document.createElement('option');
      profileOption.text = enteredProfileName;
      profileOption.value = enteredProfileName;

      // Add the profile option to the select dropdown
      profileSelect.add(profileOption);

      // Save the profile data
      const profileData = {
        profileName: enteredProfileName,
        email: emailInput.value,
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        addressLine1: addressLine1Input.value,
        addressLine2: addressLine2Input.value,
        city: cityInput.value,
        province: provinceInput.value,
        country: countryInput.value,
        postalCode: postalCodeInput.value,
        phoneNumber: phoneNumberInput.value,
        cardNumber: cardNumberInput.value,
        expiryDate: expiryDateInput.value,
        cvv: cvvInput.value,
      };
      
      // Add the new profile to the saved profiles
      savedProfiles.push(profileData);

      // Update the profiles in storage
      chrome.storage.local.set({ profiles: savedProfiles }, () => {
        // Set the selected profile as the default profile
        chrome.storage.local.set({ defaultProfile: profileData.profileName }, () => {
          // Clear the form fields
          clearFormFields();
        });
      });
    }
  });
}


// Function to delete the profile
function deleteProfile(event) {
  event.preventDefault(); // Prevent form submission

  const selectedIndex = profileSelect.selectedIndex;

  // Check if an option is selected
  if (selectedIndex !== -1) {
    // Retrieve the selected option
    const selectedOption = profileSelect.options[selectedIndex];

    // Delete the profile data
    const profileName = selectedOption.value;
    deleteProfileData(profileName);

    // Remove the selected option from the select dropdown
    profileSelect.remove(selectedIndex);

    // Clear the form fields
    clearFormFields();
  }
}

// Function to handle createProfile button click event
function handleCreateProfileClick(event) {
  event.preventDefault(); // Prevent form submission

  clearFormFields();
}

// Function to save the profile data
function saveProfileData(profile) {
  // Retrieve the existing saved profiles
  getSavedProfiles(savedProfiles => {
    // Add the new profile to the saved profiles
    savedProfiles.push(profile);

    // Update the profiles in storage
    chrome.storage.local.set({ profiles: savedProfiles }, () => {
      // Set the selected profile as the default profile
      chrome.storage.local.set({ defaultProfile: profile.profileName });
    });
  });
}

// Function to delete the profile data
function deleteProfileData(profileName) {
  // Retrieve the existing saved profiles from chrome.storage.local
  getSavedProfiles(savedProfiles => {
    // Find the index of the profile to be deleted
    const index = savedProfiles.findIndex(
      profile => profile.profileName === profileName
    );

    // Remove the profile from the saved profiles
    if (index !== -1) {
      savedProfiles.splice(index, 1);

      // Update the profiles in chrome.storage.local
      chrome.storage.local.set({ profiles: savedProfiles });
    }
  });
}

// Function to load the selected profile
function loadProfile() {
  const selectedIndex = profileSelect.selectedIndex;
  const profileCount = profileSelect.options.length;

  // Check if no option is selected and only one profile exists
  if (selectedIndex === -1 && profileCount === 1) {
    // Retrieve the first option
    const selectedOption = profileSelect.options[0];

    // Get the saved profile data
    const profileName = selectedOption.value; // Use value property instead of text
    getSavedProfileData(profileName, profile => {
      // Set the form fields with the selected profile's values
      populateFormFields(profile);
    });
  }
  // If an option is selected, load the selected profile as before
  else if (selectedIndex !== -1) {
    const selectedOption = profileSelect.options[selectedIndex];
    const profileName = selectedOption.value;
    getSavedProfileData(profileName, profile => {
      populateFormFields(profile);
    });

    // Set the selected profile as the default profile
    chrome.storage.local.set({ defaultProfile: profileName }, () => {
      console.log("Default Profile Selected: ", profileName);
    });
  }
  // If no option is selected, load the default profile if available
  else {
    // Retrieve the default profile from storage
    chrome.storage.local.get('defaultProfile', result => {
      const defaultProfile = result.defaultProfile;

      // Check if a default profile is set
      if (defaultProfile) {
        selectDefaultProfile(defaultProfile); // Select the default profile in the dropdown
        getSavedProfileData(defaultProfile, profile => {
          populateFormFields(profile);
        });
      } else {
        // Clear the form fields when no option is selected or multiple profiles exist
        clearFormFields();
        console.log("No Default Profile");
      }
    });
  }

  // Log the default profile
  chrome.storage.local.get('defaultProfile', result => {
    const defaultProfile = result.defaultProfile;
    console.log("Default Profile:", defaultProfile);
  });
}

// Function to retrieve all the saved profiles
function getSavedProfiles(callback) {
  // Retrieve the saved profiles from storage
  chrome.storage.local.get('profiles', result => {
    const savedProfiles = result.profiles || [];
    callback(savedProfiles);
  });
}

// Function to retrieve a specific profile by profileName
function getSavedProfileData(profileName, callback) {
  // Retrieve the saved profiles from storage
  getSavedProfiles(savedProfiles => {
    // Find the profile with the matching profileName
    const profile = savedProfiles.find(
      profile => profile.profileName === profileName
    );
    callback(profile);
  });
}

// Function to select the default profile in the dropdown
function selectDefaultProfile(defaultProfile) {
  // Find the option with the default profile value
  const defaultOption = Array.from(profileSelect.options).find(
    option => option.value === defaultProfile
  );

  // If a matching option is found, select it
  if (defaultOption) {
    defaultOption.selected = true;
  }
}

// Attach event listeners to the buttons
saveButton.addEventListener('click', saveProfile);
deleteButton.addEventListener('click', deleteProfile);
createProfileButton.addEventListener('click', handleCreateProfileClick);
profileSelect.addEventListener('change', loadProfile);

document.addEventListener('DOMContentLoaded', function () {
  getSavedProfiles(savedProfiles => {
    savedProfiles.forEach(profile => {
      const profileOption = document.createElement('option');
      profileOption.text = profile.profileName;
      profileOption.value = profile.profileName; // Add value property to the option
      profileSelect.add(profileOption);
    });

    // If there is only one profile saved, select it and populate the form
    if (savedProfiles.length === 1) {
      profileSelect.selectedIndex = 0;
      selectDefaultProfile(savedProfiles[0].profileName); // Select the default profile
      loadProfile();
    } else {
      // Retrieve the default profile from storage
      chrome.storage.local.get('defaultProfile', result => {
        const defaultProfile = result.defaultProfile;
        // Check if a default profile is set
        if (defaultProfile) {
          selectDefaultProfile(defaultProfile); // Select the default profile in the dropdown
          loadProfile(); // Load the selected profile
        } else {
          // Clear the form fields when no option is selected or multiple profiles exist
          clearFormFields();
          console.log("No Default Profile");
        }
      });
    }
  });

  // Log the default profile
  chrome.storage.local.get('defaultProfile', result => {
    const defaultProfile = result.defaultProfile;
    console.log("Default Profile:", defaultProfile);
  });
});



// Function to save the state of the switches
function saveSwitchState(switchId, switchState) {
  chrome.storage.local.set({ [switchId]: switchState });
}

// Function to restore the state of the switches
function restoreSwitchState(switchId) {
  chrome.storage.local.get([switchId], function (result) {
      if (result.hasOwnProperty(switchId)) {
          document.getElementById(switchId).checked = result[switchId];
      }
  });
}

// Event listener for switch changes
document.addEventListener('DOMContentLoaded', function () {
  // Restore the state of the switches on page load
  restoreSwitchState('shopifyAtcSwitch');
  restoreSwitchState('shopifyAcoSwitch');

  // Save the state of the switches when they are toggled
  document.getElementById('shopifyAtcSwitch').addEventListener('change', function (event) {
      saveSwitchState('shopifyAtcSwitch', event.target.checked);
  });
  document.getElementById('shopifyAcoSwitch').addEventListener('change', function (event) {
      saveSwitchState('shopifyAcoSwitch', event.target.checked);
  });
});


document.body.style.overflow = "hidden";


// Function to update the time every second
function updateTime() {
  var currentTime = new Date();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  var seconds = currentTime.getSeconds();
  
  // Determine AM or PM
  var meridiem = hours < 12 ? "AM" : "PM";
  
  // Convert to 12-hour format
  hours = hours % 12 || 12;
  
  // Pad single digit hours, minutes, and seconds with leading zeros
  hours = (hours < 10 ? "0" : "") + hours;
  minutes = (minutes < 10 ? "0" : "") + minutes;
  seconds = (seconds < 10 ? "0" : "") + seconds;
  
  // Construct the formatted time string
  var formattedTime = hours + ":" + minutes + ":" + seconds + " " + meridiem;
  
  // Update the time element on the page
  document.getElementById("current-time").textContent = formattedTime;
}

// Call updateTime() initially to avoid delay
updateTime();

// Call updateTime() every second
setInterval(updateTime, 1000);
