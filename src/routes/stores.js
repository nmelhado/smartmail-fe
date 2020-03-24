import { writable, readable } from 'svelte/store';
import * as yup from 'yup';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const stepOneComplete = writable(false);

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