<script>
  import { stores } from '@sapper/app';
  const { page } = stores();
  $: {
    if (typeof gtag !== "undefined"){
      gtag("config", "UA-163350265-1", {
        page_path: $page.path == '/' ? '/home' : $page.path
      });
    }
  }
</script>