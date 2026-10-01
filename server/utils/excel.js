import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

const EXCEL_DIR = path.join(process.cwd(), 'exports');
const EXCEL_FILE = path.join(EXCEL_DIR, 'commandes_miel.xlsx');

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(EXCEL_DIR)) {
  fs.mkdirSync(EXCEL_DIR, { recursive: true });
}

export const appendOrderToExcel = async (order) => {
  try {
    let workbook;
    let worksheet;
    
    // Vérifier si le fichier existe
    if (fs.existsSync(EXCEL_FILE)) {
      workbook = xlsx.readFile(EXCEL_FILE);
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
    } else {
      // Créer un nouveau workbook
      workbook = xlsx.utils.book_new();
      const headers = [
        'Date Commande',
        'Numéro Commande',
        'Client',
        'Email',
        'Produits',
        'Quantité Totale',
        'Prix Total',
        'Méthode Paiement',
        'Statut',
        'Adresse Livraison',
        'Ville',
        'Code Postal',
        'Pays'
      ];
      worksheet = xlsx.utils.aoa_to_sheet([headers]);
    }

    // Préparer les données de la commande
    const products = order.items.map(item => 
      `${item.name} (${item.container.type} - ${item.container.quantity} unités)`
    ).join(', ');

    const totalQuantity = order.items.reduce((sum, item) => sum + item.container.quantity, 0);

    const newRow = [
      new Date(order.createdAt).toLocaleDateString('fr-FR'),
      order._id.toString(),
      order.user?.name || 'N/A',
      order.user?.email || 'N/A',
      products,
      totalQuantity,
      order.totalPrice,
      order.paymentMethod,
      order.status,
      order.shippingAddress.address,
      order.shippingAddress.city,
      order.shippingAddress.postalCode,
      order.shippingAddress.country || 'France'
    ];

    // Ajouter la ligne
    const range = xlsx.utils.decode_range(worksheet['!ref'] || 'A1:A1');
    const newRowNumber = range.e.r + 1;
    
    newRow.forEach((value, index) => {
      const cellAddress = xlsx.utils.encode_cell({ r: newRowNumber, c: index });
      worksheet[cellAddress] = { v: value, t: typeof value === 'number' ? 'n' : 's' };
    });

    // Mettre à jour la plage
    range.e.r = newRowNumber;
    worksheet['!ref'] = xlsx.utils.encode_range(range);

    // Ajouter ou mettre à jour la feuille
    if (!workbook.SheetNames.includes('Commandes')) {
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Commandes');
    } else {
      workbook.Sheets['Commandes'] = worksheet;
    }

    // Sauvegarder
    xlsx.writeFile(workbook, EXCEL_FILE);
    
    console.log(`Commande ${order._id} ajoutée au fichier Excel`);
  } catch (error) {
    console.error('Erreur lors de l\'écriture Excel:', error);
    throw error;
  }
};

// Fonction pour obtenir toutes les commandes en format Excel
export const generateExcelReport = async (orders) => {
  const data = orders.map(order => ({
    'Date': new Date(order.createdAt).toLocaleDateString('fr-FR'),
    'Numéro': order._id,
    'Client': order.user?.name,
    'Email': order.user?.email,
    'Total': order.totalPrice,
    'Statut': order.status,
    'Produits': order.items.length
  }));

  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Rapport');

  return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};