import React, { useEffect, useRef, useState } from "react";
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
import {formatDateHours, formatDateNoHours } from "../utils/utils";
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

    const {data} = props;

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

  const editRow = (rowData) => {
    
    if (rowData.estado === "PEN") {
      setSelectedProcessData(rowData); // Set the selected process data
      handleClickOpen(); // Open the modal
    } else {
      showToast('Error', 'No se puede editar un proceso en estado diferente a PENDIENTE', 'error');
    
    }
  };

  const handleClickOpen = () => {
    setEditModalOpen(true);
  };

  const deleteRow = (id) => {

    deleteProceso(id).then((data) => {
      showToast('Proceso eliminado', 'El proceso se ha eliminado correctamente', 'success');
      window.location.reload();
    }).catch((error) => {
      showToast('Error al eliminar proceso', 'No se pudo eliminar el proceso', 'error');
    });
    
  };

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "ID", field: "id", filter: true, hide: true, flex: 1 },
    { headerName: "Período", field: "periodo", filter: true, flex: 2 },
    { headerName: "Inicio de proceso", field: "fechaProceso", filter: true, flex: 2 },
    { headerName: "Fecha de fin", field: "fechaFin", filter: true, hide: true, flex: 1 },
    { headerName: "Cadena", field: "cadena", filter: true, flex: 2 },
    { headerName: "País", field: "pais", filter: true, flex: 3 },
    { headerName: "Estado", field: "estado", filter: true, flex: 1 },
    {
      headerName: "Actions",
      cellRenderer: ActionCellRenderer,
      cellRendererParams: {
        editRow: editRow,
        deleteRow: deleteRow,
      },
      
      flex: 1,
    },
  ]);

  // Reference to the grid API
  const gridRef = useRef();

  // Auto-size columns to fit content
  const onGridReady = (params) => {
    const allColumnIds = params.columnApi.getAllColumns().map((col) => col.getId());
    params.columnApi.autoSizeColumns(allColumnIds);
  };

  const transformData = (data) => {
    return data.map((item) => ({
      id: item.id,
      periodo: `${formatDateNoHours(item.initialDate)} - ${formatDateNoHours(item.endDate)}`,
      fechaProceso: formatDateHours(item.processDate),
      fechaFin: formatDateNoHours(item.endDate),
      cadena: item.nombreCadena,
      pais: item.nombrePais,
      estado: item.status,
    }));
  };
  const handleLogout = () => {
    showToast('Sesión cerrada', 'La sesión se ha cerrado correctamente', 'success');
    logoutHandler();
  };

  useEffect(() => {

    getProcesos().then((data) => {
      setRowData(transformData(data));
      showToast('Procesos cargados', 'Los procesos se han cargado correctamente', 'success');
    }).catch((error) => {
      showToast('Error al cargar procesos', 'No se pudieron cargar los procesos', 'error');
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
              ref={gridRef}
              pagination={true} // Enable pagination
              paginationPageSize={10} // Set page size (number of rows per page)
              defaultColDef={{ filter: true, sortable: true}}
              rowHeight={50}
            />
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} chains={chains} />
      <EditProcessModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} process={selectedProcessData} countries={countries} chains={chains} />
    </div>
  );
};

export default Dashboard;
