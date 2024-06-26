<script>
	import { stores } from '@sapper/app';
	import { post } from '../utils/helper.js';
  import * as yup from 'yup';
  import Textfield from '@smui/textfield';
  import CharacterCounter from '@smui/textfield/character-counter/index';
  import HelperText from '@smui/textfield/helper-text/index';
  import Button, {Label} from '@smui/button';
  import { Icon as CommonIcon } from '@smui/common';
  import { onMount, onDestroy } from 'svelte';

	const { session } = stores();

  let verifiedUser = false;
  async function  verifyCaptcha(resp) {
    const response = await post(`api/manage/confirm_captcha`, { key: resp });
    if (response.success) {
      invalidCaptcha = false;
      verifiedUser = true;
      return true;
    }
    verifiedUser = false;
    return false;
  }

  function expireCaptcha() {
    verifiedUser = false;
  }

  onMount(() => {
    if (typeof window !== 'undefined') {
      window.verifyCaptcha = verifyCaptcha;
      window.expireCaptcha = expireCaptcha;
    }
  })

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.verifyCaptcha = null;
      window.expireCaptcha = null;
    }
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

  let invalidFirstName, invalidLastName, invalidMessage, invalidReplyTo, invalidCaptcha = false;
  let errorFirstName, errorLastName, errorMessage, errorReplyTo = "";
  
  function verify() {
    invalidFirstName, invalidLastName, invalidMessage, invalidReplyTo, invalidCaptcha = false;
    validContact.validate(contact, {abortEarly: false})
    .then(function() {
      if (verifiedUser) {
        submit();
      } else {
        invalidCaptcha = true;
      }
    })
    .catch(function(err) {

      for (const error of err.inner) {
        switch (error.path) {
          case "firstName":
            invalidFirstName = true;
            errorFirstName = error.message;
            break;
          case "lastName":
            invalidLastName = true;
            errorLastName = error.message;
            break;
          case "message":
            invalidMessage = true;
            errorMessage = error.message;
            break;
          case "replyTo":
            invalidReplyTo = true;
            errorReplyTo = error.message;
            break;
          default:
            break;
        }
      }
    });
  }

  let messageSent = false;

	async function submit() {
		const response = await post(`api/manage/contact`, { contact });
		if (response.accepted.length > 0) {
			messageSent = true;
		}
  }

  $: innerWidth = 0
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

  .invalidCaptcha {
    box-shadow: 0 0 10px darkred;
  }
</style>

<svelte:window bind:innerWidth />

