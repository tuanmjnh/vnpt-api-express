// this code will turn an OUT cursor from the node-oracledb library
// and turn the data into an array objects that has the structure of
// [{NAME: value, NAME_2: value, NAME_N: value}, ...]
// where the NAME is the column name returned through the cursor
//
// Distributed freely under MIT License <http://mutedsolutions.mit-license.org>
// Copyright 2016 Muted Solutions, LLC. All Rights Reserved.

const EventEmitter = require('events');
const util = require('util');
const _ = require('underscore');

// Config
// ------

const defaultNumRows = 500;

// Cursor
// ------

function Cursor(o_cursor, options) {
  EventEmitter.call(this);

  this.options = _.defaults({}, options, {
    numRows: defaultNumRows
  });

  this.o_cursor = o_cursor;
  this._configure(o_cursor.metaData);
}

util.inherits(Cursor, EventEmitter);

// Methods
// -------

Cursor.prototype.read = function(cb) {
  var numRows = this.options.numRows;
  this._fetchRows(numRows, cb);
};

Cursor.prototype.close = function(cb) {
  this.o_cursor.close((err) => {
    if (err) { return cb(err); }
    return cb();
  });
}

// Private API
// -----------

Cursor.prototype._fetchRows = function(numRows, done) {
  this.o_cursor.getRows(numRows, (err, rows) => {
    if (err) { return this.emit('error', err); }

    if (rows.length === 0) {
      return this.close(done);
    }

    rows.forEach((row) => {
      var rowData = this._getRowData(row);
      this.emit('data', rowData);
    });

    this._fetchRows(numRows, done);
  });
}

Cursor.prototype._configure = function(metaData) {
  this._columnConfig = metaData;
};

Cursor.prototype._getRowData = function(row) {
  var rowData = {};
  row.forEach((dataPoint, index) => {
    var rowConfig = this._columnConfig[index];
    rowData[rowConfig.name] = dataPoint;
  });
  return rowData;
};

// Exports
// -------

module.exports = Cursor;
