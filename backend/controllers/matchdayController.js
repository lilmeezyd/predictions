import asyncHandler from "express-async-handler";
import Matchday from "../models/matchdayModel.js";

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
//@route PATCH /api/matchdays/:id
//@access Private
//@role ADMIN
const setCurrentMatchday = asyncHandler(async (req, res) => {
  const currentMatchday = await Matchday.findOne({ current: true });
  const matchdays = await Matchday.find({}).lean();
  const firstGW = Math.min(...matchdays.map((x) => x.matchdayId));
  const lastGW = Math.max(...matchdays.map((x) => x.matchdayId));

  if (!currentMatchday) {
    const isNotFinished = await Matchday.findOne({
        finished: false,
      matchdayId: firstGW,
    });
   if (isNotFinished) {
      await Matchday.updateOne(
        { matchdayId: firstGW },
        { $set: { current: true } }
      );
    } else {
        res.status(400);
      throw new Error("There are no more matchdays!");
    }
  } else {
    await Matchday.updateOne(
      { matchdayId: currentMatchday.matchdayId },
      { $set: { current: false, finished: true } }
    );
    const nextMatchdayId = currentMatchday.matchdayId + 1;
  if (nextMatchdayId <= lastGW) {
    await Matchday.updateOne(
      { matchdayId: nextMatchdayId },
      { $set: { current: true } }
    );
  }
  }


  res.status(200).json({
    message: `Matchdays updated`,
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

  res.status(200).json(matchdayId);
});

export {
  createMatchday,
  resetMatchdays,
  getMatchdays,
  getMatchday,
  setCurrentMatchday,
  updateMatchday,
  deleteMatchday,
  getCurrentMatchday,
};
