import { Platform } from 'react-native';
import RNMyTracker from '@mytracker/react-native-mytracker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const myTracker = RNMyTracker;
const params = myTracker.getTrackerParams();

// Функция передачи CustomUserId подключение App.js
export async function MyTrackerCustomerUserId (){
  try {
    const userProfile = await AsyncStorage.getItem('profile');

    if (userProfile !== null) {
      const user = JSON.parse(userProfile);
      params.setCustomUserIds([user.rawData.id]);

    } else {
      console.warn('Предупреждение: профиль пользователя не найден сustomUserId');
      params.setCustomUserIds([]);
    }
  } catch (error) {
    console.error('Error customUserId MyTracker', error);
  }
};

// Функция инициализации MyTracker подключение index.js
export function initMyTracker() {
  try {
    if (!__DEV__) {
      const trackerNumber = Platform.OS === 'ios' ? '89252624068351714286' : '00241173838934734865';
      myTracker.initTracker(trackerNumber);
    }
  } catch (error) {
    console.error('Error initMyTracker MyTracker', error);
  }
}


// Функция отслеживания просмотр объявления подключение \src\screens\Catalog\index.js

export function trackCarEvent(item, start, end) {
  try {
    if (!myTracker) {
      console.error('MyTracker not initialized');
      return;
    }

    if (!item) {
      console.error('Invalid item provided');
      return;
    }

    const dayStart = start.getUTCDate().toString().padStart(2, '0');
    const monthStart = (start.getUTCMonth() + 1).toString().padStart(2, '0');
    const yearStart = start.getUTCFullYear();
    const dateStart = `${dayStart}.${monthStart}.${yearStart}`;

    const dayEnd = end.getUTCDate().toString().padStart(2, '0');
    const monthEnd = (end.getUTCMonth() + 1).toString().padStart(2, '0');
    const yearEnd = end.getUTCFullYear();
    const dateEnd = `${dayEnd}.${monthEnd}.${yearEnd}`;

    const eventParams = {
          id: item.uuid,
          dateStart: dateStart,
          dateEnd: dateEnd,
          brand: item.brand,
          model: item.model,
          city: item.homeLocation.city,
          year: item.productionYear.toString(),
          price: item.rentPricePerDay.toString()
    };

    myTracker.trackEvent('countCarView', eventParams);

  } catch (error) {
    console.error('Error MyTracker trackCarEvent', error.message);
  }
}

// Функция отслеживания mt_login и cmt_login в components\Auth\Auth.js
export function trackLoginEvent(user) {
  try {
    if (!myTracker) {
      console.error('MyTracker not initialized');
      return;
    }

    if (!user) {
      console.error('Invalid user provided');
      return;
    }

    myTracker.trackLoginEvent(user.id);

    if (user.role) {
      const eventParams = {
            role: user.role
      }

      myTracker.trackEvent('cmt_login_role', eventParams);

    }
  } catch (error) {
    console.error('Error MyTracker trackLoginEvent', error.message);
  }
}

// Функция отслеживания mt_registration и cmt_registration в components\Auth\Auth.js
export function trackRegistrationEvent(user) {
  try {
    if (!myTracker) {
      console.error('MyTracker not initialized');
      return;
    }

    if (!user) {
      console.error('Invalid user provided');
      return;
    }

    myTracker.trackRegistrationEvent(user.id);

    if (user.role) {
      const eventParams = {
            role: user.role
      }

      myTracker.trackEvent('cmt_registration_role', eventParams);

    }
  } catch (error) {
    console.error('Error MyTracker trackRegistrationEvent', error.message);
  }
}

// Функция отслеживания продолжить в карточке машины src\screens\Car\Car.js
export function trackCarViewContinue() {
  try {
    if (!myTracker) {
      console.error('MyTracker not initialized');
      return;
    }

    myTracker.trackEvent('сarViewContinue');

  } catch (error) {
    console.error('Error MyTracker trackCarViewContinue', error.message);
  }
}

// Функция отслеживания "Платежная карта" в ЛК src\screens\Profile\Profile.js
export function trackPaymentCard(mail) {
  try {
    if (!myTracker) {
      console.error('MyTracker not initialized');
      return;
    }
    // можно добавить для отслеживания по email
    if (mail) {
      const eventParams = {
            email: mail
            }
          myTracker.trackEvent('paymentCard');

      }
  } catch (error) {
    console.error('Error MyTracker trackPaymentCard', error.message);
  }
}

