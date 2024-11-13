import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faEdit,
  faSignOutAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/AddProcessModal";
import getProcesos from "../api/getProcesos";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import { formatDateHours, formatDateNoHours } from "../utils/utils";
import getCadenas from "../api/getCadenas";
import useToast from "../hooks/useToast";
import { useAuth } from "../context/UseAuth";
import deleteProceso from "../api/deleteProceso";
import EditProcessModal from "../components/EditProcessModal";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";

const Dashboard = () => {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [chains, setChains] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProcessData, setSelectedProcessData] = useState({});
  const { logoutHandler } = useAuth();


  //
  const ActionCellRenderer = (props) => {

    const { data } = props;

    return (
      <div className="flex justify-evenly gap-3">
        <button className=" text-center" onClick={() => editRow(data)}>
          <FontAwesomeIcon icon={faEdit} className="text-green-900" />
        </button>
        <button className=" text-center" onClick={() => deleteRow(data)}>
          <FontAwesomeIcon icon={faTrash} className="text-red-700" />
        </button>
      </div>
    );
  };

  const editRow = (rowData) => {
    if (rowData.estado === "PEN") {
      setSelectedProcessData(rowData); // Set the selected process data
      handleClickOpen(); // Open the modal
    } else {
      showToast(
        "Error",
        "No se puede editar un proceso en estado diferente a PENDIENTE",
        "error"
      );
    }
  };

  const handleClickOpen = () => {
    setEditModalOpen(true);
  };

  const deleteRow = (rowData) => {
    console.log(rowData);

    if (rowData.estado !== "PEN") {
      showToast(
        "Error",
        "No se puede eliminar un proceso en estado diferente a PENDIENTE",
        "error"
      );
      return;
    }

    deleteProceso(rowData.id)
      .then((data) => {

        if (data.status === 401) {
          window.location.reload();
          showToast("Error", "Su sesión ha expirado", "error");
          logoutHandler();
        }
        showToast(
          "Proceso eliminado",
          "El proceso se ha eliminado correctamente",
          "success"
        );
        console.log(data);
        window.location.reload();
      })
      .catch((error) => {
        showToast(
          "Error al eliminar proceso",
          "No se pudo eliminar el proceso",
          "error"
        );
      });
  };

  const gridOptions = {
    localeText: {
      ...AG_GRID_LOCALE_ES,
      noRowsToShow: '', // Set to an empty string to disable, or add a custom message here
    },
  };

  const parseCustomDate = (dateStr) => {
    // Extract day, month, year, hour, and minute
    const [day, month, yearAndTime] = dateStr.split("/");
    const [year, time] = yearAndTime.split(" ");
    const [hour, minute] = time ? time.split(":") : [0, 0];
  
    return new Date(year, month - 1, day, hour, minute); // Month is 0-indexed
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "ID",
      field: "id",
      filter: true,
      hide: true,
      flex: 1,
      resizable: false,
    },
    {
      headerName: "Período",
      field: "periodo",
      filter: true,
      flex: 2,
      resizable: false,
    },
    {
      headerName: "Inicio de proceso",
      field: "fechaProceso",
      sortable: true,
      comparator: (dateA, dateB) => {
        const now = new Date();
      
        // Parse date strings to consistent Date objects
        const dA = parseCustomDate(dateA);
        const dB = parseCustomDate(dateB);
      
        // Check if date conversion was successful
        if (isNaN(dA.getTime()) || isNaN(dB.getTime())) {
          console.error("Invalid date:", { dateA, dateB });
          return 0; // Return 0 if either date is invalid to avoid NaN issues
        }
      
        // Calculate time differences from now
        const diffA = dA - now;
        const diffB = dB - now;
      
        // Both dates are in the future
        if (diffA > 0 && diffB > 0) {
          return diffA - diffB; // Smaller difference (closer future date) comes first
        }
      
        // Only one is in the future, prioritize the future date
        if (diffA > 0 && diffB <= 0) return -1;
        if (diffA <= 0 && diffB > 0) return 1;
      
        // Both dates are in the past
        if (diffA <= 0 && diffB <= 0) {
          return diffB - diffA; // More recent past date comes first
        }
      
        return 0;
      },
      
      sort: "asc",
      flex: 2,
      resizable: false,
    },
    {
      headerName: "Fecha de fin",
      field: "fechaFin",
      filter: true,
      hide: true,
      flex: 1,
      resizable: false,
    },
    {
      headerName: "Cadena",
      field: "cadena",
      filter: true,
      flex: 2,
      resizable: false,
    },
    {
      headerName: "País",
      field: "pais",
      filter: true,
      flex: 3,
      resizable: false,
    },
    {
      headerName: "Estado",
      field: "estado",
      sortable: true,
      /*comparator: (valueA, valueB) => {
        // Define ranks for each keyword
        const getRank = (value) => {
          if (value.includes("PEN")) return 1;
          if (value.includes("RUN")) return 2;
          if (value.includes("DON")) return 3;
          return 4; // Any other values come after PEN, RUN, and DON
        };
  
        // Get ranks for both values
        const rankA = getRank(valueA);
        const rankB = getRank(valueB);
  
        // Compare ranks
        if (rankA !== rankB) {
          return rankA - rankB; // Lower rank comes first
        }
  
        // If ranks are the same, sort alphabetically
        return valueA.localeCompare(valueB);
      },
      sort: "asc", // Initial sort order
      //filter: 'agTextColumnFilter', // Use text filter*/
      flex: 1,
      resizable: false,
    },
    {
      headerName: "Acciones",
      cellRenderer: ActionCellRenderer,
      cellRendererParams: {
        editRow: editRow,
        deleteRow: deleteRow,
      },
      flex: 1,
      resizable: false,
    },
  ]);

  // Reference to the grid API
  const gridRef = useRef();

  const transformData = (data) => {
    return data.map((item) => ({
      id: item.id,
      periodo: `${formatDateNoHours(item.initialDate)} - ${formatDateNoHours(
        item.endDate
      )}`,
      fechaProceso: formatDateHours(item.processDate),
      fechaFin: formatDateNoHours(item.endDate),
      cadena: item.nombreCadena,
      pais: item.nombrePais,
      estado: item.status,
    }));
  };

  // Logout handler
  const handleLogout = () => {
    showToast(
      "Sesión cerrada",
      "La sesión se ha cerrado correctamente",
      "success"
    );
    logoutHandler();
  };

  useEffect(() => {
    getProcesos().then((response) => {
      console.log(response);
      if (response.status === 401) {
        showToast("Error", "Su sesión ha expirado", "error");
        logoutHandler();
      }

      setRowData(transformData(response.data));
      showToast(
        "Procesos cargados",
        "Los procesos se han cargado correctamente",
        "success"
      );
    });

    getCadenas()
      .then((response) => {
        setChains(response.data);
      })
      .catch((error) => {
        showToast(
          "Error al cargar cadenas",
          "No se pudieron cargar las cadenas",
          "error"
        );
      });
  }, []);

  return (
    <div className="h-screen bg-white w-full flex flex-col">
      {/* Top Bar */}
      <div className="bg-red-600 p-4 flex justify-between items-center text-white w-full drop-shadow-xl">
        <div className="text-xl font-semibold">
          Programar cálculo de comisiones
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 hover:bg-red-500 p-2 rounded-md"
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
          <span>Cerrar sesión</span>
        </button>
      </div>

      {/* Main Dashboard Section */}
      <div className="flex flex-col bg-slate-100 flex-grow items-center p-8 w-full">
        <h1 className="text-3xl font-thin self-start mb-2">Procesos</h1>
        <div className="w-full max-h-[70dvh] bg-white border border-1 rounded-md flex flex-col p-2 gap-2">
          <div className="w-full flex justify-end gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-400 text-white px-4 py-2 rounded-md border border-blue-500 hover:bg-blue-500 w-2/12 self-end"
            >
              Agregar
              <FontAwesomeIcon icon={faAdd} className="h-4 w-4 ml-2" />
            </button>
          </div>
          <div
            className="ag-theme-quartz w-full" // applying the Data Grid theme
            style={{ height: 500 }} // the Data Grid will fill the size of the parent container
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              ref={gridRef}
              pagination={true} // Enable pagination
              paginationPageSize={10} // Set page size (number of rows per page)
              defaultColDef={{ filter: true, sortable: true }}
              rowHeight={50}
              onGridReady={(params) => params.columnApi.applyColumnState({
                state: [{ colId: 'fechaProceso', sort: 'asc' }],
                applyOrder: true
              })}
              gridOptions={gridOptions}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        chains={chains}
      />
      <EditProcessModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        process={selectedProcessData}
        countries={countries}
        chains={chains}
      />
    </div>
  );
};

export default Dashboard;
