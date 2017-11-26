
function searchRecords() {
  this.result = this.service.searchRecords(this.needle.toUpperCase());
}

function mapGenre(idx) {
  return this.service.getGenres()[idx];
}

Vue.component('music-search', {
  template: `
    <div>
      <form @submit.prevent="search()">
        <div class="form-group">
          <label class="sr-only" for="needle">Looking for</label>
          <input type="text" class="form-control" id="needle" v-model="needle" placeholder="Artist, title, ...">
        </div>
        <button type="submit" class="btn btn-default" aria-label="Searcg">
          <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
        </button>
      </form>
      <hr/>
      <table class="table table-striped" v-if="result &amp;&amp; result.length > 0">
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Genre</th>
            <th>Location</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in result">
            <td>{{record.title}}</td>
            <td>{{record.artist}}</td>
            <td>{{mapGenre(record.genre)}}</td>
            <td>{{record.location}}</td>
            <td>&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  props: ['service'],
  data: function () {
    return {
      result: [],
      needle: null
    };
  },
  methods: {
    search: searchRecords,
    mapGenre: mapGenre
  }
})
