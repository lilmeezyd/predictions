import asyncHandler from "express-async-handler";
import Matchday from "../models/matchdayModel.js";
import Overall from "../models/overallStandingsModel.js";

//@desc Create Matchday
//@route POST /api/matchdays
//@access Private
//@role ADMIN
const createMatchday = asyncHandler(async (req, res) => {
  let { matchdayId } = req.body;
  if (!matchdayId) {
    res.status(400);
    throw new Error("Add matchday!");
  }
  if (parseInt(matchdayId) < 1) {
    res.status(400);
    throw new Error("Matchday has to be greater than 0");
  }

  let id = parseInt(matchdayId);
  const idExists = await Matchday.findOne({ matchdayId: id });

  //Find user
  if (!req.user) {
    res.status(400);
    throw new Error("User not found");
  }
  if (!!id === false) {
    res.status(400);
    throw new Error("Entry has no id");
  }
  //Check if matchday exists
  if (idExists) {
    res.status(400);
    throw new Error("Id already taken");
  }

  const matchday = await Matchday.create({
    name: `Matchday ${id}`,
    matchdayId: id,
  });
  res.status(200).json(matchday);
});

//@desc Get Matchdays
//@route GET /api/matchdays
//@access Public
//@role Admin, editor, normal_user
const getMatchdays = asyncHandler(async (req, res) => {
  const matchdays = await Matchday.find({});
  res.status(200).json(matchdays);
});

//@desc Get Matchday
//@route GET /api/matchdays/:id
//@access Public
//@role normal_user
const getMatchday = asyncHandler(async (req, res) => {
  const matchday = await Matchday.findById(req.params.id);
  //const matchdays = await Matchday.find({}).select('-_id')
  if(!matchday) {
    throw new Error('Matchday not found')
  }
  res.status(200).json(matchday);
});

//@desc Start Matchday
//@route PATCH /api/matchdays/:id/set-current-matchday
//@access Private
//@role ADMIN
const setCurrentMatchday = asyncHandler(async (req, res) => {
  const matchdayReq = await Matchday.findById(req.params.id)
  const matchdays = await Matchday.find({}).lean();
  const firstGW = Math.min(...matchdays.map((x) => x.matchdayId));
  const lastGW = Math.max(...matchdays.map((x) => x.matchdayId));
  if(!matchdayReq) {
    throw new Error('Matchday not found!')
  }
  const { current, matchdayId, finished } = matchdayReq
  if(current) {
    throw new Error('This matchday is already live')
  }

  if(finished) {
    throw new Error('This matchday is already finished')
  }

  if(matchdayId === firstGW) {
    await Matchday.updateOne({_id: req.params.id}, {$set: {current: true}})
  } else {
    const prevMD = matchdayId-1
    await Matchday.updateOne({_id: req.params.id}, {$set: {current: true}})
    await Matchday.updateOne({matchdayId: prevMD}, { $set: { current: false, finished: true}})
  }

  await Overall.updateMany({}, [{$set: { oldRank: "$rank"}}])

  res.status(200).json({
    message: `Event Started`,
    matchdayReq
  });
});


//@desc Update Matchday
//@route PUT /api/matchdays/:id
//@access Private
//@role Admin, editor
const updateMatchday = asyncHandler(async (req, res) => {
  const matchday = await Matchday.findById(req.params.id);
  let { matchdayId, oldId } = req.body;
  //Find user
  if (!req.user) {
    res.status(400);
    throw new Error("User not found");
  }
  if (!matchday) {
    res.status(400);
    throw new Error("Matchday not found!");
  }
  if (!matchdayId) {
    res.status(400);
    throw new Error("Add matchday!");
  }

  if(parseInt(oldId) === parseInt(matchdayId)) {
    throw new Error("The new and old matchday Ids are the same!")
  }
  if(matchday.current) {
    throw new Error('You can not edit a live matchday')
  }

  if(matchday.finished) {
    throw new Error('You can not edit a finished matchday')
  }

  let id = parseInt(matchdayId);
  const idExists = await Matchday.findOne({ matchdayId : id });

  if (!!id === false) {
    res.status(400);
    throw new Error("Entry has no id");
  }
  //Check if matchday exists
  if (idExists) {
    res.status(400);
    throw new Error("Id already taken");
  }

  //Find user
  if (!req.user) {
    res.status(400);
    throw new Error("User not found");
  }

  const updatedMatchday = await Matchday.findByIdAndUpdate(
    req.params.id,
    { name: `Matchday ${id}`, matchdayId: id },
    { new: true }
  );
  res.status(200).json({ msg: `${updatedMatchday.name} updated` });
});

//@desc Delete Matchday
//@route DELETE /api/matchdays/:id
//@access Private
//@roles Admin
const deleteMatchday = asyncHandler(async (req, res) => {
  const matchday = await Matchday.findById(req.params.id);

  //FInd user
  if (!req.user) {
    res.status(400);
    throw new Error("User not found");
  }

  if (!matchday) {
    res.status(400);
    throw new Error("Matchday not found");
  }

  await Matchday.findByIdAndDelete(req.params.id);
  res.status(200).json({ id: req.params.id });
});

const resetMatchdays = asyncHandler(async (req, res) => {
  const matchdays = await Matchday.find({}).lean();
  const firstGW = Math.min(...matchdays.map((x) => x.matchdayId));
  //Find user
  if (!req.user) {
    res.status(400);
    throw new Error("User not found");
  }
  await Matchday.updateMany(
    {},
    {
      $set: {
        finished: false,
        current: false,
      },
    }
  );

  await Matchday.updateOne(
    { matchdayId: firstGW },
    { $set: { current: true } }
  );

  res.status(200).json({ message: `Reset complete.` });
});

const getCurrentMatchday = asyncHandler(async (req, res) => {
  const matchday = await Matchday.findOne({ current: true });
  if(!matchday) {
    throw new Error('No current matchday running')
  }
  const { matchdayId } = matchday;

  res.status(200).json({matchday: matchdayId});
});

//@desc Max and Min Matchday
//@route GET /api/matchday/max-min
//@access Public
//@roles Everyone
const getMatchdayMaxNMin = asyncHandler(async (req, res) => {
  const matchdays = await Matchday.find().lean();
  const minMD = Math.min(...matchdays.map(x => x.matchdayId))
  const maxMD = Math.max(...matchdays.map(x => x.matchdayId))

  res.json({max: maxMD, min: minMD})
})

export {
  createMatchday,
  resetMatchdays,
  getMatchdays,
  getMatchday,
  setCurrentMatchday,
  updateMatchday,
  deleteMatchday,
  getCurrentMatchday,
  getMatchdayMaxNMin
};
