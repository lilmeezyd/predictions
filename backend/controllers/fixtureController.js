import asyncHandler from "express-async-handler";
import Fixture from "../models/fixtureModel.js";
import User from "../models/userModel.js";
import Matchday from "../models/matchdayModel.js";
import { updatePlayerPoints } from "../services/updatePlayerPoints.js";
import { updateWeeklyStandings } from "../services/updateWeeklyStandings.js";

//@desc Set Fixture
//@route POST /api/fixtures
//@access Private
//@role Admin
const setFixture = asyncHandler(async (req, res) => {
  const { matchday, kickOffTime, teamAway, teamHome } = req.body;
  if (!matchday || !kickOffTime || !teamAway || !teamHome) {
    throw new Error("Please add all fields");
  }
  if (teamAway.toString() === teamHome.toString()) {
    throw new Error("Home team and away team can not be the same!");
  }
  // Find user
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }
  // Make sure the logged in user is an ADMIN
  /* if (!Object.values(user.roles).includes(2048)) {
    res.status(401);
    throw new Error("Not Authorized");
  } */
  const fixture = await Fixture.create({
    matchday,
    kickOffTime,
    teamAway,
    teamHome,
  });

  //Update matchday deadline to an hour before first kickoff
  const fixtures = await Fixture.find({ matchday });
  const firstKickOff = fixtures.sort((x, y) => {
    if (x.kickOffTime > y.kickOffTime) return 1;
    if (x.kickOffTime < y.kickOffTime) return -1;
  })[0].kickOffTime;
  const deadline = new Date(firstKickOff);
  deadline.setMinutes(deadline.getMinutes() - 60);
  await Matchday.findByIdAndUpdate(matchday, { deadline }, { new: true });

  res.status(200).json(fixture);
});

//@desc Get Fixtures
//@route GET /api/fixtures
//@access public
//@role not restricted
const getFixtures = asyncHandler(async (req, res) => {
  const b = [];
  //const fixtures = await Fixture.find({});
  const fixtures = await Fixture.aggregate([
    { $group: { _id: "$matchday", fixtures: { $addToSet: "$$ROOT" } } },
  ]);
  /* await Matchday.populate(fixtures, { path: "_id" });
  fixtures.forEach((x) => {
    x.fixtures.sort((v, w) => (v.kickOffTime > w.kickOffTime ? 1 : -1));
    b.push(x);
  });
  res.status(200).json(b);*/
  res.status(200).json(fixtures);
});

//@desc Edit a specific fixture
//@route PUT /api/fixtures/:id
//@access private
//@role ADMIN, EDITOR
const editFixture = asyncHandler(async (req, res) => {
  const fixture = await Fixture.findById(req.params.id);
  const { matchday, kickOffTime, teamAway, teamHome } = req.body;
  if (!matchday || !kickOffTime || !teamAway || !teamHome) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  if (!req.user) {
    res.status(400);
    throw new Error("User not found");
  }
  if (!fixture) {
    res.status(400);
    throw new Error("Fixture not found");
  }
  const updatedFixture = await Fixture.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  //Update matchday deadline to an hour before first kickoff
  const fixtures = await Fixture.find({ matchday });
  const firstKickOff = fixtures.sort((x, y) => {
    if (x.kickOffTime > y.kickOffTime) return 1;
    if (x.kickOffTime < y.kickOffTime) return -1;
  })[0].kickOffTime;
  const deadline = new Date(firstKickOff);
  deadline.setMinutes(deadline.getMinutes() - 60);
  await Matchday.findByIdAndUpdate(matchday, { deadline }, { new: true });
  res.status(200).json(updatedFixture);
});

//@desc Set stats for a specific fixture
//@route PUT /api/fixtures/:id/stats
//@access private
//@role ADMIN, EDITOR
const editScores = asyncHandler(async (req, res) => {
  const fixture = await Fixture.findById(req.params.id);
  if (!fixture) {
    throw new Error("Fixture not found");
  }

  let { teamHomeScore, teamAwayScore } = req.body;
  const currentMatchday = await Matchday.findOne({_id: fixture.matchday, current: true})
  if (!currentMatchday) {
    throw new Error("This fixture is not in the currently running matchday");
  }
  if (!teamHomeScore || !teamAwayScore) {
    throw new Error("Scores are incomplete!");
  }
  await Fixture.findByIdAndUpdate(
    req.params.id,
    { $set: { teamAwayScore, teamHomeScore } },
    { new: true }
  );
  await Promise.all([updatePlayerPoints(), updateWeeklyStandings()]);
  res.json("scores updated");
});

//@desc Get Fixture
//@route GET /api/fixtures/:id
//@access public
//@role Not restricted
const getFixture = asyncHandler(async (req, res) => {
  const fixture = await Fixture.findById(req.params.id);

  if (!fixture) {
    res.status(400);
    throw new Error("Fixture not found");
  }

  res.status(200).json(fixture);
});

//@desc Delete Fixture
//@route DELETE /api/fixtures/:id
//@access private
//@role ADMIN EDITOR
const deleteFixture = asyncHandler(async (req, res) => {
  const fixture = await Fixture.findById(req.params.id);
  if (!fixture) {
    res.status(400);
    throw new Error("Fixture not found");
  }
  // Find user
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }
  await Fixture.findByIdAndDelete(req.params.id);

  const fixtures = await Fixture.find({ matchday: fixture.matchday });

  if (fixtures.length > 0) {
    const firstKickOff = fixtures.sort((x, y) => {
      if (x.kickOffTime > y.kickOffTime) return 1;
      if (x.kickOffTime < y.kickOffTime) return -1;
    })[0].kickOffTime;
    const deadline = new Date(firstKickOff);
    deadline.setMinutes(deadline.getMinutes() - 60);
    await Matchday.findByIdAndUpdate(
      fixture.matchday,
      { deadline },
      { new: true }
    );
  }

  res.status(200).json({ id: req.params.id });
});

export {
  setFixture,
  getFixtures,
  getFixture,
  editFixture,
  editScores,
  deleteFixture,
};
