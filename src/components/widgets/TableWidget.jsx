import React from 'react';

const orders = [
  {
    id: 1,
    date: '2025-07-01',
    price: '€120.00',
    status: 'Livrée',
    client: 'Jean Dupont',
    payment: 'Carte bancaire',
    country: 'France'
  },
  {
    id: 2,
    date: '2025-07-02',
    price: '€75.50',
    status: 'En cours',
    client: 'Alice Martin',
    payment: 'PayPal',
    country: 'Belgique'
  },
  {
    id: 3,
    date: '2025-07-03',
    price: '€210.99',
    status: 'Annulée',
    client: 'Marc Bernard',
    payment: 'Virement',
    country: 'France'
  },
  {
    id: 4,
    date: '2025-07-04',
    price: '€99.00',
    status: 'Livrée',
    client: 'Sophie Leclerc',
    payment: 'Carte bancaire',
    country: 'Suisse'
  },
  {
    id: 5,
    date: '2025-07-05',
    price: '€55.75',
    status: 'En attente',
    client: 'Luc Moreau',
    payment: 'PayPal',
    country: 'Luxembourg'
  },
];

const statusColor = {
  'Livrée': 'text-green-700 bg-green-100',
  'En cours': 'text-blue-700 bg-blue-100',
  'Annulée': 'text-red-700 bg-red-100',
  'En attente': 'text-yellow-700 bg-yellow-100',
};

const TableWidget = React.memo(() => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm text-gray-700">
      <thead className="bg-gray-100 text-xs uppercase text-gray-600">
        <tr>
          <th className="px-3 py-2 text-left">ID</th>
          <th className="px-3 py-2 text-left">Date</th>
          <th className="px-3 py-2 text-left">Client</th>
          <th className="px-3 py-2 text-left">Prix</th>
          <th className="px-3 py-2 text-left">Statut</th>
          <th className="px-3 py-2 text-left">Paiement</th>
          <th className="px-3 py-2 text-left">Pays</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {orders.map((order) => (
          <tr key={order.id} className="hover:bg-gray-50">
            <td className="px-3 py-2">{order.id}</td>
            <td className="px-3 py-2">{order.date}</td>
            <td className="px-3 py-2">{order.client}</td>
            <td className="px-3 py-2">{order.price}</td>
            <td className="px-3 py-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[order.status]}`}>
                {order.status}
              </span>
            </td>
            <td className="px-3 py-2">{order.payment}</td>
            <td className="px-3 py-2">{order.country}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

export default TableWidget;