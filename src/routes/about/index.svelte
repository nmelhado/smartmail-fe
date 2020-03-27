<script>
  import InfoCard from '../../components/InfoCard.svelte';

  // InfoCard text bodies
    // Mission Card
  const missionFHead = "Our Mission";
  const missionFBody =  "We want to make sending mail and packages " +
                        "<strong>simpler</strong> and <strong>faster</strong> " +
                        "for consumers.<br><br>We want to make shippers " +
                        "<strong>more efficient</strong>.<br><br>Finall, we want to " +
                        "<strong>cut environmental waste</strong> out of the " +
                        "shipping industry.";
  const missionRHead = "What That Means For You";
  const missionRBody = "This is the reason that our vision matters for you....";
</script>
  
<svelte:head>
	<title>smartmail - About</title>
</svelte:head>

<h1>About this site</h1>

<!-- Mission Card -->
<InfoCard frontHead={missionFHead} frontBody={missionFBody} rearHead={missionRHead} rearBody={missionRBody} />