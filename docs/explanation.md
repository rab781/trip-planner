# Explanation: Nearest-Neighbor Routing Algorithm

The system uses a nearest-neighbor approach to sort destinations.

## How It Works

1.  **Grouping**: Destinations are first grouped by their `zone_id`.
2.  **Distance Calculation**: The system calculates the distance between coordinates.
3.  **Sorting**: Within each zone, destinations are ordered to minimize the distance from the previous point.
4.  **Transport Cost**: The system estimates the cost based on distance and passenger count.
