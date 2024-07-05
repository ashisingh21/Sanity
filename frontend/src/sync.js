import { google } from 'googleapis';
import fs from 'fs';
import readline from 'readline';
import { createClient } from "next-sanity";

// Define constants
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

// Initialize Sanity client
const client = createClient({
    projectId:  "fbqjhpn5" ,
    dataset: "production",
    token: 'skeswn6IOmJ4OkmK5FO7VG5xxQwC1iuxXwSNe8nFfXPzziYFeHWaKSkhyfVdeGwBZISyqcAgpwL0S5ACAZXKyvpvQREleExfhZp55mnwVQbN7vZ3NVcEj2lqNIYs3cvI8GRCpzZaV3k8AASzvIS490p3l2sZh6ztDIy3kGezoZ9728eTCQZ5',
    useCdn: false,
    apiVersion: "2024-01-01",
});

// Load client secrets from a local file
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  authorize(JSON.parse(content), listMajors);
  console.log("client secrets loaded ========================================================================")
});

// Create an OAuth2 client with the given credentials and then execute the given callback function
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    (redirect_uris && redirect_uris[0]) || 'urn:ietf:wg:oauth:2.0:oob'
  );

  // Check if we have previously stored a token
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

// Get and store new token after prompting for user authorization, then execute the given callback with the authorized OAuth2 client
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

// Fetch data from the Google Sheet and sync it with Sanity
function listMajors(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  sheets.spreadsheets.values.get({
    spreadsheetId: '10p8jf9SDpG76iO_8akOn7CS1LjYEn9LvtbLUyfiKkhY', // Replace with your spreadsheet ID
    range: 'Sheet1!A2:G', // Adjust this range as needed
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      syncDataWithSanity(rows);
    } else {
      console.log('No data found.');
    }
  });
}

// Sync data with Sanity
async function syncDataWithSanity(rows) {
  for (const row of rows) {
    const [srNo, storeCode, location, city, outlet, state, pinCode] = row;
    if (storeCode && location && city && outlet && state) {
      try {
        // Create or update document in Sanity
        const docData = {
          _id: storeCode, // Use storeCode as the document ID
          _type: 'location',
          name: location,
          address: outlet,
          state: state,
          city: city,
          mapUrl: '', // Add other fields as needed
          image: null,
          zomato: 'https://www.zomato.com/mumbai/jimis-burger-andheri-lokhandwala',
          swiggy: 'https://www.swiggy.com/restaurants/jimis-burger-veera-desai-mumbai-33663',
          contact: '7738427090',
          timings: '11 am till 12 midnight',
          createdAt: new Date().toISOString()
        };
        await client.createOrReplace(docData);
      } catch (error) {
        console.error('Error syncing data with Sanity:', error);
      }
    }
  }
  console.log('Data sync complete.');
}
