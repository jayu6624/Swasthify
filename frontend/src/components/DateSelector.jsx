const DateSelector = ({ selectedDay, setSelectedDay }) => {
    const days = [
      { number: 3, name: 'Sat' },
      { number: 4, name: 'Sun' },
      { number: 5, name: 'Mon' },
      { number: 6, name: 'Tue' },
      { number: 7, name: 'Wed' },
      { number: 8, name: 'Thu' },
      { number: 9, name: 'Fri' },
    ];
  
    return (
      <div className="p-4 bg-white border-b flex items-center">
        <button className="p-1 rounded hover:bg-gray-100">
          
        </button>
        <div className="flex-1 flex justify-between mx-4 overflow-x-auto">
          {days.map((day) => (
            <button
              key={day.number}
              className={`w-12 h-12 rounded-full flex flex-col items-center justify-center ${
                selectedDay === day.number
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedDay(day.number)}
            >
              <span className="text-xs">{day.name}</span>
              <span className="font-semibold">{day.number}</span>
            </button>
          ))}
        </div>
        <button className="p-1 rounded hover:bg-gray-100">
          
        </button>
      </div>
    );
  };
  
  export default DateSelector;