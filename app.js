const percentageSelect = document.getElementById("percentage");
const presentInput = document.getElementById("present-input");
const totalInput = document.getElementById("total-input");
const btn = document.getElementById("btn");
const outputDiv = document.getElementById("output-div");
const banner = document.getElementById("banner");

btn.addEventListener("click", () => {
  let present = parseInt(presentInput.value);
  let total = parseInt(totalInput.value);
  let percentage = parseInt(percentageSelect.value);
  
  if (isNaN(present) || isNaN(total) || isNaN(percentage)) {
    return (outputDiv.innerText = "Proper values please ¯\\_(ツ)_/¯");
  }

  if (present < 0 || total <= 0 || present > total) {
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
  return Math.ceil((percentage * total - 100 * present) / (100 - percentage));
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