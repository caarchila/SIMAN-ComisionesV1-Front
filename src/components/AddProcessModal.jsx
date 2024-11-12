import React, { useState } from "react";
import { faCalendar, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { postProceso } from "../api/postProceso";
import { useAuth } from "../context/UseAuth";
import useToast from "../hooks/useToast";
import {
  areDatesInSameMonth,
  formatDateHours,
  isDateBefore,
  isValidFutureDate,
  parseDateTimeLocal,
} from "../utils/utils";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO, addDays } from "date-fns";
import { es } from "date-fns/locale"; // Import Spanish locale

const AddProcessModal = ({ isOpen, onClose, chains }) => {
  const [selectedChain, setSelectedChain] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [processDate, setProcessDate] = useState("");
  registerLocale("es", es);

  const { showToast } = useToast();

  const orgUnits = [
    { id: 82, description: "El Salvador" },
    { id: 102, description: "Guatemala" },
    { id: 110, description: "Nicaragua" },
    { id: 1074, description: "Costa Rica" },
  ];

  const handleDateChange = (date) => {
    // Add 1 day to the stored date and return it
    const nextDay = addDays(date, 1);
    console.log(nextDay);

    return nextDay;
  };

  const handleDateInput = (date) => {
    // Format the date as 'yyyy-MM-dd' directly for storage
    const formattedDate = format(date, "yyyy-MM-dd");
    setStartDate(formattedDate);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      areDatesInSameMonth(startDate, endDate) &&
      isValidFutureDate(processDate) &&
      isDateBefore(startDate, endDate)
    ) {
      const data = {
        cadenaId: selectedChain,
        paisId: selectedCountry,
        processDate: parseDateTimeLocal(processDate), // dont call the handleDateChange function here to avoid +1 day on the date
        initialDate: handleDateChange(startDate),
        endDate: handleDateChange(endDate),
        status: "PEN",
        createId: localStorage.getItem("user"),
      };

      console.log(formatDateHours(data.processDate));

      postProceso(data)
        .then((response) => {

          if (response.status === 401) {
            showToast("Error", "Su sesión ha expirado", "error");
            logoutHandler();
          }

          showToast(
            "Proceso creado",
            "El proceso se ha creado correctamente",
            "success"
          );
          onClose();
          window.location.reload();
        })
        .catch((error) => {
          showToast(
            "Error",
            "Ha ocurrido un error al crear el proceso",
            "error"
          );
        });
    } else if (areDatesInSameMonth(startDate, endDate) === false) {
      showToast(
        "Error",
        "Las fechas de inicio y fin deben estar en el mismo mes",
        "error"
      );
    } else if (isValidFutureDate(processDate) === false) {
      showToast("Error", "La fecha de proceso debe ser en el futuro", "error");
    } else if (isDateBefore(startDate, endDate) === false) {
      showToast(
        "Error",
        "La fecha de inicio debe ser anterior a la fecha de fin",
        "error"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-100">
      <div className="bg-white rounded-lg shadow-lg w-5/6 md:w-2/3 lg:w-2/3">
        {/* Modal Header */}
        <div className="bg-red-600 p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-white text-lg font-semibold">
            Programación de Proceso
          </h2>
          <button onClick={onClose} className="text-white">
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 w-full">
          <form onSubmit={handleSubmit} className="">
            {/* Country Select */}
            <div className="p-2 flex items-center justify-between">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                País
              </label>
              <select
                id="country"
                name="country"
                className="mt-1 p-2 border rounded-md w-2/3 bg-white"
                value={selectedCountry.id}
                onChange={(e) => setSelectedCountry(e.target.value)}
                required
              >
                <option value="">--Seleccione--</option>
                {orgUnits.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Chain Select */}
            <div className="p-2 flex items-center justify-between">
              <label
                htmlFor="chain"
                className="block text-sm font-medium text-gray-700"
              >
                Cadena
              </label>
              <select
                id="chain"
                name="chain"
                className="mt-1 p-2 border rounded-md w-2/3 bg-white"
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                required
              >
                <option value="">--Seleccione--</option>
                {chains.map((option) => (
                  <option key={option.name} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date range */}
            <div className="p-2 md:flex justify-between items-center">
              <label className="hidden md:block">
                <span className="block text-sm font-medium text-gray-700 self-start">
                  Rango de fechas
                </span>
              </label>

              {/* Date Inputs */}
              <div className="w-full md:w-2/3 flex flex-col md:flex lg:flex-row justify-between gap-3 mb-1">
                <div className="w-full flex md:flex-col justify-between md:w-full">
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha de inicio
                  </label>
                  <DatePicker
                    locale="es" // Set locale to Spanish
                    selected={startDate ? parseISO(startDate) : null} // Only parse if there's a valid date
                    
                    onChange={(date) => {
                      if (date && !isNaN(date.getTime())) {
                        // check if the date is valid
                        setStartDate(date.toISOString().split("T")[0]); // format as "YYYY-MM-DD" if needed
                      }
                    }}
                    dateFormat="dd/MM/yyyy" // Display format: dd/mm/yyyy
                    placeholderText="dd/mm/yyyy" // Placeholder text
                    className="p-2 border rounded-md w-2/3 md:w-full bg-white"
                    required
                    customInput={<input readOnly maxLength={0} className="p-2 border rounded-md w-2/3 md:w-full bg-white" />}
                  />
                </div>
                <div className="w-full flex md:flex-col justify-between md:w-full">
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha de cierre
                  </label>
                  <DatePicker
                    locale="es" // Set locale to Spanish
                    selected={endDate ? parseISO(endDate) : null} // Only parse if there's a valid date
                    onChange={(date) => {
                      if (date && !isNaN(date.getTime())) {
                        // check if the date is valid
                        setStartDate(date.toISOString().split("T")[0]); // format as "YYYY-MM-DD" if needed
                      }
                    }}
                    dateFormat="dd/MM/yyyy" // Display format: dd/mm/yyyy
                    placeholderText="dd/mm/yyyy"
                    className="p-2 border rounded-md w-2/3 md:w-full bg-white"
                    required
                    customInput={<input readOnly maxLength={0} className="p-2 border rounded-md w-2/3 md:w-full bg-white" />}
                  />
                </div>
              </div>
            </div>
            <div className="p-2 flex items-center w-full space-x-44">
              {" "}
              {/* Use space-x-4 for spacing */}
              <label
                htmlFor="processDate"
                className="block text-sm font-medium text-gray-700"
              >
                Fecha de proceso
              </label>
              <DatePicker
                locale="es" // Set locale to Spanish
                selected={processDate ? parseISO(processDate) : null}
                onChange={(date) =>
                  setProcessDate(format(date, "yyyy-MM-dd'T'HH:mm"))
                }
                showTimeSelect
                timeFormat="HH:mm aa"
                timeIntervals={1}
                dateFormat="dd/MM/yyyy HH:mm aa"
                placeholderText="dd/mm/yyyy HH:mm"
                className="p-2 border rounded-md bg-white full-width" // Ensure DatePicker takes full width
                required
                customInput={<input readOnly maxLength={0} className="p-2 border rounded-md w-2/3 md:w-full bg-white" />}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 w-full mt-3">
              <button
                onClick={onClose}
                className="bg-slate-500 text-white font-bold py-2 px-4 rounded hover:bg-red-400"
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-400"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProcessModal;
