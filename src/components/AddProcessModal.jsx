import React, { useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { postProceso } from "../api/postProceso";
import { useAuth } from "../context/UseAuth";
import useToast from "../hooks/useToast";
import { areDatesInSameMonth } from "../utils/utils";

const AddProcessModal = ({ isOpen, onClose, countries, chains }) => {
  const [selectedChain, setSelectedChain] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [processDate, setProcessDate] = useState("");
  const { user } = useAuth();
  const { showToast } = useToast();

  const handleDateChange = (date) => {
    const inputtedDate = new Date(date);
    const formattedDate = inputtedDate.setDate(inputtedDate.getDate() + 1);
    return formattedDate;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (areDatesInSameMonth(startDate, endDate) === true) {
      const data = {
        cadenaId: selectedChain,
        paisId: selectedCountry,
        processDate: handleDateChange(processDate),
        initialDate: handleDateChange(startDate),
        endDate: handleDateChange(endDate),
        status: "PEN",
        createId: user.Username,
      };

      postProceso(data)
        .then((response) => {
          console.log(response);
          showToast(
            "Proceso creado",
            "El proceso se ha creado correctamente",
            "success"
          );
        })
        .catch((error) => {
          showToast(
            "Error",
            "Ha ocurrido un error al crear el proceso",
            "error"
          );
        });

      isOpen = false;
      window.location.reload();
    } else if (areDatesInSameMonth(startDate, endDate) === false) {
      showToast(
        "Error",
        "Las fechas de inicio y fin deben estar en el mismo mes",
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
                {countries.map((option) => (
                  <option key={option.descripcion} value={option.id}>
                    {option.descripcion}
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
              <div className="w-full md:w-2/3 flex flex-col md:flex lg:flex-row justify-between gap-3">
                <div className="w-full flex md:flex-col justify-between md:w-full">
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    className="p-2 border rounded-md w-2/3 md:w-full bg-white"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="w-full flex md:flex-col justify-between md:w-full">
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fecha de cierre
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    className="p-2 border rounded-md w-2/3 md:w-full bg-white"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="p-2 flex items-center justify-between">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                Fecha de proceso
              </label>
              <input
                type="date"
                id="processDate"
                name="processDate"
                className="p-2 border rounded-md w-2/3 bg-white"
                value={processDate}
                onChange={(e) => setProcessDate(e.target.value)}
                required
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
