const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app.js");
const request = require("supertest");
//404 and 500 in own seperate describe
//request.get(url).expect(statuscode).then

//functions that seed tables and stop them hanging
beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

//ticket #3 connecting to topics
describe("GET /api/topics", () => {
  test("status: 200 - connecting to endpoint successfully", () => {
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
        });
      });
  });

  test("status: 404 - can't find endpoint", () => {
    return request(app)
      .get("/api/topiks")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

//ticket #14 connecting to article:id - happy path
describe("GET /api/articles/:article_id", () => {
  test("status: 200 - connecting to article endpoint", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual({
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });
  //unhappy path below
  test("error: 404 - article not found", () => {
    return request(app)
      .get("/api/articles/9000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });

  test("status:400 - responds with an error message when passed a bad request", () => {
    return request(app)
      .get("/api/articles/potato")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  //This test is linked to app.all (line 16 to 19) - any bad url given is handled there.
  test("status:404 - responds with an error when path not found", () => {
    return request(app)
      .get("/badroute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

//ticket #7 - patching article:id
describe.only("PATCH /api/articles/:article_id", () => {
  test("PATCH status: 200 - connecting to article endpoint", () => {
    const votesVar = { inc_votes: 1 }; //assigning object to votesVar variable
    return request(app)
      .patch("/api/articles/5") //made sure its .patch NOT .get at this endpoint
      .send(votesVar) //sending the votesVar variables as a request
      .expect(200)
      .then(({ body }) => {
        // console.log("HELLO FROMT TEST", body);
        expect(body).toEqual({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: "2020-08-03T13:14:00.000Z",
          votes: 1, //expecting updated votes value to be 1
        });
      });
  });
  //unhappy path
  test("PATCH error: 404 - article not found", () => {
    return request(app)
      .get("/api/articles/9000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });

  test("PATCH status:400 - responds with an error message when passed a bad request", () => {
    return request(app)
      .get("/api/articles/potato")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  //This test is linked to app.all (line 16 to 19) - any bad url given is handled there.
  test("PATCH status:404 - responds with an error when path not found", () => {
    return request(app)
      .get("/badroute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

//in the for each test for slug and description - test for data type not ACTUAL data
//THIS CODE WILL BE USEFUL FOR LATER ON TICKET #9
// describe.only("GET /api/articles/:article_id", () => {
//   test("status: 200 - connecting to article endpoint", () => {
//     return request(app)
//       .get("/api/articles/4")
//       .expect(200)
//       .then(({ body }) => {
//         expect(body).toHaveLength(12);
//         body.forEach((article) => {
//           expect(article).toEqual(
//             expect.objectContaining({
//               title: expect.any(String),
//               topic: expect.any(String),
//               author: expect.any(String),
//               body: expect.any(String),
//               created_at: expect.any(String),
//               votes: expect.any(Number),
//             })
//           );
//           // console.log("=================>", article);
//         });
//       });
//   });
