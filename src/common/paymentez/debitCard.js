import axios from 'axios';

export default async function Debito(uid, email, card, referencia, order, tokenCard) {

  const appkey = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY_S;
  const appcode = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE_S;

  const variableTimestamp = String(Math.floor(Date.now() / 1000) + 13);
  const uniq_token_string = appkey + variableTimestamp;
  const uniq_token_hash = require('crypto').createHash('sha256').update(uniq_token_string).digest('hex');
  const auth_token = Buffer.from(appcode + ';' + variableTimestamp + ';' + uniq_token_hash).toString('base64');

  const user_id = order?.customer?.user?.id;
  const user_email = order?.customer?.user?.email || "sample@test.com";
  const firstname = order?.customer?.name || "";
  const lastname = order?.customer?.lastName || "";
  const phone = order?.customer?.phone || "";
  const count = order?.items?.length;
  const product = (order?.items && count > 0) ? order?.items[0].description : "";
  const description = (count > 0) ? `Compre ${count} productos, incluido ${product}` : "";

  const total = order?.total;         // Cent to Dollar
  const tax_percentage = 14;
  const amount = parseFloat((total * (1 + tax_percentage / 100)).toFixed(2));
  const VAT = parseFloat((total * tax_percentage / 100).toFixed(2));
  const taxable_amount = parseFloat((amount - VAT).toFixed(2));

  const payloadOption = {
    "user": {                                 //  Type          Require   Description
      "id": user_id.toString(),               //  String        Y         Customer identifier. This is the identifier you use inside your application.
      "first_name": firstname,                //  String        N         User name 
      "last_name": lastname,                  //  String        N         User last name
      "email": user_email,                    //  String        Y         Buyer email, with valid e-mail format
      "phone": phone,                         //  String        N         Buyer phone
    },
    "order": {
      "amount": amount,                       //  Number        Y         Amount to debit. Format: Decimal with two fraction digits.
      "description": description,             //  String        Y         Description of the order to be purchase. Format: (Maximum Length 250)
      "dev_reference": referencia,            //  String        Y         Merchant order reference. You will identify this purchase using this reference.
      "vat": VAT,                             //  Number        Y         Sales tax amount, included in product cost. Format: Decimal with two fraction digits.
      "taxable_amount": taxable_amount,       //  Number        N         Only available for Ecuador and Colombia. The taxable amount is the total amount of all taxable items excluding tax. If not sent, it's calculated on the total. Format: Decimal with two fraction digits.
      "tax_percentage": tax_percentage,       //  Number        N         Only available for Ecuador and Colombia. The tax rate to be applied to this order. For Ecuador should be 0 or 12.
      "months_grace": 3                       //  Number        N         Only available for Mexico and Ecuador (Medianet), the number of months of grace for a deferred payment.
    },
    "card": {
      "token": tokenCard
    }
  };

  try {
    const debito = await axios.post(`https://ccapi.paymentez.com/v2/transaction/debit`,
      payloadOption,
      {
        headers: {
          "Content-Type": "application/json",
          "auth-token": auth_token
        }
      });
    return debito;

  } catch (error) {
    console.log(error);
  }
} 
