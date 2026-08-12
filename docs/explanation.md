# Explanation: AI Itinerary Optimization

The AI itinerary generation algorithm follows a structured, logic-driven approach to minimize travel time and maximize convenience.

## How It Works

1. **Nearest-Neighbor Sorting**: For a given day, the selected destinations are sorted using a nearest-neighbor algorithm based on geographic coordinates. The algorithm starts with the first destination and continually finds the closest unvisited destination by calculating the distance between them.
2. **Cost Estimation Feedback**: The estimated average total cost is compared to a user-provided budget (if given) to calculate a budget status (`under_budget`, `within_budget`, or `over_budget`) and generate appropriate feedback tips.
