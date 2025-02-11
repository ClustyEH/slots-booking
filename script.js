document.addEventListener("DOMContentLoaded", () => {
  const bookedSlotsTableBody = document.querySelector("#booked-slots-table tbody");
  const timeSlotContainer = document.querySelector(".time-slot-container");
  const modal = document.getElementById("confirmation-modal");
  const selectedSlotDisplay = document.getElementById("selected-slot");
  const confirmBtn = document.getElementById("confirm-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const datePicker = document.getElementById("booking-date");
  const teacherNameInput = document.getElementById("teacher-name");

  const timeSlots = [
    "7:00 AM", "8:00 AM",
    "9:00 AM", "10:00 AM",
    "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM",
    "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM",
    "8:00 PM", "9:00 PM"
  ];

  let bookings = JSON.parse(localStorage.getItem("bookings")) || {};
  let selectedSlot = null;
  let selectedDate = null;

  // Render slots for the selected date
  function renderTimeSlots(date) {
    timeSlotContainer.innerHTML = "";
    const bookedSlots = bookings[date] || [];
    timeSlots.forEach((slot) => {
      const slotDiv = document.createElement("div");
      slotDiv.classList.add("time-slot");
      slotDiv.textContent = slot;

      if (bookedSlots.find(booking => booking.slot === slot)) {
        slotDiv.classList.add("booked");
        slotDiv.textContent += " (Booked)";
      } else {
        slotDiv.addEventListener("click", () => selectSlot(slot, slotDiv));
      }

      timeSlotContainer.appendChild(slotDiv);
    });

    updateBookedSlotsTable(date);
  }

  function selectSlot(slot) {
    if (!selectedDate) {
      alert("Please select a date first.");
      return;
    }
    selectedSlot = slot;
    showModal(slot);
  }

  function showModal(slot) {
    selectedSlotDisplay.textContent = `You selected: ${slot} on ${selectedDate}`;
    modal.classList.remove("hidden");
  }

  confirmBtn.addEventListener("click", () => {
    const teacherName = teacherNameInput.value.trim();
    if (!teacherName) {
      alert("Please enter your name to confirm the booking.");
      return;
    }
    if (selectedSlot) {
      if (!bookings[selectedDate]) bookings[selectedDate] = [];
      bookings[selectedDate].push({ slot: selectedSlot, name: teacherName });
      localStorage.setItem("bookings", JSON.stringify(bookings));
      alert(`Booking confirmed for ${selectedSlot} on ${selectedDate} by ${teacherName}!`);
      modal.classList.add("hidden");
      teacherNameInput.value = "";
      renderTimeSlots(selectedDate);
    }
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  datePicker.addEventListener("change", (e) => {
    selectedDate = e.target.value;
    if (!selectedDate) {
      alert("Please select a valid date.");
      return;
    }
    renderTimeSlots(selectedDate);
  });

  // Update the booked slots table
  function updateBookedSlotsTable(date) {
    bookedSlotsTableBody.innerHTML = "";
    const bookedSlots = bookings[date] || [];
    bookedSlots.forEach(booking => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${date}</td>
        <td>${booking.slot}</td>
        <td>${booking.name}</td>
        <td>Confirmed</td>
      `;
      bookedSlotsTableBody.appendChild(row);
    });
  }

  // Initial load with date
  renderTimeSlots(selectedDate);
});
