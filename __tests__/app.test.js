const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app.js");
const request = require("supertest");
const articles = require("../db/data/test-data/articles.js");

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

//ticket #14 connecting to article:id AND ticket #5
describe("GET /api/articles/:article_id ON THIS ONE", () => {
  test("status: 200 - connecting to article endpoint", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual({
          article_id: 4,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 0,
          comment_count: expect.any(String),
        });
      });
  });

  //ticket #5 - getting comment count
  test("status: 200 - getting comment count ticket #5", () => {
    return request(app)
      .get("/api/articles/6")
      .expect(200)
      .then(({ body }) => {
        // console.log("comment count==>", body.articles.comment_count);
        expect(body.articles).toEqual({
          article_id: 6,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 0,
          comment_count: expect.any(String),
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
describe("PATCH /api/articles/:article_id", () => {
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

//ticket #21 - connecting to users
describe("GET /api/users", () => {
  test("status: 200 - connecting to endpoint successfully", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(4);
        body.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });

  test("status: 404 - can't find user endpoint", () => {
    return request(app)
      .get("/api/usurs")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

//ticket #9 - connecting to articles + ticket #10-refactor + ticket #16-refactor
xdescribe("GET /api/articles", () => {
  test("status: 200 - connecting to endpoint successfully + ticket #10 comment count + ticket #16 queries", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(12);
        body.forEach((article) => {
          console.log("comment count(ARTICLE OBJECT)==>", article);
          expect(article).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  //"?topic=order_by"
  //"?order=asc"
  //?sort_by=created_at&order=asc"
  test("status: 200 - articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=desc")
      .expect(200)
      .then(({ body }) => {
        // console.log("COMING FROM TEST====>", body);
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("status: 200 - accepts sortby query for votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        // console.log("COMING FROM TEST====>", body);
        expect(body).toBeSortedBy("votes", { descending: true });
      });
  });

  test("status: 200 - accepts order query for votes", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        console.log("COMING FROM TEST====>", body);
        expect(body).toBeSorted({ ascending: true });
      });
  });

  //make tests for getting a topic, and for the orders
  test("status: 200 - articles filtered by topic cats", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(1);
      });
  });

  //THIS TEST BREAKS IF I ADD THE PROMISE REJECT BACK IN FOR TICKET #16
  test("status: 200 - topic exists but no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        // console.log("TEST=======>", body);
        expect(body).toEqual([]);
      });
  });

  //STILL NOT WORKING
  test.only("status: 404 - non existant topic e.g bananas", () => {
    return request(app)
      .get("/api/articles?topic=NONEEXISTANT")
      .expect(404)
      .then(({ body }) => {
        console.log("COMING FROM TEST----->", body);
        expect(body.msg).toBe("Topic not found");
      });
  });

  test("status: 400 - invalid sortby query", () => {
    return request(app)
      .get("/api/articles?sort_by=potatos")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort query");
      });
  });

  test("status: 400 - invalid order query", () => {
    return request(app)
      .get("/api/articles?order=potatos")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
      });
  });
});

//ticket #15 - GET /api/articles/:article_id/comments
describe("GET /api/articles/:article_id/comments", () => {
  test("status 200 - got comments successfully", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(2);
        body.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              article_id: 3,
              created_at: expect.any(String),
            })
          );
        });
      });
  });

  //error handling - 404
  test("status 404 - comments not found", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comments not found");
      });
  });

  //error handling - 400
  test("status 400 - bad request", () => {
    return request(app)
      .get("/api/articles/potatoes")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

//ticket #11 - post new comment to article by id
describe("POST /api/articles/:article_id/comments", () => {
  test("status 200 - posted comment successfully", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ author: "icellusedkars", body: "Hello world!" })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          author: "icellusedkars",
          body: "Hello world!",
          article_id: 3,
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });

  //error handling 400
  test("status 400 - bad request(body)", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ author: "icellusedkars", body: "" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });

  //error handling 404
  test("status 400 - bad request(user)", () => {
    return request(app)
      .post("/api/articles/3/comments")
      .send({ author: "", body: "Hello world!" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

//in the for-each test for slug and description - test for data type not ACTUAL data
