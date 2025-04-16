import { useState } from 'react';
import { Client, Loan } from '../../types';
import { PaginatedTable } from './PaginatedTable';
import { Modal } from '../Modal';
import { NewClientForm } from '../NewClientForm';

interface ClientsTabProps {
  clients: Client[];
  loans: Loan[];
  onNewClient: () => void;
  canCreateClient: boolean;
  onUpdate: () => void;
}

export const ClientsTab = ({ clients, loans, onNewClient, canCreateClient, onUpdate }: ClientsTabProps) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  // Add search state
  const [search, setSearch] = useState('');

  const hasActiveLoans = (clientId: string) => {
    return loans.some(loan => loan.client_id === clientId && loan.status === 'active');
  };

  
  const columns = [
    { header: 'Nombre', accessor: (client: Client) => client.full_name },
    { header: 'Teléfono', accessor: (client: Client) => client.phone },
    { header: 'Dirección', accessor: (client: Client) => client.address },
    { 
      header: 'WhatsApp', 
      accessor: (client: Client) => client.phone ? (
        <a 
          href={`https://wa.me/57${client.phone.replace(/\D/g, '')}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          Enviar mensaje
        </a>
      ) : ''
    },
    {
      header: 'Acciones',
      accessor: (client: Client) => (
        <div className="relative">
          <button 
            className="p-1 rounded-md hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedClient(client);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {selectedClient?.id === client.id && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setSelectedClient(client);
                    setShowEditModal(true);
                  }}
                >
                  Editar
                </button>
                {!hasActiveLoans(client.id) && (
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={() => {
                      // TODO: Implementar eliminación de cliente
                    }}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )
    }
  ];

  // Filter clients by full_name
  const filteredClients = clients.filter(client =>
    client.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h2 className="text-lg md:text-xl font-semibold">Lista de Clientes</h2>
        {/* Search input */}
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64 mb-2 md:mb-0 md:mr-2 px-2 py-1 border border-gray-300 rounded-md"
        />
        {canCreateClient && (
          <button
            onClick={onNewClient}
            className="w-full md:w-auto bg-blue-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-md hover:bg-blue-700 text-sm md:text-base"
          >
            Nuevo Cliente
          </button>
        )}
      </div>
      <PaginatedTable 
        data={filteredClients} 
        columns={columns.map(col => ({
          ...col,
          accessor: (client: Client) => col.accessor(client) || ''
        }))} 
      />

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Cliente"
      >
        <NewClientForm
          initialData={selectedClient}
          onClose={() => {
            setShowEditModal(false);
            onUpdate();
          }}
        />
      </Modal>
    </div>
  );
};