// Функция отслеживания "Факт привязки банковской карты" в \src\screens\Payment.js
export function trackPaymentCardAttached() {
  try {
    if (!myTracker) {
      console.error('MyTracker not initialized');
      return;
    }

    myTracker.trackEvent('paymentCardAttached');

  } catch (error) {
    console.error('Error MyTracker trackPaymentCardAttached', error.message);
  }
}

// Функция отслеживания "Факт отвязки банковской карты" в \src\components\PaymentCard\PaymentCard.js
export function trackPaymentCardDetached() {
  try {
    if (!myTracker) {
      console.error('MyTracker not initialized');
      return;
    }

    myTracker.trackEvent('paymentCardDetached');

  } catch (error) {
    console.error('Error MyTracker trackPaymentCardDetached', error.message);
  }
}

// Функция отслеживания "Продолжить регистрацию" в ЛК src\screens\Profile\Profile.js
export function trackRegistrationContinue() {
  try {
    if (!myTracker) {
      console.error('MyTracker not initialized');
      return;
    }

    myTracker.trackEvent('registrationContinue');

  } catch (error) {
    console.error('Error MyTracker trackRegistrationContinue', error.message);
  }
}

// Функция отслеживания "Продолжить регистрацию" в ЛК src\screens\Profile\Profile.js
export function trackScoringSubmission() {
  try {
    if (!myTracker) {
      console.error('MyTracker not initialized');
      return;
    }

    myTracker.trackEvent('scoringSubmission');

  } catch (error) {
    console.error('Error MyTracker trackScoringSubmission', error.message);
  }
}

// Функция отслеживания аренды машины подтвержденного GUEST src\screens\AdditionalServices.js
export function trackCarServices() {
  try {
    if (!myTracker) {
      console.error('MyTracker not initialized');
      return;
    }

    myTracker.trackEvent('carServices');

  } catch (error) {
    console.error('Error MyTracker trackCarServices', error.message);
  }
}

// Функция отслеживания аренды машины подтвержденного GUEST src\screens\AdditionalServices.js
export function trackCarSericesConfirm() {
  try {
    if (!myTracker) {
      console.error('MyTracker not initialized');
      return;
    }

    myTracker.trackEvent('carServicesConfirm');

  } catch (error) {
    console.error('Error MyTracker trackCarSericesConfirm', error.message);
  }
}

// Функция отслеживания аренды машины подтвержденного GUEST src\screens\Bill\CheckoutBill.js
export function trackCarSericesConfirmRent() {
  try {
    if (!myTracker) {
      console.error('MyTracker not initialized');
      return;
    }

    myTracker.trackEvent('carRentConfirm');

  } catch (error) {
    console.error('Error MyTracker trackCarSericesConfirmPay', error.message);
  }
}

// Функция отмены аренды автомобиля GUEST src\screens\ReasonCancellation\ReasonCancellation.js
export function trackCarRentCancel() {
  try {
    if (!myTracker) {
      console.error('MyTracker not initialized');
      return;
    }

    myTracker.trackEvent('carRentCancel');

  } catch (error) {
    console.error('Error MyTracker trackCarRentCancel', error.message);
  }
}

// Функция оплата аренды GUEST \src\screens\RentRoom.js в startRent
export function trackCarRentPay() {
  try {
    if (!myTracker) {
      console.error('MyTracker not initialized');
      return;
    }

    myTracker.trackEvent('carRentPay');

  } catch (error) {
    console.error('Error MyTracker trackCarRentPay', error.message);
  }
}

// Функция отслеживания просмотр объявления подключение \src\screens\Catalog\index.js
export function trackCarCatalogEvent(item) {
  try {
    if (!myTracker) {
      console.error('MyTracker not initialized');
      return;
    }
      const eventParams = {
            id: item.item.uuid,
            brand: item.item.brand,
            model: item.item.model,
            city: item.item.homeLocation.city,
            year: item.item.productionYear.toString(),
            price: item.item.rentPricePerDay.toString()
      };

    myTracker.trackEvent('carView', eventParams);

  } catch (error) {
    console.error('Error MyTracker trackCarRentPay', error.message);
  }
}