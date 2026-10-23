# Explanation: Itinerary Generation Architecture

This document explains the architecture behind how the Itinerary Management System creates realistic, optimized travel plans.

## The Problem
Generating a multi-day itinerary isn't just about grouping random destinations. It requires spatial awareness (grouping places that are close together) and pacing (not packing too much into one day).

## Hybrid Algorithmic and AI Approach

Our system uses a two-step hybrid approach:

1. **Pre-processing (Algorithmic Routing)**
   Before handing data to the AI, the backend groups selected destinations by their geographic `zone_id`. It then runs a nearest-neighbor sorting algorithm to arrange destinations in a logical physical sequence, minimizing zigzagging across a city.

2. **AI Enrichment (Chutes Integration)**
   Once the sequence is algorithmically optimized, the data is sent to the Chutes AI API. The AI acts as a travel expert, assigning realistic time allocations, predicting costs based on the `pax_count`, and adding narrative descriptions for the route.

## Why Not Pure AI?
LLMs are excellent at writing descriptions and estimating generic costs, but they often struggle with precise geographic routing and mapping matrix math. By handling the routing algorithmically on the backend first, we ensure the itinerary is physically viable before the AI enriches it.
