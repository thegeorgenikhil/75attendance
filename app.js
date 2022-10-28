const percentageSelect = document.getElementById("percentage");
const presentInput = document.getElementById("present-input");
const totalInput = document.getElementById("total-input");
const btn = document.getElementById("btn");
const outputDiv = document.getElementById("output-div");

btn.addEventListener("click", () => {
  let present = Number(presentInput.value);
  let total = Number(totalInput.value);
  let percentage = Number(percentageSelect.value);

  if (present <= 0 || total <= 0 || present > total) {
    return (outputDiv.innerText = "Proper values please ¯\\_(ツ)_/¯");
  }

  if (present / total >= percentage / 100) {
    const daysAvailableToBunk = daysToBunk(present, total, percentage);
    return (outputDiv.innerHTML = `You can bunk for <strong>${daysAvailableToBunk}</strong> more days :)<br>Total Attendance will be then(P/T):<strong>${present}/${
      total + daysAvailableToBunk
    }</strong>`);
  }

  const attendanceNeeded = reqAttendance(present, total, percentage);
  return (outputDiv.innerHTML = `You need to attend <strong>${attendanceNeeded}</strong> more days to have ${percentage}% attendance<br>Total Attendance Required(P/T): <strong>${
    attendanceNeeded + present
  }/${attendanceNeeded + total}</strong>`);
});

const reqAttendance = (present, total, percentage) => {
  return Math.floor((percentage * total - 100 * present) / (100 - percentage));
};

const daysToBunk = (present, total, percentage) => {
  return Math.floor((100 * present - percentage * total) / percentage);
};
