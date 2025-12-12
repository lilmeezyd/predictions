import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Team from "../models/teamModel.js";

//@desc Set Teams
//@route POST /api/teams
//@access Private 
//@role Admin
const setTeams = asyncHandler(async (req, res) => {
  let { name, shortName } = req.body;
  // Find user
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  if (!name || !shortName) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  shortName = shortName.toLocaleUpperCase();
  const team = await Team.create({
    name,
    shortName
  });
  res.status(200).json(team);
});

//@desc Get Teams
//@route GET /api/teams
//@access Public
//@role Admin, editor, normal_user
const getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({});
  res.status(200).json(teams.sort((a,b) => a.name > b.name ? 1 : -1));
});

//@desc Get Team
//@route GET /api/teams/:id
//@access Public
//@role Admin, editor, normal_use
const getTeam = asyncHandler(async(req, res) => {
  const team = await Team.findById(req.params.id)
  if(!team) {
    res.status(400);
    throw new Error("Team not found");
  }
  res.status(200).json(team)
})

//@desc Update Team
//@route PUT /api/teams/:id
//@access Private
//@role Admin, editor
const updateTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!team) {
    res.status(404);
    throw new Error("Team not found");
  } else {
    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedTeam)
  }
});

//@desc Delete Teams
//@route DELETE /api/teams/:id
//@access Private
//@roles Admin
const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    res.status(400);
    throw new Error("Team not found");
  }
  // Find user
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  await Team.findByIdAndDelete(req.params.id);
  res.status(200).json({ id: req.params.id });
});

export { getTeams, getTeam, setTeams, updateTeam, deleteTeam };
