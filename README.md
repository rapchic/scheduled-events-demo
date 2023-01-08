# Freshdesk Ticket Generation App - Scheduled Events Demo

This app is designed to generate a specified number of tickets in Freshdesk using the Freshdesk API. The app includes functionality to handle rate limiting errors by creating a schedule to generate the remaining tickets after a certain time period.

## Requirements

-   Freshdesk account with API key
-   Freshdesk API documentation

## Features

-   Generate a specified number of tickets in Freshdesk using the Freshdesk API
-   Handle rate limiting errors by creating a schedule to generate the remaining tickets after a certain time period

## Usage

1.  Install the app in your Freshdesk account
2.  Set the number of tickets you want to generate in the app's configuration
3.  Click the "Generate Tickets" button to begin generating tickets

## Code Structure

The app has the following functions:

-   `createTicket`: creates a single ticket with predefined parameters using the Freshdesk API
-   `createNTickets`: processes a specified number of `createTicket` function calls, catching any rate limiting errors
-   `smi`: creates a schedule to generate the remaining tickets after a certain time period in the event of a rate limiting error
-   `showNotification`: displays a notification to the user in the Freshdesk interface
-   `onAppActivate`: runs when the app is activated and fetches the logged in user's details

## Future Improvements

-   Allow user to customize ticket parameters (e.g. subject, description)
-   Add a progress bar to show the progress of ticket generation
