import { useLocation } from "react-router-dom";

function BookingSuccess() {
  const { state } = useLocation();

  const bookingId = Math.floor(
    100000 + Math.random() * 900000
  );

  return (
    <div className="success">
      <h1>Seat Booked Successfully</h1>

      <h3>Booking ID: {bookingId}</h3>

      <p>Name: {state?.name}</p>
      <p>Email: {state?.email}</p>
      <p>Mobile: {state?.mobile}</p>
    </div>
  );
}

export default BookingSuccess;