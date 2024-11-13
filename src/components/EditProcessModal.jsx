import React, { useState, useEffect } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useToast from "../hooks/useToast";
import { areDatesInSameMonth, isDateBefore, isValidFutureDate } from "../utils/utils";
import getProceso from "../api/getProceso";
import updateProceso from "../api/updateProceso";
import DatePicker, { registerLocale } from "react-datepicker";
import { es, is } from "date-fns/locale"; // Import Spanish locale

const EditProcessModal = ({
  isOpen,
  onClose,
  process,
  countries = [],
  chains = [],
}) => {
  // Initialize state with process properties or empty strings
  const [selectedChain, setSelectedChain] = useState(process?.cadenaId || "");
  const [selectedCountry, setSelectedCountry] = useState(process?.paisId || "");
  const [startDate, setStartDate] = useState(process?.initialDate || "");
  const [endDate, setEndDate] = useState(process?.endDate || "");
  const [processDate, setProcessDate] = useState(process?.processDate || "");
  const [processId, setProcessId] = useState();
  const { showToast } = useToast();
  registerLocale("es", es);

  const orgUnits = [
    { id: 82, description: "El Salvador" },
    { id: 102, description: "Guatemala" },
    { id: 110, description: "Nicaragua" },
    { id: 1074, description: "Costa Rica" },
  ];

  useEffect(() => {
    if (process.status !== "PEN") {
      getProceso(process)
        .then((data) => {
          console.log(data);
          setProcessId(data.id);
          setSelectedChain(data.cadenaId);
          setSelectedCountry(data.paisId);
          setStartDate(data.initialDate);
          setEndDate(data.endDate);
          setProcessDate(convertToDateInputFormat(data.processDate));
        })
        .catch((error) => {
          onClose();
          setSelectedChain("");
          setSelectedCountry("");
          setStartDate("");
          setEndDate("");
          setProcessDate("");
          if (isOpen) {
            showToast(
              "Error",
              "No se puede editar un proceso en estado diferente a PENDIENTE",
              "error"
            );
          }
        });
    } else {
      onClose();
      setSelectedChain("");
      setSelectedCountry("");
      setStartDate("");
      setEndDate("");
      setProcessDate("");
      if (isOpen) {
        showToast(
          "Error",
          "No se puede editar un proceso en estado diferente a PENDIENTE",
          "error"
        );
      }
    }
  }, [isOpen, process]);

  const handleDateChange = (date) => {
    const inputtedDate = new Date(date);
    inputtedDate.setDate(inputtedDate.getDate() + 1);
    return inputtedDate.toISOString().split("T")[0]; // Return formatted date string
  };

  const convertToDateInputFormat = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const convertToTimestamp = (dateString) => {
    const date = new Date(dateString);
    return date.getTime();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (areDatesInSameMonth(startDate, endDate) &&
    isDateBefore(startDate, endDate) && 
    isValidFutureDate(processDate)) {
      const data = {
        id: processId,
        cadenaId: selectedChain,
        paisId: selectedCountry,
        processDate: convertToTimestamp(processDate),
        initialDate: handleDateChange(startDate),
        endDate: handleDateChange(endDate),
        createId: localStorage.getItem("user"),
        lastUpdateId: localStorage.getItem("user"),
      };
      updateProceso(data)
        .then((response) => {
          if (response.status === 401) {
            window.location.href = "/rrhh-comisiones";
            showToast("Error", "Su sesión ha expirado", "error");
            logoutHandler();
          }
          showToast(
            "Proceso actualizado",
            "El proceso se ha actualizado correctamente",
            "success"
          );
          window.location.reload();
          onClose();
        })
        .catch((error) => {
          showToast(
            "Error",
            "Ha ocurrido un error al actualizar el proceso",
            "error"
          );
        });
    } else if (areDatesInSameMonth(startDate, endDate) === false) {
      showToast("error", "Las fechas no están en el mismo mes", "error");
    }
    else if (isDateBefore(startDate, endDate) === false) {
      showToast("error", "La fecha de inicio debe ser anterior a la fecha de fin", "error");
    }
    else if (isValidFutureDate(processDate) === false) {
      showToast("error", "La fecha de proceso debe ser en el futuro", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-100">
      <div className="bg-white rounded-lg shadow-lg w-5/6 md:w-2/3 lg:w-2/3">
        <div className="bg-red-600 p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-white text-lg font-semibold">
            Programación de Proceso
          </h2>
          <button onClick={onClose} className="text-white">
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 w-full">
          <form onSubmit={handleSubmit}>
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
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                required
              >
                <option value="">--Seleccione--</option>
                {orgUnits.map((option) => (
                  <option key={option.description} value={option.id}>
                    {option.description}
                  </option>
                ))}
              </select>
            </div>

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

            <div className="p-2 md:flex justify-between items-center">
              <label className="hidden md:block">
                <span className="block text-sm font-medium text-gray-700">
                  Rango de fechas
                </span>
              </label>
              <div className="w-full md:w-2/3 flex flex-col md:flex lg:flex-row justify-between gap-3">
                <div className="w-full flex md:flex-col justify-between md:w-full">
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha de inicio
                  </label>
                  <DatePicker
                    locale="es"
                    selected={
                      startDate ? new Date(startDate + "T00:00:00") : null
                    }
                    onChange={(date) => {
                      if (date && !isNaN(date.getTime())) {
                        // check if the date is valid
                        setStartDate(date.toISOString().split("T")[0]); // format as "YYYY-MM-DD" if needed
                      }
                    }}
                    className="p-2 border rounded-md w-2/3 md:w-full bg-white"
                    dateFormat="dd/MM/yyyy"
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
                  locale="es"
                    selected={endDate ? new Date(endDate + "T00:00:00") : null}
                    id="endDate"
                    name="endDate"
                    className="p-2 border rounded-md w-2/3 md:w-full bg-white"
                    onChange={(date) => {
                      if (date && !isNaN(date.getTime())) {
                        // check if the date is valid
                        setEndDate(date.toISOString().split("T")[0]); // format as "YYYY-MM-DD" if needed
                      }
                    }}
                    dateFormat="dd/MM/yyyy"
                    required
                    customInput={<input readOnly maxLength={0} className="p-2 border rounded-md w-2/3 md:w-full bg-white" />}
                  />
                </div>
              </div>
            </div>

            <div className="p-2 flex items-center w-full space-x-44">
              <label
                htmlFor="processDate"
                className="block text-sm font-medium text-gray-700"
              >
                Fecha de proceso
              </label>

              <DatePicker
              locale="es"
                selected={processDate ? new Date(processDate) : null}
                onChange={(date) => {
                  if (date) {
                    // Convert the selected date to a local datetime string in "YYYY-MM-DDTHH:MM" format
                    const localDateTime = new Date(
                      date.getTime() - date.getTimezoneOffset() * 60000
                    )
                      .toISOString()
                      .slice(0, 16);

                    setProcessDate(localDateTime);
                  }
                }}
                className="p-2 border rounded-md bg-white full-width"
                showTimeSelect
                timeFormat="HH:mm aa"
                timeIntervals={1} // Adjust time intervals as needed
                dateFormat="dd/MM/yyyy' 'HH:mm aa"
                placeholderText="dd/mm/yyyy HH:mm"
                required
                customInput={<input readOnly maxLength={0} className="p-2 border rounded-md w-2/3 md:w-full bg-white" />}
              />
            </div>

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
export default EditProcessModal;
