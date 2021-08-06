<template>
  <div class="hello">
      <ul v-if="event">
        <li v-for="(event, index) in events" :key="index">
            <p>{{event.EventService}}</p>
            <p>{{event.WEW}}</p>
        </li>
      </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import EventsService  from '../services/EventService';
import { EventItem } from '../types/EventItemType';
export default defineComponent({
  name: "HelloWorld",
  props: {
    // Props typing ( custom type )
    event: {
      type: Object as PropType<EventItem>,
      required: true
    }
  },
  data() {
    return {
      // data typing ( custom type )
      //events: {} as EventItem,
      events: [] as EventItem[],
    }
  },
  computed: {
    // returning CUSTOM TYPE
    // Computed property typing
    firstEvent(): EventItem {
      return this.events[0]
    }
  },
  methods: {
    async getEvents() {
      console.log('first');
      const events = await EventsService.getEvents();
      console.log('events', events.data);
      console.log('second');
    },
    // parameter typing ( custom type )
    addEvent(newEvent: EventItem) {
      this.events.push(newEvent)
    },
    // return typing ( custom type )
    secondEvent(): EventItem {
      return this.events[1]
    },
  },
  created() {
    this.getEvents();
  }
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>  
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
