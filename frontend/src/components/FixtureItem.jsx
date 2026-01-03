import { Pencil, Trash2, Plus, CircleCheck, CircleX } from "lucide-react";
import { useSelector } from "react-redux";

const FixtureItem = (props) => {
  const { fixture, openEditModal, openDeleteModal } = props;
  const { userInfo } = useSelector((state) => state.auth);

  const newDate = new Date(fixture.kickOffTime);
  const newTime = newDate.toLocaleTimeString();
  const time =
    newTime.length === 11
      ? newTime.replace(newTime.substring(5, 10), newTime.substring(8, 10))
      : newTime.replace(newTime.substring(4, 9), newTime.substring(7, 9));
  return (
    <div className="p-2">
      <div className="border border-gray-100 fixture-housing rounded-lg relative">
        <div className="time-position text-xs font-bold">{time}</div>
        <div className="date-position text-xs font-bold">
          {new Date(fixture.kickOffTime).toLocaleDateString()}
        </div>
        <div
          className={`grid ${
            userInfo?.roles?.ADMIN
              ? "grid-cols-[30%_20%_30%_20%] sm:grid-cols-[40%_10%_40%_10%]"
              : "grid-cols-[35%_30%_35%] sm:grid-cols-[40%_20%_40%]"
          }
                    items-center p-4`}
        >
          <div className="text-xs sm:text-base py-2 px-1 sm:px-4 font-semibold flex flex-col-reverse sm:flex-row justify-between">
            <div className="my-auto truncate text-center sm:text-right w-full sm:w-3/4 px-2">
              {fixture.teamHome}
            </div>
            <div className="w-full sm:w-1/4 flex justify-center align-center">
              <img
                src={`https://ik.imagekit.io/cap10/${fixture.shortHome}.webp`}
                alt={`${fixture.teamHome} badge`}
                className="h-10 w-10 md:h-20 md:w-20 object-contain rounded"
              />
            </div>
          </div>
          <div
            className={`${fixture.live && "bg-red-500 text-black"}
                    ${fixture.finished && "bg-gray-900 text-white"}
                     font-bold text-xs sm:text-base rounded flex p-2`}
          >
            <div className="text-center my-auto mr-1 flex-grow">
              {fixture.teamHomeScore}
            </div>
            <span>:</span>
            <div className="text-center ml-1 flex-grow">
              {fixture.teamAwayScore}
            </div>
          </div>
          <div className="text-xs sm:text-base py-2 px-1 sm:px-4 font-semibold flex flex-col sm:flex-row justify-between">
            <div className="w-full sm:w-1/4 flex justify-center align-center">
              <img
                src={`https://ik.imagekit.io/cap10/${fixture.shortAway}.webp`}
                alt={`${fixture.teamAway} badge`}
                className="h-10 w-10 md:h-20 md:w-20 object-contain rounded"
              />
            </div>
            <div className="my-auto truncate text-center sm:text-left w-full sm:w-3/4 px-2">
              {fixture.teamAway}
            </div>
          </div>
          {userInfo?.roles?.ADMIN && (
            <div className="py-2 text-center space-x-2">
              <button onClick={() => openEditModal(fixture)}>
                <Pencil size={16} />
              </button>
              <button onClick={() => openDeleteModal(fixture)}>
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
        {fixture.live && (
          <p className="text-center text-xs sm:text-base text-red-500 font-semibold p-2">
            Live
          </p>
        )}
        {fixture.finished && (
          <p className="text-center text-xs sm:text-base font-semibold p-2">
            Finished
          </p>
        )}
      </div>
    </div>
  );
};

export default FixtureItem;
