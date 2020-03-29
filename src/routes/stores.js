import { writable, readable } from 'svelte/store';
import * as yup from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

// store values for Step One (user step)
export const stepOneComplete = writable(false);
export const addressChangeActive = writable(false);
export const addressStepOneComplete = writable(false);
export const addressType = writable("");

export const validUser = writable(yup.object().shape({
  smart_id: yup.string().required("Please select your smartID"),
  email: yup.string().required("Email is required").email("Email is not valid"),
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  phone: yup.string()
    .required("Phone number is required")
    .matches(phoneRegExp, "Phone number is not valid"),
  password: yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password must be shorter than 30 characters")
}));

export const user = writable({
  smart_id: '',
  email: '',
  first_name: '',
  last_name: '',
  phone: '',
  password: '',
});

// Create 3 options for smartIDs
const letters = 'ABCDEFGHJKLMNPQRTUVWXY1234567890';  // selection of A-Z & 0-9 (No I, S, Z, or O)
let smartID1='';  // declare empty string
let smartID2='';  // declare empty string
let smartID3='';  // declare empty string

for(var i = 0; i < 8; i++) {  // loop 8 times
    smartID1 += letters.charAt(Math.floor(Math.random() * letters.length));  // Concatanate Combo
    smartID2 += letters.charAt(Math.floor(Math.random() * letters.length));  // Concatanate Combo
    smartID3 += letters.charAt(Math.floor(Math.random() * letters.length));  // Concatanate Combo
}

export const smartIDOptions = readable([
  smartID1,
  smartID2,
  smartID3
]);


// Store values for Step Two (address step)
export const address = writable({
  nickname: '', // optional
  line_one: '',
  line_two: '', // optional
  unit_number: '', // optional
  business_name: '', // optional
  attention_to: '', // optional
  city: '',
  state: '',
  zip_code: '',
  country: 'United States',
  phone: '', // optional
});

export const validAddress = writable(yup.object().shape({
  nickname: yup.string(),
  line_one: yup.string().required("Address line 1 required"),
  line_two: yup.string(),
  unit_number: yup.string(),
  business_name: yup.string(),
  attention_to: yup.string(),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zip_code: yup.string()
    .required("Zip code is required")
    .min(5, "Zip code must be at least 5 characters"),
  country: yup.string().required("Country is required"),
  // phone: yup.string().matches(phoneRegExp, "Phone number is not valid")
  phone: yup.string()
}));
