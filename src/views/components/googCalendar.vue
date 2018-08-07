<template>
<div class="google">
  <h3>API</h3>
  <div class="button-field">
    <button @click="handleClientLoad">Client Load</button>
    <button v-if="isSignedIn" @click="handleSignoutClick">Sign Out</button>
    <button v-else @click="handleAuthClick">Authorize</button>
    <button @click="listUpcomingEvents">listUpcomingEvents</button>
    <button @click="insertEvent">insertEvent</button>
  </div>
  <div class="content">{{content}}</div>
</div>
</template>

<script>
import { CLIENT_ID, API_KEY } from '../../config/google-api-client-secret.json'

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendarId = 'primary';

export default {
  data() {
    return {
      content: '',
      isSignedIn: false,
    }
  },

  methods: {
    handleAuthClick() {
      gapi.auth2.getAuthInstance().signIn();
    },

    handleSignoutClick() {
      gapi.auth2.getAuthInstance().signOut();
    },

    updateSigninStatus(val) {
      this.isSignedIn = val;
    },

    handleClientLoad() {
      gapi.load('client:auth2', this.initClient);
    },

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    initClient() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        })
        .then(() => {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

          // Handle the initial sign-in state.
          this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    },

    listUpcomingEvents() {
      gapi.client.calendar.events
        .list({
          calendarId,
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        })
        .then((response) => {
          const events = response.result.items;
          console.log('--- calendar.events.list ---');
          console.log(response);
        });
    },

    insertEvent() {
      const resource = {
        'summary': 'Google I/O 2015',
        'description': 'A chance to hear more about Google\'s developer products.',
        'start': {
          'date': '2015-05-28',
        },
        'end': {
          'date': '2015-05-28',
        }
      };

      gapi.client.calendar.events
        .insert({
          calendarId,
          resource
        })
        .then((response) => {
          console.log('--- calendar.events.insert ---');
          console.log(response);
        });
    }
  },
}
</script>

<style lang="scss">
.google {
  width: 40%;
  margin: auto;
}
</style>

