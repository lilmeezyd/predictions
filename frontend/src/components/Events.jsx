import { useMemo, useState } from "react";
import {
  useGetMatchdaysQuery,
  useAddMatchdayMutation,
  useEditMatchdayMutation,
  useDeleteMatchdayMutation,
  useStartMatchdayMutation,
  useResetMatchdaysMutation
} from "../slices/matchdayApiSlice";
import { Pencil, Trash2, Plus, CircleCheck, CircleX } from "lucide-react";
import { toast } from "sonner";

const Events = () => {
  const { data = [], isLoading } = useGetMatchdaysQuery();
  const [addMatchday] = useAddMatchdayMutation();
  const [editMatchday] = useEditMatchdayMutation();
  const [deleteMatchday] = useDeleteMatchdayMutation();
  const [startMatchday] = useStartMatchdayMutation();
  const [resetMatchday] = useResetMatchdaysMutation();
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [event, setEvent] = useState(null);
  const [editEvent, setEditEvent] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const events = useMemo(() => {
    const sortable = [...data];
    const filtered = sortable
      .sort((a, b) => (a.matchdayId > b.matchdayId ? 1 : -1))
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return filtered;
  }, [data, itemsPerPage, currentPage]);
  const totalPages = Math.ceil(data?.length / itemsPerPage);
  const openEditModal = (event) => {
    setSelectedEvent(event);
    setEditEvent(event.matchdayId);
    setShowEditModal(true);
    setShowAddModal(false);
  };

  const openDeleteModal = (event) => {
    setSelectedEvent(event);
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
      const res = await addMatchday({
        matchdayId: event,
      }).unwrap();

      toast.success(`${res.name} added!`);
      setEvent(null);
      setShowAddModal(false);
    } catch (err) {
      setEvent(null);
      setShowAddModal(false);
      toast.error(err?.data?.message);
    }
  };

  const confirmEdit = async () => {
    if (!selectedEvent?._id) return;

    try {
      const res = await editMatchday({
        id: selectedEvent._id,
        matchdayId: editEvent,
        oldId: selectedEvent.matchdayId,
      }).unwrap();

      toast.success(res?.msg);
      setShowEditModal(false);
    } catch (err) {
      toast.error(err?.data?.message);
      setShowEditModal(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedEvent?._id) return;
    try {
      await deleteMatchday(selectedEvent._id).unwrap();
      toast.success("Event deleted!");
      setShowDeleteModal(false);
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  const confirmStart = async () => {
    if (!selectedEvent?._id) return;
    try {
      await startMatchday(selectedEvent._id).unwrap();
      toast.success("Event Started!")
      setShowEditModal(false);
    } catch (err) {
      toast.error(err?.data?.message);
      setShowEditModal(false)
    }
  }
  const confirmReset = async () => {
    try {
      const res = await resetMatchday().unwrap();
      toast.success(res.message)
    } catch (err) {
      toast.error(err?.data?.message);
    }
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div
        className={`grid ${
          (showEditModal && selectedEvent) || showAddModal
            ? "grid-cols-[65%_30%]"
            : "grid-cols-[1fr]"
        } justify-between items-center`}
      >
        <div>
          <div className="w-full overflow-x-auto space-y-4">
            <table className="min-w-full border border-gray-200 rounded-lg shadow text-sm">
              <thead className="font-bold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900">
                <tr>
                  <td className="px-4 py-2">Event</td>
                  <td className="px-4 py-2">Deadline</td>
                  <td className="px-4 py-2">Current</td>
                  <td className="px-4 py-2">Finished</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr
                    key={event._id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-blue-50"}`}
                  >
                    <td className="px-4 py-2">{event.name}</td>
                    <td className="px-4 py-2">
                      {new Date(event.deadline).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      {event.current ? (
                        <CircleCheck color="green" size={24} />
                      ) : (
                        <CircleX color="red" size={24} />
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {event.finished ? (
                        <CircleCheck color="green" size={24} />
                      ) : (
                        <CircleX color="red" size={24} />
                      )}
                    </td>
                    <td className="px-4 py-2 text-center space-x-2">
                      <button
                        onClick={() => openEditModal(event)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => openDeleteModal(event)}
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
        {showEditModal && selectedEvent && (
          <div className="text-sm h-full hidden md:block flex items-center justify-center">
            <div className="h-full flex flex-col items center justify-center bg-white p-6 max-w-sm w-full space-y-4">
              <h6 className="text-lg font-semibold">
                Edit {selectedEvent.name}
              </h6>
              <div>
                <label className="block text-sm font-medium">Matchday</label>
                <input
                  type="number"
                  value={editEvent}
                  onChange={(e) => setEditEvent(+e.target.value)}
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
                {!selectedEvent.current && !selectedEvent.finished && <button
                  onClick={confirmStart}
                  className="px-3 py-1 border rounded  bg-blue-600 text-white"
                >
                  Start GW
                </button>}
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

        {/* Add Event */}
        {showAddModal && (
          <div className="text-sm h-full hidden md:block flex items-center justify-center">
            <div className="h-full flex flex-col items center justify-center bg-white p-6 max-w-sm w-full space-y-4">
              <h6 className="text-lg font-semibold">Add Matchday</h6>
              <div>
                <label className="block text-sm font-medium">Matchday</label>
                <input
                  type="number"
                  value={event}
                  onChange={(e) => setEvent(+e.target.value)}
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

      <div className="flex justify-around mt-4">
        <button onClick={confirmReset} className="px-3 bg-blue-600 text-white rounded text-sm">Reset</button>
        <button
          onClick={openAddModal}
          className="w-16 border bg-black text-white rounded-lg px-4 py-4 text-sm"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {showEditModal && selectedEvent && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full space-y-4">
            <h3 className="text-lg font-semibold">Edit Event</h3>
            <div>
              <label className="block text-sm font-medium">Matchday</label>
              <input
                type="number"
                value={editEvent}
                onChange={(e) => setEditEvent(+e.target.value)}
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
              {!selectedEvent.current &&  !selectedEvent.finished && <button
                  onClick={confirmStart}
                  className="px-3 py-1 border rounded  bg-blue-600 text-white"
                >
                  Start GW
                </button>}
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

      {/* Delete Event */}
      {showDeleteModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-medium">{selectedEvent.name}</span>?
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

      {/* Add Event */}
      {showAddModal && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full space-y-4">
            <h6 className="text-lg font-semibold">Add Event</h6>
            <div>
              <label className="block text-sm font-medium">Matchday</label>
              <input
                type="number"
                value={event}
                onChange={(e) => setEvent(+e.target.value)}
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

export default Events;
