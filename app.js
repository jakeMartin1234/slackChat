



require('dotenv').config;
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const async = require('async');
const mongoPass = process.env.MONGOPASS;
const mongoUser = process.env.MONGOUSER;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let client = null;
let collection = null;

const uri = `mongodb+srv://${mongoUser}:${mongoPass}@slackchatdb.ruied.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;






// Connect to Mongo server instance


const questionBlock = {
  "blocks": [
    {
      "type": "section",
      "block_id": "first",
      "text": {
        "type": "mrkdwn",
        "text": "Welcome. How are you doing?"
      },
      "accessory": {
        "type": "static_select",
        "placeholder": {
          "type": "plain_text",
          "text": "Select options",
          "emoji": true
        },
        "options": [
          {
            "text": {
              "type": "plain_text",
              "text": "Doing Well",
              "emoji": true
            },
            "value": "value-0"
          },
          {
            "text": {
              "type": "plain_text",
              "text": "Neutral",
              "emoji": true
            },
            "value": "value-1"
          },
          {
            "text": {
              "type": "plain_text",
              "text": "Feeling Lucky",
              "emoji": true
            },
            "value": "value-2"
          }
        ],
        "action_id": "firstQuestion"
      }
    },
    {
      "type": "section",
      "block_id": "second",
      "text": {
        "type": "mrkdwn",
        "text": "What are your favorite hobbies?"
      },
      "accessory": {
        "type": "static_select",
        "placeholder": {
          "type": "plain_text",
          "text": "Select options",
          "emoji": true
        },
        "options": [
          {
            "text": {
              "type": "plain_text",
              "text": "Football",
              "emoji": true
            },
            "value": "value-0"
          },
          {
            "text": {
              "type": "plain_text",
              "text": "Music",
              "emoji": true
            },
            "value": "value-1"
          },
          {
            "text": {
              "type": "plain_text",
              "text": "Sleep",
              "emoji": true
            },
            "value": "value-2"
          },
          {
            "text": {
              "type": "plain_text",
              "text": "Movies",
              "emoji": true
            },
            "value": "value-3"
          },
          {
            "text": {
              "type": "plain_text",
              "text": "Basketball",
              "emoji": true
            },
            "value": "value-4"
          }
        ],
        "action_id": "secondQuestion"
      }
    }
  ]
};


const secondResonse = {
    "replace_original": "true",
    "text": "Thanks for your request, we'll process it and get back to you."
};

// async functions 

async function mongoConnectClientAndCollection() {
  console.log(":::::::client");
  client = await new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  console.log(":::::::connect");
  await client.connect();
  console.log(":::::::collection");
  collection = await client.db("slackBotDB").collection("entries");
};

async function mongoClose() {
  //console.log(":::::::close");
  await client.close();
  
};

async function mongoInsert(dbJson) {

  console.log(":::::::insert");
  await collection.insertOne(dbJson);

};

async function mongoUpdate(dbJson, channelID) {

  console.log(":::::::update");
  await collection.updateOne({channelID: channelID}, dbJson)

};

async function mongoFind(dbJson) {
  var ret = true;
  console.log(":::::::find");
  var findRes = await collection.findOne(dbJson);
  console.log(findRes);
  
  return findRes;
};

async function mongoFoundAndUpdate(foundDB, dbJson, channelID) {
  if (await mongoFound(foundDB)) {
    await mongoUpdate(dbJson, channelID);
  }
}

// end of async functions  


app.post('/bot', async function (req, res) {
  var client;
  var collection;
  if (req.body.text == "hello") {
    //console.log(req.body);
    //console.log("notcrashing on itit");
    
    //console.log("bot function req:::::" + JSON.stringify(req.body));

    await mongoConnectClientAndCollection();
    

    var found = await eval(mongoFind({channelID: req.body.channel_id, username: req.body.user_name, userID: req.body.user_id}));
    console.log("found::::" + found);
    if (found == null) {
      await mongoInsert({channelID: req.body.channel_id, username: req.body.user_name, 
      userID: req.body.user_id, first: "no_response", second: "noResponse"}, req.body.channel_id);
    };
    
    await mongoClose();
    res.json(questionBlock);

    


  } else {
     res.send("Please type '/bot hello' to activate SlackChat!");
  }
  
  
});

// https://api.slack.com/messaging/interactivity#interaction << this where i found the info on how to update.

app.post('/interaction', async function (req, res) {
  // if it has a payload i enter
  console.log(req.body);
  try {
    var pack = JSON.parse(req.body.payload);
    var channelID = pack.channel.id;
    var username = pack.user.username;
  } catch {
    res.send("configure payload correctly");
    return;
  }
  
  var userID = pack.user.id;
  console.log("channel id::::: " + pack.channel.id);
  var selOption1 = pack.state.values.first.firstQuestion.selected_option;
  var selOption2 = pack.state.values.second.secondQuestion.selected_option;

  await mongoConnectClientAndCollection();

  var found = await eval(mongoFind({username: username, channelID: channelID, userID: userID}));

  if (found != null) {
    res.send("interaction received");
    await mongoUpdate({ $set: {channelID: channelID, first: selOption1, second: selOption2}}, channelID);
  } else {
    res.send("interaction not received");
  };
  await mongoClose();
  
    
  
});

// api calls below this.

// decided against doing user_id not sure if correct
async function getResponse(userName, channelID) {
  await mongoConnectClientAndCollection();

  var res = await eval(mongoFindOne({username: userName, chanelID: channelID}));
  await mongoClose();
  return res;

}

async function getUser(userName) {
  await mongoConnectClientAndCollection();

  var res = await eval(mongoFindMany({username: userName}));
  await mongoClose();
  return res;

}



module.exports = app;