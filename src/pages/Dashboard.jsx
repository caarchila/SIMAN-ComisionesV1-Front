import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faEdit,
  faSignOutAlt,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/AddProcessModal";
import getProcesos from "../api/getProcesos";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import { formatDate } from "../utils/utils";
import getPaises from "../api/getPaises";
import getCadenas from "../api/getCadenas";
import useToast from "../hooks/useToast";
import { useAuth } from "../context/UseAuth";
import deleteProceso from "../api/deleteProceso";
import EditProcessModal from "../components/EditProcessModal";

const Dashboard = () => {

  const {showToast} = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [chains, setChains] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProcessData, setSelectedProcessData] = useState({});
  const { logoutHandler, user } = useAuth();

  const ActionCellRenderer = (props) => {

    const { onEditRow, data } = props;

    return (
      <div className="flex justify-evenly gap-3">
      <button className=" text-center" onClick={() => editRow(data)}>
        <FontAwesomeIcon icon={faEdit} className="text-green-900"/>
      </button>
      <button className=" text-center" onClick={() => deleteRow(props.data.id)}>
        <FontAwesomeIcon icon={faTrash} className="text-red-700" />
      </button>
      </div>
    );
  };

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "ID", field: "id", maxWidth: 100, filter: true, resizable: false, hide: true },
    { headerName: "Período", field: "periodo", filter: true, resizable: false, maxWidth: 250 },
    { headerName: "Inicio de proceso", field: "fechaProceso", maxWidth: 150,  filter: true, resizable: false},
    { headerName: "Fecha de fin", field: "fechaFin", maxWidth: 150, filter: true, resizable: false},
    { headerName: "Cadena", field: "cadena", maxWidth: 100,  filter: true, resizable: false},
    { headerName: "País", field: "pais", filter: true, resizable: false},
    { headerName: "Estado", field: "estado", maxWidth: 100, filter: true, resizable: false},
    {
      headerName: "Actions",
      cellRenderer: ActionCellRenderer,
      cellRendererParams: {
        editRow: editRow, // Ensure this is passed correctly

        deleteRow: deleteRow, // Ensure this is passed correctly
      },
      maxWidth: 150
    },
  ]);

  // Reference to the grid API
  const gridRef = useRef();

  // Auto-size columns to fit content
  const onGridReady = (params) => {
    gridRef.current = params.api;
    params.api.sizeColumnsToFit(); // Makes the columns fit the grid width initially
    autoSizeAllColumns(); // Adjusts each column based on content
  };

  const autoSizeAllColumns = () => {
    const allColumnIds = gridRef.current.columnApi
      .getAllColumns
      .map((column) => column.getId());
    gridRef.current.columnApi.autoSizeColumns(allColumnIds);
  };

  const transformData = (data) => {
    return data.map((item) => ({
      id: item.id,
      periodo: `${item.initialDate} - ${item.endDate}`,
      fechaProceso: formatDate(item.processDate),
      fechaFin: item.endDate,
      cadena: item.nombreCadena,
      pais: item.nombrePais,
      estado: item.status,
    }));
  };
  const handleLogout = () => {
    showToast('Sesión cerrada', 'La sesión se ha cerrado correctamente', 'success');
    logoutHandler();
  };

  const editRow = (rowData) => {
    setSelectedProcessData(rowData); // Set the selected process data
    handleClickOpen(); // Open the modal
  };

  const handleClickOpen = () => {
    setEditModalOpen(true);
  };

  const deleteRow = (id) => {
    console.log("Deleting row with id:", id);

    deleteProceso(id).then((data) => {
      showToast('Proceso eliminado', 'El proceso se ha eliminado correctamente', 'success');
    }).catch((error) => {
      showToast('Error al eliminar proceso', 'No se pudo eliminar el proceso', 'error');
    });
    
  };

  useEffect(() => {

    getProcesos().then((data) => {
      console.log(data);
      setRowData(transformData(data));
      showToast('Procesos cargados', 'Los procesos se han cargado correctamente', 'success');
    }).catch((error) => {
      showToast('Error al cargar procesos', 'No se pudieron cargar los procesos', 'error');
    });

    getPaises().then((data) => {
      setCountries(data);
    }).catch((error) => {
      showToast('Error al cargar países', 'No se pudieron cargar los países', 'error');
    });

    getCadenas().then((data) => {
      setChains(data);
    }).catch((error) => {
      showToast('Error al cargar cadenas', 'No se pudieron cargar las cadenas', 'error');
    }
    );

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
              onGridReady={onGridReady}
              ref={gridRef}
              pagination={true} // Enable pagination
              paginationPageSize={10} // Set page size (number of rows per page)
              defaultColDef={{ filter: true, sortable: true}}
              rowHeight={50}
            />
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} countries={countries} chains={chains} />
      <EditProcessModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} process={selectedProcessData} countries={countries} chains={chains} />
    </div>
  );
};

export default Dashboard;
