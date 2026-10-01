import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiHome, FiShoppingBag } from 'react-icons/fi';

type OrderData = {
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    containerType: string;
  }>;
  total: number;
  shippingAddress: {
    address: string;
    city: string;
  };
  paymentMethod: string;
};

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order as OrderData;

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Commande non trouvée</h2>
        <p className="mb-6">Nous n'avons pas pu retrouver les détails de votre commande.</p>
        <button 
          onClick={() => navigate('/boutique')}
          className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700"
        >
          Retour à la boutique
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <FiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-amber-800 mb-4">Merci pour votre commande !</h1>
        <p className="mb-6">Votre commande #<span className="font-semibold">{order.orderId}</span> a bien été enregistrée.</p>
        
        <div className="text-left mb-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4 text-amber-700">Récapitulatif</h2>
          <div className="mb-2">
            <span className="font-medium">Adresse de livraison:</span> {order.shippingAddress.address}, {order.shippingAddress.city}
          </div>
          <div className="mb-4">
            <span className="font-medium">Moyen de paiement:</span> {order.paymentMethod}
          </div>
          
          <h3 className="font-medium mt-4 mb-2">Articles commandés:</h3>
          <ul className="space-y-2">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>
                  {item.quantity}x {item.name} ({item.containerType})
                </span>
                <span>{item.price.toLocaleString()} XAF</span>
              </li>
            ))}
          </ul>
          
          <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
            <span>Total</span>
            <span>{order.total.toLocaleString()} XAF</span>
          </div>
        </div>
        
        <p className="mb-6">Nous vous enverrons une confirmation par SMS lorsque votre commande sera expédiée.</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700"
          >
            <FiHome /> Retour à l'accueil
          </button>
          <button
            onClick={() => navigate('/boutique')}
            className="flex items-center justify-center gap-2 border border-amber-600 text-amber-600 px-6 py-2 rounded hover:bg-amber-50"
          >
            <FiShoppingBag /> Continuer vos achats
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;