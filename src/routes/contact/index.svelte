<script>
	import { stores } from '@sapper/app';
	import ListErrors from '../../components/ListErrors.svelte';
	import { post } from '../utils/helper.js';
  import * as yup from 'yup';
  import Textfield from '@smui/textfield';
  import CharacterCounter from '@smui/textfield/character-counter/index';
  import Icon from '@smui/textfield/icon/index';  
  import Button, {Label} from '@smui/button';
  import Dialog, {Title, Actions, InitialFocus} from '@smui/dialog';
  import { onMount, onDestroy } from 'svelte';

	const { session } = stores();

  let verifiedUser = false;
  async function  verifyCaptcha(resp) {
    const response = await post(`api/manage/confirm_captcha`, { key: resp });
    if (response.success) {
      verifiedUser = true;
      return true;
    }
    return false;
  }

  function  expireCaptcha() {
    verifiedUser = false;
  }

  onMount(() => {
    window.verifyCaptcha = verifyCaptcha;
    window.expireCaptcha = expireCaptcha;
  })

  onDestroy(() => {
    window.verifyCaptcha = null;
    window.expireCaptcha = null;
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

  let messageSent = false;

	async function submit() {
		const response = await post(`api/manage/contact`, { contact });
		if (response.accepted.length > 0) {
			messageSent = true;
		}
  }
</script>

<svelte:head>
	<title>smartmail - Contact Us</title>
</svelte:head>

<style>
  h3 {
    font-size: 1.4em; 
    margin: 0.8em 0 .1em;
    color: var(--primaryAccent);
  }

  p {
    margin: 0 0 1.5em;
    padding-left: 1.5em;
    color: var(--veryDarkGray);
  }

  p a {
    color: var(--veryDarkGray);
  }
  .centerBlock {
    display: flex;
    justify-content: space-between;
  }

  #contact {
    display: flex;
    flex-wrap: wrap;
    min-height: calc(100vh - 248px)
  }

  #contactM {
    display: block;
    flex-direction: column;
    background: url(contact-back.jpg);
    background-repeat: no-repeat;
    background-size: auto auto;
    background-position: left top;
    background-attachment: fixed;
  }


  #left, #right {
    position: relative;
    display: inline-block;
    width: 50%;
    min-width: 350px;
  }

  #top, #bottom {
    padding: 2em 7.5%;
    width: 85%;
  }

  #top {
    border-bottom: solid 1px var(--primaryAccentFade);
  }

  #left {
    background: url(contact-back.jpg);
    background-repeat: no-repeat;
    background-size: auto 140%;
    background-position: left top;
    background-attachment: fixed;
    overflow: hidden;
    box-shadow: 1px 0px 0px 0px var(--primaryAccentFade);
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

  #buttonsRight {
    text-align: right;
  }

  #buttonsTop {
    text-align: center;
  }

  .inline {
    display: inline-block;
  }

  * :global(.contactSubmit) {
    margin-top: 4px;
  }

  .h1M {
    font-size: 2.0em;
  }

  .h2M {
    margin: 0 auto 1.5em;
    font-size: 1.8em;
  }
</style>
<div id={$session.mobile ? "contactM" : "contact"}>
  {#if $session.mobile}
    <div id="top">
      <div id="topInner">
      {#if messageSent}
        <h1 class={$session.mobile ? "h1M" : "" }>Thank you!</h1>
        <h2 class={$session.mobile ? "h2M" : "" }>Your message has been sent</h2>
      {:else}
        <h2 class={$session.mobile ? "h2M" : "" }>Send Us a Message</h2>

        <ListErrors {errors}/>

        <form on:submit|preventDefault={verify}>
          <div class="centerBlock">
            <Textfield input$name="first-name" name="first-name" variant="outlined" label="First name" invalid="{invalid["firstName"]}" class="halfWidth" bind:value={contact.firstName}/>
            <Textfield input$name="last-name" variant="outlined" label="Last name" invalid="{invalid["lastName"]}" class="halfWidth" bind:value={contact.lastName}/>
          </div>
          <Textfield input$name="email" variant="outlined" withLeadingIcon label="Your email" type="email" invalid="{invalid["email"]}" class="fullWidth" bind:value={contact.replyTo}>
            <Icon class="material-icons">email</Icon>
          </Textfield>
          <Textfield textarea fullwidth input$maxlength="250" input$name="message" variant="outlined" label="Message" invalid="{invalid["message"]}" class="fullWidth" bind:value={contact.message}>
            <CharacterCounter>0 / 250</CharacterCounter>
          </Textfield>
          <div id="buttonsTop">
            <div class="g-recaptcha inline" data-sitekey="6LepjegUAAAAAMyOZHnM6bEQpwi5qtHL_Fh9gz2D" data-callback="verifyCaptcha" data-expired-callback="expireCaptcha"></div><br>
            <Button color="secondary" class={$session.mobile ? "submitButton" : "submitButton contactSubmit" } variant="unelevated"><Label class="submitButtonLabel">Send Message</Label></Button>
          </div>
        </form>
        <script src='https://www.google.com/recaptcha/api.js'></script>
      {/if}
      </div>
    </div>
  {/if}
  <div id={$session.mobile ? "bottom" : "left"}>
    <div id={$session.mobile ? "bottomInner" : "leftInner"}>
      <h3 class="contactHeader">Address</h3>
      <p class="contactBody">
        <strong>Mailing Address:</strong><br>
        smrt mail<br>
        <br>
        <strong>Physical Address:</strong><br>
        Smartmail<br>
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

  {#if !$session.mobile}
    <div id="right">
      <div id="rightInner">
      {#if messageSent}
        <h1 class="text-xs-center">Thank you!</h1>
        <h2 class="text-xs-center">Your message has been sent</h2>
      {:else}
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
          <Textfield textarea fullwidth input$maxlength="250" input$name="message" variant="outlined" label="Message" invalid="{invalid["message"]}" class="fullWidth" bind:value={contact.message}>
            <CharacterCounter>0 / 250</CharacterCounter>
          </Textfield>
          <div id="buttonsRight">
            <div class="g-recaptcha inline" data-sitekey="6LepjegUAAAAAMyOZHnM6bEQpwi5qtHL_Fh9gz2D" data-callback="verifyCaptcha" data-expired-callback="expireCaptcha"></div><br>
            <Button color="secondary" class="submitButton contactSubmit" variant="unelevated"><Label class="submitButtonLabel">Send Message</Label></Button>
          </div>
        </form>
        <script src='https://www.google.com/recaptcha/api.js'></script>
      {/if}
      </div>
    </div>
  {/if}
</div>