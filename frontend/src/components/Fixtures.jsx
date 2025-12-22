import { useMemo, useState } from "react";
import {
  useGetFixturesQuery,
  useAddFixtureMutation,
  useUpdateFixtureMutation,
  useDeleteFixtureMutation,
  useEditMatchScoresMutation,
  useStartMatchMutation,
  useEndMatchMutation,
  useResetMatchMutation,
} from "../slices/fixtureApiSlice";
import { useGetTeamsQuery } from "../slices/teamApiSlice";
import { useGetMatchdaysQuery } from "../slices/matchdayApiSlice";
import { Pencil, Trash2, Plus, CircleCheck, CircleX } from "lucide-react";
import { toast } from "sonner";
import fixturesByMatchday from "../hooks/fixturesByMatchday";
import FixtureItem from "./FixtureItem";

const Fixtures = () => {
  const { data = [], isLoading } = useGetFixturesQuery();
  const [addFixture] = useAddFixtureMutation();
  const [updateFixture] = useUpdateFixtureMutation();
  const [deleteFixture] = useDeleteFixtureMutation();
  const [startMatch] = useStartMatchMutation();
  const [endMatch] = useEndMatchMutation();
  const [resetMatch] = useResetMatchMutation();
  const [editMatchScores] = useEditMatchScoresMutation();
  const { data: teams = [] } = useGetTeamsQuery();
  const { data: matchdays = [] } = useGetMatchdaysQuery();
  const itemsPerPage = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const [fixture, setFixture] = useState(null);
  const [fixtureData, setFixtureData] = useState({
    teamHome: "",
    teamAway: "",
    matchday: "",
    kickOff: "",
    time: "",
    teamAwayScore: null,
    teamHomeScore: null,
    editTeamHome: "",
    editTeamAway: "",
    editMatchday: "",
    editKickOff: "",
    editTime: "",
  });
  const [editFixture, setEditFixture] = useState("");
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const fixtures = fixturesByMatchday(data);
  const {
    teamHome,
    teamAway,
    matchday,
    kickOff,
    time,
    teamAwayScore,
    teamHomeScore,
    editTeamHome,
    editTeamAway,
    editMatchday,
    editKickOff,
    editTime,
  } = fixtureData;
  const groupedFixtures = useMemo(() => {
    const sortable = [...fixtures];
    const filtered = sortable.find((x) => x.matchday === currentPage) || {};
    const returnedFixtures =
      filtered.fixtures?.sort((x, y) => {
        if (x.kickOffTime !== y.kickOffTime) {
          return x.kickOffTime > y.kickOffTime ? 1 : -1;
        }
        return x.teamHome?.localeCompare(y.teamHome);
      }) || [];

    return returnedFixtures;
  }, [fixtures, currentPage]);
  const totalPages = Math.ceil(fixtures?.length / itemsPerPage);
  const openEditModal = (fixture) => {
    setSelectedFixture(fixture);
    setEditFixture(fixture._id);
    setFixtureData((prev) => ({
      ...prev,
      teamAwayScore: fixture.teamAwayScore,
      teamHomeScore: fixture.teamHomeScore,
      editMatchday: fixture.matchdayId,
      editTeamHome: fixture.teamHomeId,
      editTeamAway: fixture.teamAwayId,
      editKickOff: fixture.kickOffTime.substring(0, 10),
      editTime: fixture.kickOffTime.substring(11, 23),
    }));
    setShowEditModal(true);
    setShowAddModal(false);
  };

  const openDeleteModal = (fixture) => {
    setSelectedFixture(fixture);
    setShowDeleteModal(true);
    setShowEditModal(false);
    setShowAddModal(false);
  };
  const openAddModal = () => {
    setShowEditModal(false);
    setShowAddModal(true);
  };

  const confirmAdd = async () => {
    try {
      const res = await addFixture({
        teamHome,
        teamAway,
        matchday,
        kickOffTime: new Date(kickOff + "/" + time),
      }).unwrap();

      toast.success(`Fixture added!`);
      setFixture(null);
      setShowAddModal(false);
    } catch (err) {
      setFixture(null);
      setShowAddModal(false);
      toast.error(err?.data?.message);
    }
  };

  const confirmEdit = async () => {
    if (!selectedFixture?._id) return;

    try {
      const res = await updateFixture({
        id: selectedFixture._id,
        teamHome: editTeamHome,
        teamAway: editTeamAway,
        matchday: editMatchday,
        kickOffTime: new Date(editKickOff + "/" + editTime),
      }).unwrap();

      toast.success(`Fixture updated!`);
      setShowEditModal(false);
    } catch (err) {
      toast.error(err?.data?.message);
      setShowEditModal(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedFixture?._id) return;
    try {
      await deleteFixture(selectedFixture._id).unwrap();
      toast.success("Fixture deleted!");
      setShowDeleteModal(false);
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  const startFixture = async () => {
    if (!selectedFixture?._id) return;
    try {
      const res = await startMatch(selectedFixture?._id).unwrap();
      setShowEditModal(false);
      toast.success(`Match is live!`);
    } catch (error) {
      setShowEditModal(false);
      toast.error(error?.data?.message);
    }
  };

  const endFixture = async () => {
    if (!selectedFixture?._id) return;
    try {
      const res = await endMatch(selectedFixture?._id).unwrap();
      setShowEditModal(false);
      toast.success(`Match has ended!`);
    } catch (error) {
      setShowEditModal(false);
      toast.error(error?.data?.message);
    }
  };

  const resetFixture = async () => {
    if (!selectedFixture?._id) return;
    try {
      const res = await resetMatch(selectedFixture?._id).unwrap();
      setShowEditModal(false);
      toast.success(`Match has been reset!`);
    } catch (error) {
      setShowEditModal(false);
      toast.error(error?.data?.message);
    }
  };

  const editScores = async () => {
    if (!selectedFixture?._id) return;
    try {
      const res = await editMatchScores({
        id: selectedFixture?._id,
        teamHomeScore,
        teamAwayScore,
      }).unwrap();
      setShowEditModal(false);
      toast.success(`Match scores updated!`);
    } catch (error) {
      setShowEditModal(false);
      toast.error(error?.data?.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div
        className={`grid ${
          (showEditModal && selectedFixture) || showAddModal
            ? "grid-cols-[65%_30%]"
            : "grid-cols-[1fr]"
        } justify-between items-center`}
      >
        <div>
          <div className="w-full overflow-x-auto space-y-4">
            <div>
              <h1 className="text-center font-bold my-2 py-2 bg-gray-900 rounded-sm text-white">
                Matchday&nbsp;{currentPage}
              </h1>
              {groupedFixtures.map((fixture) => (
                <FixtureItem
                  openDeleteModal={openDeleteModal}
                  openEditModal={openEditModal}
                  key={fixture._id}
                  fixture={fixture}
                />
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="text-sm px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="text-sm px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/*Edit on normal screens */}
        {showEditModal && selectedFixture && (
          <div className="border text-sm hidden md:block flex items-center justify-center">
            <div className="h-full flex flex-col items center justify-center bg-white p-6 max-w-sm w-full space-y-4">
              {selectedFixture.live && (
                <h3 className="text-lg font-semibold">Edit Scores</h3>
              )}
              {selectedFixture.finished && (
                <h3 className="text-lg font-semibold">Match has ended</h3>
              )}
              {selectedFixture.live === false &&
                selectedFixture.finished === false && (
                  <h3 className="text-lg font-semibold">Edit Fixture</h3>
                )}
              {selectedFixture.live && (
                <>
                  <div>
                    <label className="block text-sm font-medium">
                      {selectedFixture.teamHome}
                    </label>
                    <input
                      name="teamHomeScore"
                      id="teamHomeScore"
                      type="number"
                      min={0}
                      className="w-full px-3 py-1 border rounded"
                      value={teamHomeScore}
                      onChange={(e) => {
                        setFixtureData((prev) => ({
                          ...prev,
                          teamHomeScore: e.target.value,
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      {selectedFixture.teamAway}
                    </label>
                    <input
                      name="teamAwayScore"
                      id="teamAwayScore"
                      type="number"
                      min={0}
                      className="w-full px-3 py-1 border rounded"
                      value={teamAwayScore}
                      onChange={(e) => {
                        setFixtureData((prev) => ({
                          ...prev,
                          teamAwayScore: e.target.value,
                        }));
                      }}
                    />
                  </div>
                </>
              )}
              {selectedFixture.live === false &&
                selectedFixture.finished === false && (
                  <>
                    <div>
                      <label className="block text-sm font-medium">
                        Matchday
                      </label>
                      <select
                        name="editMatchday"
                        id="matchday"
                        className="w-full px-3 py-1 border rounded"
                        value={editMatchday}
                        onChange={(e) => {
                          setFixtureData((prev) => ({
                            ...prev,
                            editMatchday: e.target.value,
                          }));
                        }}
                      >
                        {matchdays?.map((matchday) => (
                          <option key={matchday._id} value={matchday._id}>
                            {matchday.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Date</label>
                      <input
                        name="kickoff"
                        id="kickoff"
                        type="date"
                        className="w-full px-3 py-1 border rounded"
                        value={editKickOff}
                        onChange={(e) => {
                          setFixtureData((prev) => ({
                            ...prev,
                            editKickOff: e.target.value,
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Time</label>
                      <input
                        className="w-full px-3 py-1 border rounded"
                        value={editTime}
                        onChange={(e) => {
                          setFixtureData((prev) => ({
                            ...prev,
                            editTime: e.target.value,
                          }));
                        }}
                        name="time"
                        id="time"
                        type="time"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        HomeTeam:
                      </label>
                      <select
                        onChange={(e) => {
                          setFixtureData((prev) => ({
                            ...prev,
                            editTeamHome: e.target.value,
                          }));
                        }}
                        className="w-full px-3 py-1 border rounded"
                        name="teamHome"
                        id="teamHome"
                        value={editTeamHome}
                      >
                        {teams.map((team) => (
                          <option key={team._id} value={team._id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
                        AwayTeam:
                      </label>
                      <select
                        onChange={(e) => {
                          setFixtureData((prev) => ({
                            ...prev,
                            editTeamAway: e.target.value,
                          }));
                        }}
                        className="w-full px-3 py-1 border rounded"
                        name="teamAway"
                        id="teamAway"
                        value={editTeamAway}
                      >
                        {teams.map((team) => (
                          <option key={team._id} value={team._id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

              <div className="flex justify-between space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>
                {selectedFixture.live === false &&
                  selectedFixture.finished === false && (
                    <button
                      onClick={confirmEdit}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Save
                    </button>
                  )}
                {selectedFixture.live === false &&
                  selectedFixture.finished === false && (
                    <button
                      onClick={startFixture}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Start
                    </button>
                  )}
              </div>
              <div className="flex justify-between space-x-3">
                {selectedFixture.live && (
                  <button
                    onClick={editScores}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Save Scores
                  </button>
                )}
                {selectedFixture.live && (
                  <button
                    onClick={endFixture}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    End
                  </button>
                )}
                {(selectedFixture.live || selectedFixture.finished) && (
                  <button
                    onClick={resetFixture}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Fixture */}
        {showAddModal && (
          <div className="text-sm h-full hidden md:block flex items-center justify-center">
            <div className="h-full flex flex-col items center justify-center bg-white p-6 max-w-sm w-full space-y-4">
              <h6 className="text-lg font-semibold">Add Fixture</h6>
              <div>
                <label className="block text-sm font-medium">Matchday</label>
                <select
                  name="matchday"
                  id="matchday"
                  className="w-full px-3 py-1 border rounded"
                  onChange={(e) => {
                    setFixtureData((prev) => ({
                      ...prev,
                      matchday: e.target.value,
                    }));
                  }}
                >
                  {matchdays?.map((matchday) => (
                    <option key={matchday._id} value={matchday._id}>
                      {matchday.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Date</label>
                <input
                  name="kickoff"
                  id="kickoff"
                  type="date"
                  className="w-full px-3 py-1 border rounded"
                  onChange={(e) => {
                    setFixtureData((prev) => ({
                      ...prev,
                      kickOff: e.target.value,
                    }));
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Time</label>
                <input
                  className="w-full px-3 py-1 border rounded"
                  onChange={(e) => {
                    setFixtureData((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }));
                  }}
                  name="time"
                  id="time"
                  type="time"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">HomeTeam:</label>
                <select
                  onChange={(e) => {
                    setFixtureData((prev) => ({
                      ...prev,
                      teamHome: e.target.value,
                    }));
                  }}
                  className="w-full px-3 py-1 border rounded"
                  name="teamHome"
                  id="teamHome"
                >
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">AwayTeam:</label>
                <select
                  onChange={(e) => {
                    setFixtureData((prev) => ({
                      ...prev,
                      teamAway: e.target.value,
                    }));
                  }}
                  className="w-full px-3 py-1 border rounded"
                  name="teamAway"
                  id="teamAway"
                >
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAdd}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {
        <div className="flex justify-end mt-4">
          <button
            onClick={openAddModal}
            className="w-16 border bg-black text-white rounded-lg px-4 py-4 text-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      }

      {/*Edit on small screens */}
      {showEditModal && selectedFixture && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full space-y-4">
            {selectedFixture.finished && (
              <h3 className="text-lg font-semibold">Match has ended</h3>
            )}
            {selectedFixture.live && (
              <h3 className="text-lg font-semibold">Edit Scores</h3>
            )}
            {selectedFixture.live === false &&
              selectedFixture.finished === false && (
                <h3 className="text-lg font-semibold">Edit Fixture</h3>
              )}
            {selectedFixture.live && (
              <>
                <div>
                  <label className="block text-sm font-medium">
                    {selectedFixture.teamHome}
                  </label>
                  <input
                    name="teamHomeScore"
                    id="teamHomeScore"
                    type="number"
                    className="w-full px-3 py-1 border rounded"
                    value={teamHomeScore}
                    min={0}
                    onChange={(e) => {
                      setFixtureData((prev) => ({
                        ...prev,
                        teamHomeScore: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    {selectedFixture.teamAway}
                  </label>
                  <input
                    name="teamAwayScore"
                    id="teamAwayScore"
                    type="number"
                    className="w-full px-3 py-1 border rounded"
                    value={teamAwayScore}
                    min={0}
                    onChange={(e) => {
                      setFixtureData((prev) => ({
                        ...prev,
                        teamAwayScore: e.target.value,
                      }));
                    }}
                  />
                </div>
              </>
            )}
            {selectedFixture.live === false &&
              selectedFixture.finished === false && (
                <>
                  <div>
                    <label className="block text-sm font-medium">
                      Matchday
                    </label>
                    <select
                      name="editMatchday"
                      id="matchday"
                      className="w-full px-3 py-1 border rounded"
                      value={editMatchday}
                      onChange={(e) => {
                        setFixtureData((prev) => ({
                          ...prev,
                          editMatchday: e.target.value,
                        }));
                      }}
                    >
                      {matchdays?.map((matchday) => (
                        <option key={matchday._id} value={matchday._id}>
                          {matchday.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Date</label>
                    <input
                      name="kickoff"
                      id="kickoff"
                      type="date"
                      className="w-full px-3 py-1 border rounded"
                      value={editKickOff}
                      onChange={(e) => {
                        setFixtureData((prev) => ({
                          ...prev,
                          editKickOff: e.target.value,
                        }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Time</label>
                    <input
                      className="w-full px-3 py-1 border rounded"
                      value={editTime}
                      onChange={(e) => {
                        setFixtureData((prev) => ({
                          ...prev,
                          editTime: e.target.value,
                        }));
                      }}
                      name="time"
                      id="time"
                      type="time"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      HomeTeam:
                    </label>
                    <select
                      onChange={(e) => {
                        setFixtureData((prev) => ({
                          ...prev,
                          editTeamHome: e.target.value,
                        }));
                      }}
                      className="w-full px-3 py-1 border rounded"
                      name="teamHome"
                      id="teamHome"
                      value={editTeamHome}
                    >
                      {teams.map((team) => (
                        <option key={team._id} value={team._id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">
                      AwayTeam:
                    </label>
                    <select
                      onChange={(e) => {
                        setFixtureData((prev) => ({
                          ...prev,
                          editTeamAway: e.target.value,
                        }));
                      }}
                      className="w-full px-3 py-1 border rounded"
                      name="teamAway"
                      id="teamAway"
                      value={editTeamAway}
                    >
                      {teams.map((team) => (
                        <option key={team._id} value={team._id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            <div className="flex justify-between space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              {selectedFixture.live === false &&
                selectedFixture.finished === false && (
                  <button
                    onClick={confirmEdit}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Save
                  </button>
                )}
              {selectedFixture.live === false &&
                selectedFixture.finished === false && (
                  <button
                    onClick={startFixture}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Start
                  </button>
                )}
            </div>

            <div className="flex justify-between space-x-3">
              {selectedFixture.live && (
                <button
                  onClick={editScores}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Save Scores
                </button>
              )}
              {selectedFixture.live && (
                <button
                  onClick={endFixture}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  End
                </button>
              )}
              {(selectedFixture.live || selectedFixture.finished) && (
                <button
                  onClick={resetFixture}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Fixture */}
      {showDeleteModal && selectedFixture && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-medium">{selectedFixture._id}</span>?
            </p>
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Fixture */}
      {showAddModal && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full space-y-4">
            <h6 className="text-lg font-semibold">Add Fixture</h6>
            <div>
              <label className="block text-sm font-medium">Matchday</label>
              <select
                name="matchday"
                id="matchday"
                className="w-full px-3 py-1 border rounded"
                onChange={(e) => {
                  setFixtureData((prev) => ({
                    ...prev,
                    matchday: e.target.value,
                  }));
                }}
              >
                {matchdays?.map((matchday) => (
                  <option key={matchday._id} value={matchday._id}>
                    {matchday.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Date</label>
              <input
                name="kickoff"
                id="kickoff"
                type="date"
                className="w-full px-3 py-1 border rounded"
                onChange={(e) => {
                  setFixtureData((prev) => ({
                    ...prev,
                    kickOff: e.target.value,
                  }));
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Time</label>
              <input
                className="w-full px-3 py-1 border rounded"
                onChange={(e) => {
                  setFixtureData((prev) => ({
                    ...prev,
                    time: e.target.value,
                  }));
                }}
                name="time"
                id="time"
                type="time"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">HomeTeam:</label>
              <select
                onChange={(e) => {
                  setFixtureData((prev) => ({
                    ...prev,
                    time: e.target.value,
                  }));
                }}
                className="w-full px-3 py-1 border rounded"
                name="teamHome"
                id="teamHome"
              >
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">AwayTeam:</label>
              <select
                onChange={(e) => {
                  setFixtureData((prev) => ({
                    ...prev,
                    time: e.target.value,
                  }));
                }}
                className="w-full px-3 py-1 border rounded"
                name="teamAway"
                id="teamAway"
              >
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmAdd}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Fixtures;
