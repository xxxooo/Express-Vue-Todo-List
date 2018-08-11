<template>
<div>
  <div class="button-field">
    <button @click="syncTodos" :disabled="!isSignedIn">
      <i class="icon icon-sync"></i>
      Sync with Google Calendar
    </button>
    <button v-if="isSignedIn" :disabled="isSync" @click="handleSignoutClick">
      <i class="icon icon-sign-out"></i>
      Sign Out
    </button>
    <button v-else @click="handleAuthClick">
      <i class="icon icon-authorize"></i>
      Authorize
    </button>
  </div>
</div>
</template>

<script>
import { CLIENT_ID, API_KEY } from '../../config/google-api-client-secret.json'

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendarId = 'primary';

export default {
  props: {
    todos: Array,
  },

  data() {
    return {
      isSignedIn: false,
      isSync: false,
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

    handleError(error) {
      console.log(error);
    },

    insertEvent(todo) {
      const resource = {
        summary: todo.title,
        description: todo.detail,
        start: {
          dateTime: `${todo.date}T00:00:00+08:00`,
        },
        end: {
          dateTime: `${todo.date}T23:59:59+08:00`,
        },
        transparency: todo.completed ? 'transparent' : 'opaque',
      };

      gapi.client.calendar.events
        .insert({
          calendarId,
          resource
        })
        .then((response) => {
          console.log('--- calendar.events.insert ---');
          const event = response.result;
          console.log(event);
          const partialTodo = {
            id: todo.id,
            creator: event.creator.displayName,
            eventId: event.id,
          };
          this.$store.dispatch('updateTodo', partialTodo);
        })
        .catch(this.handleError);
    },

    getEventSync(todo) {
      gapi.client.calendar.events
        .get({
          calendarId,
          eventId: todo.eventId
        })
        .then((response) => {
          console.log('--- calendar.events.get ---');
          const event = response.result;
          const eventTodo = {
            id: todo.id,
            title: event.summary,
            detail: event.description,
            creator: event.creator.displayName,
            date: event.start.dateTime.substr(0,10),
            completed: event.transparency && event.transparency === 'transparent',
            eventId: event.id,
          }
          this.$store.dispatch('updateTodo', eventTodo);
        })
        .catch(this.handleError);
    },

    syncTodos() {
      this.todos.forEach((todo) => {
        if (!todo.eventId) {
          this.insertEvent(todo);
        } else {
          this.getEventSync(todo);
        }
      });
    },
  },

  mounted() {
    gapi.load('client:auth2', this.initClient);
  }
}
</script>

<style lang="scss">
$color-white: #fff;
$color-gray50: #777;

.button-field {
  text-align: center;
  margin: 3em 0;

  button {
    display: block;
    margin: 1.25em auto;
    height: 2.5em;
    width: 50%;
    color: $color-gray50;
    background: $color-white;
    outline: none;
    border: 0;
    border-radius: 1em;
    box-shadow: 0.1em 0.2em 0.75em 0.1em rgba(0, 0, 0, 0.05);

    &[disabled] {
      box-shadow: none;
      opacity: 0.75;
    }

    &:hover {
      box-shadow:
        0.1em 0.2em 0.5em 0.1em rgba(0, 0, 0, 0.05),
        0 0.4em 3em 0 rgba(0, 0, 0, 0.1);
    }

    &:active {
      box-shadow: 0 0 0.5em 0 rgba(0, 0, 0, 0.05);
    }

    .icon {
      vertical-align: middle;
      margin-right: 0.25em;
    }
  }
}
</style>

