"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const request = require("supertest");
const expect = require("chai").expect;
const gamesService = require("../../src/services/games.js");
const userId = "test-user-id";
describe("/games", () => {
  let agent, app;
  before(() => {
    app = express();
    app.use(bodyParser.json());
    app.use((req, res, next) => {
      req.user = { id: userId };
      next();
    });
    const games = require("../../src/routes/games.js");
    app.use("/games", games);
  });
  beforeEach(() => {
    agent = request.agent(app);
  });
  describe("/:id DELETE", () => {
    it("should allow users to delete their own games", (done) => {
      const game = gamesService.create(userId, "test");
      agent
        .delete("/games/" + game.id)
        .expect(200)
        .expect(() => expect(gamesService.createdBy(userId)).to.be.empty)
        .end(done);
    });
  });
});
