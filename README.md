# Vinosmith Live Portfolio

[![Video introduction](/public/vimeoscreenshot.png)](https://vimeo.com/833765613/145fb134dc "Click to watch!")

## The Problem
A wine distributor faces a difficult question: how do I communicate my portfolio to clients in way that reflects current inventory? Wine is ever changing: each vintage is a completely different product, cuvée names may or may not be constant. By contrast, in the beer and liquor industry does not face this issue: an item does not change year to year, it simply exists or it doesn't, a producer does not rename it's products every year. Thus generating a client-facing portfolio of wines can be a constant, time consuming exercise. The distributor I work with, for example, manually generates an excel spreadsheet portfolio which is constantly updated via data entry. They also use Provi (formerly SevenFifty), a platform which I think better serves the beer and liquor community as it's best used as a catalogue of all products that a distributor has ever carried - it's a great platform to find a product and connect with that distributor, but for wine distributors, without constant updates, it can mean thousands of pages of wine including old vintages, cuvées and producers that no longer work with you. Enter Vinosmith, a complete wholesale wine management system: ordering, CRM, inventory, accounting and more - solutions for the wine industry specifically. Currently, as a client of a distributor using Vinosmith, you can log in to view invoices and pay securely, what you cannot do (which I'm sure will change) is connect in anyway with that distributor's inventory that is also housed on Vinosmith. 

## The Solution 
I've created an app that connects to a Vinosmith API (via Apiary) using a distributor's authentication token, retrieves relevant data and organizes it onto a database, from there it is then displayed in a table that is both filterable and searchable. Flask was used to create the backend, PostgreSQL for the database, React on the frontend with the help of Material UI. To avoid excess API calls and rate limits the app connects to Vinosmith once per hour via cron job to update the database, React connects to our own API. 

The Vinosmith API docs can be found here: https://vinosmith.docs.apiary.io/#. The database is organized as per the following diagram: 
![Database model](/public/databasediagram.png)
