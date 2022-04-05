
const app = require('./app.js');
const request = require('supertest');

describe("initialEntry", () => {

	// const OLD_ENV = process.env;

	// beforeEach(() => {
	// 	jest.resetModules()
	// 	process.env = {...OLD_ENV};
	// });

	// afterAll(() => {
	// 	process.env = OLD_ENV;
	// });

	test("empty Entry", async () => {
		const response = await request(app).post("/bot");
		expect(response.text).toBe("Please type '/bot hello' to activate SlackChat!");
	});

	test("proper Entry", async () => {
		const response = await request(app).post("/bot").send({
			text: "hello",
			channel_id: "TestingSystem",
			user_name: "jakesTestingSystem",
			user_id: "123456"
		});

	});
	
});

describe("secondary entry", () => {

	// const OLD_ENV = process.env;

	// beforeEach(() => {
	// 	jest.resetModules()
	// 	process.env = {...OLD_ENV};
	// });

	// afterAll(() => {
	// 	process.env = OLD_ENV;
	// });

	test("second Entry", async () => {
		const response = await request(app).post("/interaction").send({
			payload: JSON.stringify(payload1),
		});
		console.log("got response");
		expect(response.text).toBe("interaction received");
	});

	
});

const payload1 = {
	user: {
		id: '123456',
		username: "jakesTestingSystem"
	},
	channel: {
		id: "TestingSystem"
	},
	state: {
		values: {
			first: {
				firstQuestion: {
					selected_option: {
						"text": {
							"type": "plain_text",
							"text": "TEST Doing Well",
							"emoji": true
						},
						"value": "TESTvalue-0"
					}
				}
			},
			second: {
				secondQuestion: {
					selected_option: {
						"text": {
							"type": "plain_text",
							"text": "TEST BasketBall",
							"emoji": true
						},
						"value": "TESTvalue-1"
					}
				}
			}
		}
	}
};

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