import axios from "axios";
import { showAlert } from "./alerts";
const stripe = Stripe(
  "pk_test_51N1MdGBAcrAcWc4CBhE9xoCAOPOgFXb8IJzVSaDGwlfEmel7te2MJPOOBh5MoOVfYox9YNdq4GAXPF3xJzaJQR1j00UvVpa3IH"
);


export const bookTour = async (BookingAmount) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${BookingAmount}`
    );
    console.log(session);
    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert("error", err);
  }
};