<div id={$session.mobile || innerWidth < 825 ? "contactM" : "contact"}>
  {#if $session.mobile || innerWidth < 825}
    <div id="top">
      <div id="topInner">
      {#if messageSent}
        <h1 class={$session.mobile || innerWidth < 825 ? "h1M" : "" }>Thank you!</h1>
        <h2 class={$session.mobile || innerWidth < 825 ? "h2M" : "" }>Your message has been sent</h2>
      {:else}
        <h2 class={$session.mobile || innerWidth < 825 ? "h2M" : "" }>Send Us a Message</h2>

        <form on:submit|preventDefault={verify}>
          <div class="centerBlock">
            <div class="halfWidthContainer">
              <Textfield input$name="first-name" name="first-name" variant="outlined" label="First name" bind:invalid="{invalidFirstName}" class="fullWidth" bind:value={contact.firstName} on:change={()=>invalidFirstName=false}>
                <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
                  {errorFirstName}
                </HelperText>
              </Textfield>
            </div>
            <div class="halfWidthContainer">
              <Textfield input$name="last-name" variant="outlined" label="Last name" bind:invalid="{invalidLastName}" class="fullWidth" bind:value={contact.lastName} on:change={()=>invalidLastName=false}>
                <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
                  {errorLastName}
                </HelperText>
              </Textfield>
            </div>
          </div>
          <Textfield input$name="email" variant="outlined" type="email" bind:invalid="{invalidReplyTo}" class="fullWidth" bind:value={contact.replyTo} on:change={()=>invalidReplyTo=false}>
            <svelte:fragment slot="label">
              <CommonIcon
                class="material-icons"
                style="font-size: 1em; line-height: normal; vertical-align: top;"
                >email</CommonIcon
              > Email
            </svelte:fragment>
            <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
              {errorReplyTo}
            </HelperText>
          </Textfield>
          <Textfield textarea fullwidth input$maxlength="250" input$name="message" variant="outlined" label="Message" bind:invalid="{invalidMessage}" class="fullWidth" bind:value={contact.message} on:change={()=>invalidMessage=false}>
            <CharacterCounter>0 / 250</CharacterCounter>
            <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
              {errorMessage}
            </HelperText>
          </Textfield>
          <div id="buttonsTop">
            <div class="g-recaptcha inline" data-sitekey="6LepjegUAAAAAMyOZHnM6bEQpwi5qtHL_Fh9gz2D" data-callback="verifyCaptcha" data-expired-callback="expireCaptcha"></div><br>
            <Button touch color="secondary" class={$session.mobile || innerWidth < 825 ? "submitButton" : "submitButton contactSubmit" } variant="unelevated"><Label class="submitButtonLabel">Send Message</Label></Button>
          </div>
        </form>
        <script src='https://www.google.com/recaptcha/api.js'></script>
      {/if}
      </div>
    </div>
  {/if}
  <div id={$session.mobile || innerWidth < 825 ? "bottom" : "left"}>
    <div id={$session.mobile || innerWidth < 825 ? "bottomInner" : "leftInner"}>

      <h3 class="contactHeader">Email Us</h3>
      <p class="contactBody">
        <a href="mailto:info@smartmail.co?Subject=Reaching%20Out" target="_top">info@smartmail.co</a>
      </p>
    </div>
  </div>

  {#if !$session.mobile && innerWidth >= 825}
    <div id="right">
      <div id="rightInner">
      {#if messageSent}
        <h1>Thank you!</h1>
        <h2>Your message has been sent</h2>
      {:else}
        <h2>Send Us a Message</h2>
       
        <form on:submit|preventDefault={verify}>
          <div class="centerBlock">
            <div class="halfWidthContainer">
              <Textfield input$name="first-name" name="first-name" variant="outlined" label="First name" bind:invalid="{invalidFirstName}" class="fullWidth" bind:value={contact.firstName} on:change={()=>invalidFirstName=false}>
                <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
                  {errorFirstName}
                </HelperText>
              </Textfield>
            </div>
            <div class="halfWidthContainer">
              <Textfield input$name="last-name" variant="outlined" label="Last name" bind:invalid="{invalidLastName}" class="fullWidth" bind:value={contact.lastName} on:change={()=>invalidLastName=false}>
                <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
                  {errorLastName}
                </HelperText>
              </Textfield>
            </div>
          </div>
          <Textfield input$autocomplete="email" variant="outlined" type="email" bind:invalid="{invalidReplyTo}" class="fullWidth" bind:value={contact.replyTo} on:change={()=>invalidReplyTo=false}>
            <svelte:fragment slot="label">
              <CommonIcon
                class="material-icons"
                style="font-size: 1em; line-height: normal; vertical-align: top;"
                >email</CommonIcon
              > Email
            </svelte:fragment>
            <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
              {errorReplyTo}
            </HelperText>
          </Textfield>
          <Textfield textarea fullwidth input$maxlength="250" input$name="message" variant="outlined" label="Message" bind:invalid="{invalidMessage}" class="fullWidth" bind:value={contact.message} on:change={()=>invalidMessage=false}>
            <CharacterCounter>0 / 250</CharacterCounter>
            <HelperText class="fullWidth errorHelper" validationMsg slot="helper">
              {errorMessage}
            </HelperText>
          </Textfield>
          <div id="buttonsRight">
            <div class="g-recaptcha inline {invalidCaptcha ? "invalidCaptcha" : ""}" data-sitekey="6LepjegUAAAAAMyOZHnM6bEQpwi5qtHL_Fh9gz2D" data-callback="verifyCaptcha" data-expired-callback="expireCaptcha" on:change={()=>invalidCaptcha=false}></div><br>
            <Button touch color="secondary" class="submitButton contactSubmit" variant="unelevated"><Label class="submitButtonLabel">Send Message</Label></Button>
          </div>
        </form>
        <script src='https://www.google.com/recaptcha/api.js'></script>
      {/if}
      </div>
    </div>
  {/if}
</div>