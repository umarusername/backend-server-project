const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app.js");
const request = require("supertest");
//404 and 500 in own seperate describe
//request.get(url).expect(statuscode).then

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("GET /api/topics", () => {
  test("status: 200 - connecting to endpoint no problem", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(3);
        body.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
          console.log("=================>", topic);
        }); //in the for each test for slug and description - test for data type not ACTUAL data
      });
  });
});
//check out express syntax
//now use express to check if this endpoint is giving back code 200
//and returning back the slug and description.
