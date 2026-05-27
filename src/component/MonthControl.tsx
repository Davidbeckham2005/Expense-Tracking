import { endOfMonth, format, startOfMonth } from "date-fns";
interface MonthControlProps {
    setMonth: (date: Date) => void,
    currentDate: Date
}
// currentDate la ngay hien tai.
export default function MonthControl({ setMonth, currentDate }: MonthControlProps) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between w-full">
                <button onClick={() => setMonth(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                    className="text-3xl font-bold px-4 py-2" > ←
                </button>
                <div className="flex space-x-2 text-sm items-center justify-center w-full max-w-xl bg-theme/10 mx-auto border rounded-lg px-4">
                    <h2 className="text-lg"> {format(currentDate, "MM/yyyy")} </h2>
                    <div className="text-sm text-gray-500">({format(startOfMonth(currentDate), "dd/MM")} - {" "} {format(endOfMonth(currentDate), "dd/MM")})
                    </div>
                </div>

                <button onClick={() => setMonth(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                    className="text-3xl font-bold px-4 py-2" > →
                </button>
            </div>
            {/* Range text */}


        </div>
    );
}