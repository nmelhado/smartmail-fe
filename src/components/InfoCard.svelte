<script>
  export let frontHead, frontBody, rearHead, rearBody;
</script>

<style>
  h2 {
    color: var(--primaryAccent);
    font-size: 2.2em;
    margin: 28px auto 14px;
  }

  h2.rear {
    color: var(--white);
    font-size: 1.8em;
  }

  /* The flip card container - set the width and height to whatever you want. We have added the border property to demonstrate that the flip itself goes out of the box on hover (remove perspective if you don't want the 3D effect */
  .flip-card {
    background-color: transparent;
    width: 400px;
    height: 300px;
    perspective: 1000px; /* Remove this if you don't want the 3D effect */
  }

  /* This container is needed to position the front and back side */
  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 1.2s;
    transform-style: preserve-3d;
  }

  /* Do an horizontal flip when you move the mouse over the flip box container */
  .flip-card:hover .flip-card-inner {
    transition-delay: 0.5s;
    transform: rotateY(180deg);
  }

  /* Position the front and back side */
  .flip-card-front, .flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden; /* Safari */
    backface-visibility: hidden;
  }

  /* Style the front side (fallback if image is missing) */
  .flip-card-front {
    background-color: var(--veryLightGray);
    color: var(--darkGray);
    box-shadow: 0 0 16px -2px var(--gray)
  }

  /* Style the back side */
  .flip-card-back {
    transform: rotateY(180deg);
    background-color: var(--primaryAccent);
    color: var(--veryLightGray);
    box-shadow: 0 0 16px 0 var(--gray)
  }

  p {
    margin: 0 30px;
    text-align: center;
  }
</style>

<div class="flip-card">
  <div class="flip-card-inner">
    <div class="flip-card-front">
      <h2>{@html frontHead}</h2> 
      <p>{@html frontBody}</p> 
    </div>
    <div class="flip-card-back">
      <h2 class="rear">{@html rearHead}</h2> 
      <p>{@html rearBody}</p> 
    </div>
  </div>
</div>