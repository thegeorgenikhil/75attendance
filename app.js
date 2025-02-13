const percentageSelect = document.getElementById("percentage");
const presentInput = document.getElementById("present-input");
const totalInput = document.getElementById("total-input");
const btn = document.getElementById("btn");
const outputDiv = document.getElementById("output-div");
const footer = document.getElementById("footer");
const banner = document.getElementById("banner");

btn.addEventListener("click", () => {
  let present = parseInt(presentInput.value);
  let total = parseInt(totalInput.value);
  let percentage = parseInt(percentageSelect.value);

  if (present < 0 || total <= 0 || present > total) {
    return (outputDiv.innerText = "Proper values please ¯\\_(ツ)_/¯");
  }

  if (present / total >= percentage / 100) {
    const lecturesAvailableToBunk = lecturesToBunk(present, total, percentage);
    return (outputDiv.innerHTML = lecturesToBunkText(
      lecturesAvailableToBunk,
      present,
      total
    ));
  }

  const attendanceNeeded = reqAttendance(present, total, percentage);
  return (outputDiv.innerHTML = lecturesToAttendClassText(
    attendanceNeeded,
    present,
    total,
    percentage
  ));
});

const reqAttendance = (present, total, percentage) => {
  return Math.ceil((percentage * total - 100 * present) / (100 - percentage));
};

// Updated function name and comments
const lecturesToBunk = (present, total, percentage) => {
  return Math.floor((100 * present - percentage * total) / percentage);
};

const lecturesToBunkText = (lecturesAvailableToBunk, present, total) =>
  `You can bunk for <strong>${lecturesAvailableToBunk}</strong> more lectures.<br>Current Attendance: <strong>${present}/${total}</strong> -> <strong>${(
    (present / total) *
    100
  ).toFixed(2)}%</strong><br>Attendance Then: <strong>${present}/${
    lecturesAvailableToBunk + total
  }</strong> -> <strong>${(
    (present / (lecturesAvailableToBunk + total)) *
    100
  ).toFixed(2)}%</strong>`;

const lecturesToAttendClassText = (attendanceNeeded, present, total, percentage) =>
  `You need to attend <strong>${attendanceNeeded}</strong> more lectures to attain ${percentage}% attendance<br>Current Attendance: <strong>${present}/${total}</strong> ->  <strong>${(
    (present / total) *
    100
  ).toFixed(2)}%</strong><br>Attendance Required: <strong>${
    attendanceNeeded + present
  }/${attendanceNeeded + total}</strong> -> <strong>${(
    ((attendanceNeeded + present) / (attendanceNeeded + total)) *
    100
  ).toFixed(2)}%</strong>`;

// Issue: Footer gets pushed up when the keyboard on mobile screen comes up due to the absolute positioning of the footer
// Solution (Hacky Fix): Hide the footer when any of the input is focused

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