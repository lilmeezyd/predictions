import { useMemo, useState } from "react";
import {
  useGetTeamsQuery,
  useEditTeamMutation,
  useAddTeamMutation,
  useDeleteTeamMutation,
} from "../slices/teamApiSlice";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

const Teams = () => {
  const { data = [], isLoading } = useGetTeamsQuery();
  const [editTeam] = useEditTeamMutation();
  const [addTeam] = useAddTeamMutation();
  const [deleteTeam] = useDeleteTeamMutation();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [editName, setEditName] = useState("");
  const [editShortName, setEditShortName] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const teams = useMemo(() => {
    const sortable = [...data];
    const filtered = sortable
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return filtered;
  }, [data, itemsPerPage, currentPage]);
  const totalPages = Math.ceil(data?.length / itemsPerPage);
  const openEditModal = (team) => {
    setSelectedTeam(team);
    setEditName(team.name);
    setEditShortName(team.shortName);
    setShowEditModal(true);
    setShowAddModal(false);
  };

  const openDeleteModal = (team) => {
    setSelectedTeam(team);
    setShowDeleteModal(true);
    setShowEditModal(false);
    setShowAddModal(false);
  };

  const confirmEdit = async () => {
    if (!selectedTeam?._id) return;

    try {
      const res = await editTeam({
        id: selectedTeam._id,
        name: editName,
        shortName: editShortName,
      }).unwrap();

      toast.success(`${res?.name} updated!`);
      setShowEditModal(false);
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  const openAddModal = () => {
    setShowEditModal(false);
    setShowAddModal(true);
  };

  const confirmAdd = async () => {
    try {
      const res = await addTeam({
        name,
        shortName,
      }).unwrap();

      toast.success(`${res.name} added!`);
      setName("");
      setShortName("");
      setShowAddModal(false);
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  const confirmDelete = async () => {
    if (!selectedTeam?._id) return;
    try {
      await deleteTeam(selectedTeam._id).unwrap();
      toast.success("Team deleted!");
      setShowDeleteModal(false);
    } catch (err) {
      toast.error(err?.data?.message);
      console.error(err);
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div
        className={`grid ${
          (showEditModal && selectedTeam) || showAddModal
            ? "grid-cols-[65%_30%]"
            : "grid-cols-[1fr]"
        } justify-between items-center`}
      >
        <div>
          <div className="w-full overflow-x-auto space-y-4">
            <table className="min-w-full border border-gray-200 rounded-lg shadow text-sm">
              <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
                <tr>
                  <td className="font-bold px-4 py-2">TEAM</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2"></td>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, index) => (
                  <tr
                    key={team._id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
                  >
                    <td className="px-4 py-2">{team.name}</td>
                    <td className="italic font-semibold px-4 py-2 ">
                      {team.shortName}
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => openEditModal(team)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(team)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        {showEditModal && selectedTeam && (
          <div className="text-sm h-full hidden md:block flex items-center justify-center">
            <div className="h-full flex flex-col items center justify-center bg-white p-6 max-w-sm w-full space-y-4">
              <h6 className="text-lg font-semibold">
                Edit {selectedTeam.name}
              </h6>
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Short Name</label>
                <input
                  type="text"
                  value={editShortName}
                  onChange={(e) => setEditShortName(e.target.value)}
                  className="w-full px-3 py-1 border rounded"
                />
              </div>
              <div className="flex justify-between space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-1 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmEdit}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Team */}
        {showAddModal && (
          <div className="text-sm h-full hidden md:block flex items-center justify-center">
            <div className="h-full flex flex-col items center justify-center bg-white p-6 max-w-sm w-full space-y-4">
              <h6 className="text-lg font-semibold">Add Team</h6>
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Short Name</label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="w-full px-3 py-1 border rounded"
                />
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

      <div className="flex justify-end mt-4">
        <button
          onClick={openAddModal}
          className="w-16 border bg-black text-white rounded-lg px-4 py-4 text-lg"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {showEditModal && selectedTeam && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full space-y-4">
            <h3 className="text-lg font-semibold">Edit Team</h3>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Short Name</label>
              <input
                type="text"
                value={editShortName}
                onChange={(e) => setEditShortName(e.target.value)}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Team */}
      {showDeleteModal && selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-medium">{selectedTeam.name}</span>?
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

      {/* Add Team */}
      {showAddModal && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full space-y-4">
            <h6 className="text-lg font-semibold">Add Team</h6>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Short Name</label>
              <input
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                className="w-full px-3 py-1 border rounded"
              />
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

export default Teams;
