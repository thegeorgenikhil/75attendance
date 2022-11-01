const percentageSelect = document.getElementById("percentage");
const presentInput = document.getElementById("present-input");
const totalInput = document.getElementById("total-input");
const btn = document.getElementById("btn");
const outputDiv = document.getElementById("output-div");
const footer = document.getElementById("footer");

btn.addEventListener("click", () => {
  let present = Number(presentInput.value);
  let total = Number(totalInput.value);
  let percentage = Number(percentageSelect.value);

  if (present <= 0 || total <= 0 || present > total) {
    return (outputDiv.innerText = "Proper values please ¯\\_(ツ)_/¯");
  }

  if (present / total >= percentage / 100) {
    const daysAvailableToBunk = daysToBunk(present, total, percentage);
    return (outputDiv.innerHTML = daysToBunkText(
      daysAvailableToBunk,
      present,
      total
    ));
  }

  const attendanceNeeded = reqAttendance(present, total, percentage);
  return (outputDiv.innerHTML = daysToAttendClassText(
    attendanceNeeded,
    present,
    total,
    percentage
  ));
});

const reqAttendance = (present, total, percentage) => {
  return Math.floor((percentage * total - 100 * present) / (100 - percentage));
};

const daysToBunk = (present, total, percentage) => {
  return Math.floor((100 * present - percentage * total) / percentage);
};

const daysToBunkText = (daysAvailableToBunk, present, total) =>
  `You can bunk for <strong>${daysAvailableToBunk}</strong> more days.<br>Current Attendance: <strong>${present}/${total}</strong> -> <strong>${(
    (present / total) *
    100
  ).toFixed(2)}%</strong><br>Attendance Then: <strong>${present}/${
    daysAvailableToBunk + total
  }</strong> -> <strong>${(
    (present / (daysAvailableToBunk + total)) *
    100
  ).toFixed(2)}%</strong>`;

const daysToAttendClassText = (attendanceNeeded, present, total, percentage) =>
  `You need to attend <strong>${attendanceNeeded}</strong> more classes to attain ${percentage}% attendance<br>Current Attendance: <strong>${present}/${total}</strong> ->  <strong>${(
    (present / total) *
    100
  ).toFixed(2)}%</strong><br>Attendance Required: <strong>${
    attendanceNeeded + present
  }/${attendanceNeeded + total}</strong> -> <strong>${(
    ((attendanceNeeded + present) / (attendanceNeeded + total)) *
    100
  ).toFixed(2)}%</strong>`;

// Issue: Footer gets pushed up when the keyboard on mobile screen come up due to the absolute positioning of the footer
// Solution (Hacky Fix): Hide the footer when any of the input is focued

presentInput.addEventListener("focus", () => {
  footer.classList.add("hide-footer");
});

presentInput.addEventListener("focusout", () => {
  footer.classList.remove("hide-footer");
});

totalInput.addEventListener("focus", () => {
  footer.classList.add("hide-footer");
});

totalInput.addEventListener("focusout", () => {
  footer.classList.remove("hide-footer");
});
