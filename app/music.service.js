const low = require('lowdb');
const os = require('os');
const fs = require('fs');
const moment = require('moment');

const genres = [
  'Jazz',
  'New Age',
  'Classic',
  'Pop/Rock',
  'Hip Hop',
  'Metal'
];
const musicHome = os.homedir() + '/.music';
let db = null;

function initializeDb() {
  db = low(musicHome + '/musicdb.json', {
    storage: require('lowdb/lib/file-async')
  });
  db.defaults({ records: [] }).value();
}

fs.access(musicHome, (err) => {
  if (err) {
    fs.mkdir(musicHome, initializeDb);
  } else {
    initializeDb();
  }
});

function MusicService() {

  this.getGenres = function () {
    return genres;
  };

  this.searchRecords = function (word) {
    return db.get('records').filter(function (el) {
      return el.title.indexOf(word) >= 0 || el.artist.indexOf(word) >= 0;
    }).value();
  };

  this.createRecord = function (record) {
    db.get('records').push(this._prepare(record)).value();
  };

  this._prepare = function (record) {
    record.title = record.title.toUpperCase();
    record.artist = record.artist.toUpperCase();
    record.location = record.location.toUpperCase();
    record.id = moment().unix();
    return record;
  };
}

module.exports = MusicService;
