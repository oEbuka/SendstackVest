# Split Payments API

## Overview

The Split Payments API provides an endpoint for computing split payments for a transaction. This API supports three types of split entities: Flat, Percentage, and Ratio.

## API Endpoint

The API endpoint for computing split payments is `/split-payments/compute`.

## Request Body

The request body should be a JSON object with the following properties:

- **ID:** The transaction ID
- **Amount:** The transaction amount
- **Currency:** The transaction currency
- **CustomerEmail:** The customer's email address
- **SplitInfo:** An array of split entities

### Split Entity Properties

Each split entity should be a JSON object with the following properties:

- **SplitType:** The type of split entity: Flat, Percentage, or Ratio
- **SplitValue:** The value of the split entity
- **SplitEntityId:** The ID of the split entity

### Flat Split Entity

A Flat split entity specifies a fixed amount to split from the transaction amount. For example, a Flat split entity with a SplitValue of 100 would split $100 from the transaction amount.

### Percentage Split Entity

A Percentage split entity specifies a percentage of the transaction amount to split. For example, a Percentage split entity with a SplitValue of 50 would split 50% of the transaction amount.

### Ratio Split Entity

A Ratio split entity specifies a ratio of the total split amount to split. The ratio split amounts are computed after all other split amounts have been computed. For example, two Ratio split entities with SplitValues of 1 and 2 would split the remaining balance in a 1:2 ratio.

## Response Body

The response body is a JSON object with the following properties:

- **ID:** The transaction ID
- **Balance:** The remaining balance after computing all split amounts
- **SplitBreakdown:** An array of split entities with their respective amounts

## Error Responses

The API will return a `400 Bad Request` error if any of the following conditions are met:

- The transaction data is missing or invalid
- The number of split entities is less than 1 or greater than 20
- A split entity is missing or invalid
- A split entity has an invalid split type
- A split amount is greater than the transaction amount
- A split amount is less than 0
- The sum of split amounts is greater than the transaction amount
