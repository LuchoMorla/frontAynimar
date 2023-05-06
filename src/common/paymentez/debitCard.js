import axios from 'axios';

export default async function Debito(uid, email, card, referencia, order, tokenCard) {

  const appkey = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_KEY_S;
  const appcode = process.env.NEXT_PUBLIC_API_PAYMENTEZ_API_CODE_S;

  const variableTimestamp = String(Math.floor(Date.now() / 1000) + 13);
  const uniq_token_string = appkey + variableTimestamp;
  const uniq_token_hash = require('crypto').createHash('sha256').update(uniq_token_string).digest('hex');
  const auth_token = Buffer.from(appcode + ';' + variableTimestamp + ';' + uniq_token_hash).toString('base64');

  const customer_id = order?.customer?.id;
  const user_email = order?.customer?.user?.email;
  const firstname = order?.customer?.name;
  const lastname = order?.customer?.lastname;
  const phone = order?.customer?.phone;
  const count = order?.items?.length;
  const product = (order?.items && count > 0) ? order?.items[0].description : "";
  const description = (count > 0) ? `Compre ${count} productos, incluido ${product}` : "";

  const total = order?.total / 100;         // Cent to Dollar
  const tax_percentage = 12.00 / 100;
  const total_IVA = (total * (1 + tax_percentage)).toFixed(2);
  const taxable_amount = (total * tax_percentage).toFixed(2);
  const vat = (total * tax_percentage).toFixed(2);

  console.log({ total }, { tax_percentage }, { total_IVA }, { vat }, { order });

  try {
    const debito = await axios.post(`https://ccapi-stg.paymentez.com/v2/transaction/debit`, {
      "user": {                                 //  Type          Require   Description
        "id": customer_id.toString(),           //  String        Y         Customer identifier. This is the identifier you use inside your application.
        "first_name": firstname,                //  String        N         User name 
        "last_name": lastname,                  //  String        N         User last name
        "email": user_email,                    //  String        Y         Buyer email, with valid e-mail format
        "phone": phone,                         //  String        N         Buyer phone
      },
      "order": {
        "amount": total_IVA,                    //  Number        Y         Amount to debit. Format: Decimal with two fraction digits.
        "currency": "USD",                      //
        "description": description,             //  String        Y         Description of the order to be purchase. Format: (Maximum Length 250)
        "dev_reference": referencia,            //  String        Y         Merchant order reference. You will identify this purchase using this reference.
        "vat": vat,                             //  Number        Y         Sales tax amount, included in product cost. Format: Decimal with two fraction digits.
        "installments": 1,                      //  Number        N         The number of installments for the payment, only for COP, MXN, BRL, PEN, CLP and USD (Ecuador).
        "installments_type": 2,                 //  Number        N         Only available for Ecuador and Mexico.
        "taxable_amount": taxable_amount,       //  Number        N         Only available for Ecuador and Colombia. The taxable amount is the total amount of all taxable items excluding tax. If not sent, it's calculated on the total. Format: Decimal with two fraction digits.
        "tax_percentage": tax_percentage,       //  Number        N         Only available for Ecuador and Colombia. The tax rate to be applied to this order. For Ecuador should be 0 or 12.
        "months_grace": 3                       //  Number        N         Only available for Mexico and Ecuador (Medianet), the number of months of grace for a deferred payment.
      },
      "card": {
        "token": tokenCard
      }
    },
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
