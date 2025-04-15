import React, { useState } from 'react';
import { createClient, updateClient } from '../services/api'; // Importar el servicio
import { Client } from '../types';


interface NewClientFormProps {
  onClose: () => void;
  initialData?: Client | null;
}

export function NewClientForm({ onClose, initialData }: NewClientFormProps) {
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (initialData) {
        await updateClient(initialData.id, formData);
      } else {
        setError('');
        setSuccess(false);
    
        try {
          const user = {
            full_name: formData.full_name,
            address: formData.address,
            phone: formData.phone,

          };
          await createClient(user); // Llamar al servicio para guardar el cliente
          setSuccess(true);
          setFormData({
            full_name: '',
            address: '',
            phone: '',
          });
          onClose();
        } catch (error) {
          setError('Error al crear el cliente'+error);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error creating/updating client');
    }
    
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">Nuevo Cliente</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">Cliente creado con éxito</p>}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Crear Cliente
          </button>
        </div>
      </form>
    </div>
  );
}