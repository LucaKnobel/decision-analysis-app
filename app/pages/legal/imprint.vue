<template>
  <div class="container max-w-3xl mx-auto px-4 py-10 space-y-8">
    <div class="space-y-2">
      <h1 class="text-3xl font-semibold">
        {{ $t('legal.imprintDetails.title') }}
      </h1>
    </div>

    <div class="rounded-lg border border-accented/60 bg-muted/20 p-6 space-y-2">
      <h2 class="text-lg font-semibold">
        {{ $t('legal.imprintDetails.responsible') }}
      </h2>
      <p class="text-sm">
        {{ $t('legal.imprintDetails.name') }}
      </p>
      <p class="text-sm">
        {{ $t('legal.imprintDetails.street') }}
      </p>
      <p class="text-sm">
        {{ $t('legal.imprintDetails.postal') }}
      </p>
      <p class="text-sm">
        {{ $t('legal.imprintDetails.country') }}
      </p>
      <p class="text-sm">
        <a
          class="text-primary underline-offset-4 hover:underline"
          :href="`mailto:${$t('legal.imprintDetails.email').replace('(at)', '@').replace(/\s+/g, '')}`"
        >
          {{ $t('legal.imprintDetails.email').replace('(at)', '@') }}
        </a>
      </p>
    </div>
  </div>
</template>
