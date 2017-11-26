function lookup() {
  this.result = [];
  if (this.discogsToken) {
    lookupWithDiscogs(this.barcode, this);
  } else if (this.searchUpcToken) {
    lookupWithSearchupc(this.barcode, this);
  }
}

// only called in case of discogs
function pick(item) {
  lookupDiscogsRelease(item.id, this);
}

function lookupWithSearchupc(barcode, vue) {
  vue.$http.get('http://www.searchupc.com/handlers/upcsearch.ashx?request_type=3&access_token=' + vue.searchUpcToken + '&upc=' + barcode)
  .then((response) => {
    // success callback
    response.json().then((data) => {
      vue.newRecord.title = data["0"].productname;
    });
  }, (response) => {
    // error callback
  });
}

function lookupWithDiscogs(barcode, vue) {
  discogsGet("/database/search?q=" + barcode +  "&barcode", vue).then((response) => {
    // success callback
    response.json().then((data) => {
      if (data.pagination.items == 1) {
        // pick the only item
        lookupDiscogsRelease(data.results[0].id, vue);
      } else {
        // let the user pick one
        data.results.forEach((item) => {
          vue.result.push({
            description: item.title + " " + item.type +  " " + item.year ,
            id: item.id
          });
        });
      }
    });
  }, (response) => {
    // error callback
  });
}

function lookupDiscogsRelease(release, vue) {
  discogsGet("/releases/" + release, vue).then((response) => {
    // success callback
    response.json().then((data) => {
      vue.record.title = data.title;
      vue.record.artist = data.artists.map((item) => item.name).join();
      vue.record.genre = mapGenre(data.genres, vue.genreMap);
      vue.$emit('pick', vue.record);
    });
  }, (response) => {
    // error callback
  });
}

function discogsGet(url, vue) {
  return vue.$http.get("https://api.discogs.com" + url, {
    headers: {
      Authorization: "Discogs token=" + vue.discogsToken
    }
  });
}

function mapGenre(genre, genreMap) {
  for (let i = 0; i < genre.length; i++) {
    let needle = genre[i].toUpperCase();
    let mapped = genreMap.findIndex((gg) => {
      return gg.toUpperCase().indexOf(needle) >= 0;
    });
    if (mapped) {
      return mapped;
    }
  }
}

Vue.component('music-lookup', {
  template: `
  <div>
    <form class="form-horizontal" @submit.prevent="lookup()">
      <div class="form-group">
        <label for="barcode" class="col-sm-2 control-label">Barcode</label>
        <div class="col-sm-10">
          <input type="barcode" class="form-control" id="barcode" v-model="barcode" placeholder="Barcode">
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
          <button type="submit" class="btn btn-default" aria-label="Search">
            <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    </form>
    <div class="panel panel-default" v-if="hasResult">
      <ul class="list-group">
        <li class="list-group-item" v-for="item in result">
          <a href="#" v-on:click.stop.prevent="pick(item)">({{item.id}}) {{item.description}}</a>
        </li>
      </ul>
    </div>
  </div>
  `,
  props: ['discogsToken', 'searchUpcToken', 'genreMap'],
  data: function () {
    return {
      result: [],
      barcode: null,
      record: {
        title: null,
        artist: null,
        genre: null,
        location: null
      }
    };
  },
  computed: {
    hasResult: function () {
      return this.result && this.result.length > 0;
    }
  },
  methods: {
    lookup: lookup,
    pick: pick
  }
});
