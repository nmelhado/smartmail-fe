<script>
	import { stores } from '@sapper/app';
	import ListErrors from '../components/ListErrors.svelte';
	import { post } from './utils.js';
  import * as yup from 'yup';
  import Textfield from '@smui/textfield';
  import Icon from '@smui/textfield/icon/index';  
  import Button, {Label} from '@smui/button';
  import Dialog, {Title, Actions, InitialFocus} from '@smui/dialog';
  import { onMount, onDestroy } from 'svelte';

  let verifiedUser = false;
  async function  verifyUser(resp) {
    const response = await post(`manage/confirm_captcha`, { key: resp });
    if (response.success) {
      verifiedUser = true;
      return true;
    }
    return false;
  }

  onMount(() => {
    window.verifyUser = verifyUser;
  })

  onDestroy(() => {
    window.verifyUser = null;
  })

  let contact = {
    firstName: '',
    lastName: '',
    message: '',
    replyTo: '',
  }
  
  const validContact = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    message: yup.string().required("Message is required"),
    replyTo: yup.string().required("Email is required").email("Email is not valid"),
  });

  let errors = [];
  let invalid = {
    firstName: false,
    lastName: false,
    message: false,
    replyTo: false,
    captcha: false,
  }

  let captchaFail = false;
  
  function verify(event) {
    validContact.validate(contact, {abortEarly: false})
    .then(function() {
      invalid = {
        firstName: false,
        lastName: false,
        message: false,
        replyTo: false,
        captcha: false,
      };
      errors = [];
      if (verifiedUser) {
        submit();
      } else {
        invalid.captcha = true;
        errors.push("Please prove you're not a robot!")
        captchaFail = true;
      }
    })
    .catch(function(err) {
      const tempInvalid = {
        firstName: false,
        lastName: false,
        message: false,
        replyTo: false,
        captcha: false,
      };
      const tempErrors = [];
      for (const error of err.inner) {
        if (!tempInvalid[error.path]) {
          tempInvalid[error.path] = true;
          tempErrors.push(error.message);
        }
      }
      invalid = tempInvalid;
      errors = tempErrors;
    });
  }

	async function submit() {
		const response = await post(`manage/contact`, { contact });

		// TODO handle network errors
    console.log(response)

		// if (response.user) {
		// 	$session.user = response.user;
		// 	$session.addresses = response.addresses;
		// 	goto('account');
		// }
  }
</script>

<svelte:head>
	<title>smartmail - Contact Us</title>
</svelte:head>

<style>
  .centerBlock {
    display: flex;
    justify-content: space-between;
  }

  #contact {
    display: flex;
    flex-wrap: wrap;
    min-height: calc(100vh - 248px)
  }

  #left, #right {
    position: relative;
    display: inline-block;
    width: 50%;
    min-width: 350px;
  }

  h2 {
    margin-top: 0;
  }

  #leftInner, #rightInner {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  #rightInner {
    min-width: 350px;
    width: 75%;
  }
</style>
<div id="contact">
  <div id="left">
    <div id="leftInner">
      <h3 class="contactHeader">Address</h3>
      <p class="contactBody">
        Smartmail<br>
        smartID: Smartmail<br>
        <br>
        251 1st Street, Unit 4E<br>
        Brooklyn, NY, 11215
      </p>

      <h3 class="contactHeader">Let's Talk</h3>
      <p class="contactBody">
        <a href="tel:+1347-638-4191">(347)638-4191</a>
      </p>

      <h3 class="contactHeader">Email Us</h3>
      <p class="contactBody">
        <a href="mailto:info@smartmail.co?Subject=Reaching%20Out" target="_top">info@smartmail.co</a>
      </p>
    </div>
  </div>

  <div id="right">
    <div id="rightInner">
      <h2 class="text-xs-center">Send Us a Message</h2>

      <ListErrors {errors}/>

      <form on:submit|preventDefault={verify}>
        <div class="centerBlock">
          <Textfield input$name="first-name" name="first-name" variant="outlined" label="First name" invalid="{invalid["firstName"]}" class="halfWidth" bind:value={contact.firstName}/>
          <Textfield input$name="last-name" variant="outlined" label="Last name" invalid="{invalid["lastName"]}" class="halfWidth" bind:value={contact.lastName}/>
        </div>
        <Textfield input$name="email" variant="outlined" withLeadingIcon label="Your email" type="email" invalid="{invalid["email"]}" class="fullWidth" bind:value={contact.replyTo}>
          <Icon class="material-icons">email</Icon>
        </Textfield>
        <Textfield input$name="message" variant="outlined" label="Message" invalid="{invalid["message"]}" class="fullWidth" bind:value={contact.message}/>
        <div class="g-recaptcha{captchaFail ? " fail" : ""}" data-sitekey="6LepjegUAAAAAMyOZHnM6bEQpwi5qtHL_Fh9gz2D" data-callback="verifyUser"></div>
        <Button color="secondary" class="submitButton" variant="unelevated"><Label class="submitButtonLabel">Send Message</Label></Button>
      </form>
      <script src='https://www.google.com/recaptcha/api.js'></script>
    </div>
  </div>
</div>