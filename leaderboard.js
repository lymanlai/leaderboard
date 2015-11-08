// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Mongo.Collection("players");

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    players: function () {
      return Players.find({}, { sort: { score: -1, name: 1 } });
    },
    selectedName: function () {
      var player = Players.findOne(Session.get("selectedPlayer"));
      return player && player.name;
    }
  });

  Template.leaderboard.events({
    'click .inc': function () {
      Players.update(Session.get("selectedPlayer"), {$inc: {score: 5}});
    }
  });

  Template.player.helpers({
    selected: function () {
      return Session.equals("selectedPlayer", this._id) ? "selected" : '';
    }
  });

  Template.player.events({
    'click': function () {
      var newId = '';
      if( Session.get("selectedPlayer") != this._id ){
        newId = this._id;
      }
      Session.set("selectedPlayer", newId);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = [
                    "正跑五圈",
                    "倒跑五圈",
                    "带球正跑五圈",
                    "带球逆跑五圈",
                    "八字形正向运球20次",
                    "八字形倒向运球20次",
                    "八字形正向倒向混合运球20次",
                    "运球练习各100次"
                  ];
      _.each(names, function (name) {
        Players.insert({
          name: name,
          score: 0
        });
      });
    }
  });
}
