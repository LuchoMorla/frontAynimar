/* const tPaymentez = () => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if(isBrowser == true) {
    // Execute immediately
  (function () {
    // === Variable to use ===
    let environment = 'stg';
    let application_code = 'APP-CODE-CLIENT';  // Provided by Payment Gateway
    let application_key = 'app_key_client';  // Provided by Payment Gateway
    let submitButton = document.querySelector('#tokenize_btn');
    let retryButton = document.querySelector('#retry_btn');
    let submitInitialText = submitButton.textContent;

    // Get the required additional data to tokenize card
    let get_tokenize_data = () => {
      let data = {
        locale: 'en',
        user: {
          id: String(Math.floor((new Date).getTime() / 1000)),
          email: 'jhon@doe.com',
        },
        configuration: {
          default_country: 'COL'
        },
      };
      return data;
    };

    // === Required callbacks ===
    // Executed when was called 'tokenize' function but the form was not completed.
    let notCompletedFormCallback = message => {
      document.getElementById('response').innerHTML = `Not completed form: ${message}, Please fill required data`;
      submitButton.innerText = submitInitialText;
      submitButton.removeAttribute('disabled');
    };

    // Executed when was called 'tokenize' and the services response successfully.
    let responseCallback = response => {
      // Example of success tokenization.
      //   {
      //    "card": {
      //     "bin": "411111",
      //     "status": "valid",
      //     "token": "2508629432271853872",
      //     "message": "",
      //     "expiry_year": "2033",
      //     "expiry_month": "12",
      //     "transaction_reference": "RB-143809",
      //     "type": "vi",
      //     "number": "1111"
      //   }
      // }

      // Example of failed tokenization. The error format is always the same, only the value of type, help, description changes.
      // {
      //    "error": {
      //       "type": "Card already added: 2508629432271853872",
      //       "help": "If you want to update the card, first delete it",
      //       "description": "{}"
      //    }
      // }
      document.getElementById('response').innerHTML = JSON.stringify(response);
      retryButton.style.display = 'block';
      submitButton.style.display = 'none';
    };

    // 2. Instance the [PaymentGateway](#PaymentGateway-class) with the required parameters.
    let pg_sdk = new PaymentGateway(environment, application_code, application_key);

    // 3. Generate the tokenization form with the required data. [generate_tokenize](#generate_tokenize-function)
    // At this point it's when the form is rendered on page.
    pg_sdk.generate_tokenize(get_tokenize_data(), '#tokenize_example', responseCallback, notCompletedFormCallback);

    // 4. Define the event to execute the [tokenize](#tokenize-function) action.
    submitButton.addEventListener('click', event => {
      document.getElementById('response').innerHTML = '';
      submitButton.innerText = 'Card Processing...';
      submitButton.setAttribute('disabled', 'disabled');
      pg_sdk.tokenize();
      event.preventDefault();
    });
    // };

    // You can define a button to create a new form and save new card
    retryButton.addEventListener('click', event => {
      // re call function
      submitButton.innerText = submitInitialText;
      submitButton.removeAttribute('disabled');
      retryButton.style.display = 'none';
      submitButton.style.display = 'block';
      pg_sdk.generate_tokenize(get_tokenize_data(), '#tokenize_example', responseCallback, notCompletedFormCallback);
    });

  })();
  }

  const tPaymentez = (
    <div id="payment_example_div">
      <div id="tokenize_example"></div>
      <div id="response"></div>
      <button id="tokenize_btn" class="tok_btn">
        Save card
      </button>
      <button id="retry_btn" class="tok_btn" display="none">
        Save new card
      </button>
    </div>
  );
};

export default tPaymentez;
 */