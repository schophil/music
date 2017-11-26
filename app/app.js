require('./ui/search/music-search.component');
require('./ui/lookup/music-lookup.component');
require('./ui/register/music-register.component');

const MusicService = require('./music.service');

function showTab(tab) {
  this.tab = tab;
}

function isActiveTab(tab) {
  return this.tab === tab;
}

function copyRecord(original, copy) {
  copy.title = original.title;
  copy.artist = original.artist;
  copy.genre = original.genre;
  copy.location = original.location;
  return copy;
}

function resetRecord(record) {
  record.title = null;
  record.artist = null;
  record.location = null;
  record.genre = null;
}

function prepareRegister(record) {
  copyRecord(record, this.newRecord);
}

function registerRecord(record) {
  this.service.createRecord(copyRecord(record, {}));
  resetRecord(this.newRecord);
  this.saved = true;
  var vm = this;
  setInterval(function () {
    vm.saved = false;
  }, 1500);
}

var app = new Vue({
  el: '#app',
  data: {
    tab: 'search',
    newRecord: {
      title: null,
      artist: null,
      genre: null,
      location: null
    },
    genres: [],
    service: null
  },
  methods: {
    showTab: showTab,
    isActiveTab: isActiveTab,
    prepareRegister: prepareRegister,
    registerRecord: registerRecord
  },
  created: function () {
    this.service = new MusicService();
    this.genres = this.service.getGenres();
  }
});
