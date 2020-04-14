
<div id="bg">
  <div id="inner">
    <SpinLine size="180" color="var(--secondary)" stroke="8px"></SpinLine>
  </div>
</div>

<style>
  #bg {
    position: fixed;
    background-color: rgba(80, 80, 80, 0.4);
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 98;
  }

  #inner {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
  }
</style>

<script>
  import {SpinLine} from 'svelte-loading-spinners'
</script>