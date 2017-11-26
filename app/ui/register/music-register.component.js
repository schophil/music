function register() {
  this.$emit('register', this.record);
}

Vue.component('music-register', {
  template: `
  <form class="form-horizontal" @submit.prevent="register()">
    <div class="form-group">
      <label class="col-sm-2 control-label" for="title">Title</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="title" v-model="record.title">
      </div>
    </div>
    <div class="form-group">
      <label class="col-sm-2 control-label" for="title">Artist</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="artist" v-model="record.artist">
      </div>
    </div>
    <div class="form-group">
      <label class="col-sm-2 control-label" for="genre">Genre</label>
      <div class="col-sm-10">
        <select class="form-control" id="genre" v-model="record.genre">
          <option v-bind:value="index" v-for="(genre, index) in genres">{{genre}}</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="col-sm-2 control-label" for="title">Location</label>
      <div class="col-sm-10">
        <input type="text" class="form-control" id="location" v-model="record.location">
      </div>
    </div>
    <div class="form-group">
      <div class="col-sm-offset-2 col-sm-10">
        <button type="submit" class="btn btn-default" aria-label="Register">
          <span class="glyphicon glyphicon-save" aria-hidden="true"></span>
        </button>
        <span class="glyphicon glyphicon-ok" aria-hidden="true" v-if="saved"></span>
      </div>
    </div>
  </form>
  ` ,
  props: ['record', 'genres'],
  data: function () {
    return {
      saved: false
    };
  },
  methods: {
    register: register
  }
});
