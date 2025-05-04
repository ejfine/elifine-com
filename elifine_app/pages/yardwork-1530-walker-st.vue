<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <!-- Header with enhanced typography and spacing -->
    <h1 class="text-4xl font-bold text-gray-800 mb-6">Yardwork for 1530 Walker St</h1>

    <!-- Main content wrapped in a paragraph for better semantics and centered text -->
    <p class="text-center text-gray-600 text-lg max-w-2xl">
      <br />The yard is pretty shaded and doesn't grow quickly, so it doesn't lend itself well to a regular schedule.
      Over the past few years, there's typically 4-5 times during the spring/summer/fall where the grass needs to be
      cut, and 3-4 times during the fall/winter where the leaves need to be cleaned up.<br /><br />We're looking for a
      maintenance team who is comfortable with us requesting a visit 3-4 weeks ahead of time and being able to fit us
      somewhere on their schedule when they're in the area anyway. For example: "We'd like the leaves cleaned up the
      week before Halloween, are you available anytime October 27-31?"
    </p>
    <br />

    There are five different 'sections' of our yard that need various maintenance throughout the year:<br />
    <ul class="list-disc pl-5">
      <li>Front yard: mow, weed whack around the fence (summer). leaf cleanup (fall)</li>
      <li>Side yard: mow, weed whack around the fence (summer). leaf cleanup (fall)</li>
      <li>Upper backyard: mow, leaf cleanup</li>
      <li>Driveway Hedges: weed whack underneath, trim hegdes (1-2 times per season)</li>
      <li>Playground: Blow off the playground surface, mow the grass around it</li>
    </ul>
    <br />

    <h2 class="text-2xl font-bold text-gray-800 mb-6">Property Overview</h2>
    <img src="/yard/yardwork.png" width="50%" />
    <b>Front Yard</b><img src="/yard/front-yard.jpg" width="50%" /><br />
    <b>Side Yard</b><img src="/yard/side-yard.jpg" width="50%" /><br />
    <b>Upper Backyard</b><img src="/yard/upper-backyard.jpg" width="50%" /><br />
    <b>Driveway Hedges</b><img src="/yard/driveway-hedges.jpg" width="50%" /><br />
    <b>Playground</b><img src="/yard/playground.jpg" width="50%" /><br />
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "yard",
});
</script>
