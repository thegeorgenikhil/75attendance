const presentInput = document.getElementById("present-input");
const totalInput = document.getElementById("total-input");
const btn = document.getElementById("btn");
const outputDiv = document.getElementById("output-div");

btn.addEventListener("click", () => {
  let present = Number(presentInput.value);
  let total = Number(totalInput.value);
  if (present <= 0 || total <= 0 || present > total) {
    return (outputDiv.innerText = "Proper values please ¯\\_(ツ)_/¯");
  }
  if (present / total >= 0.75) {
    const daysAvailableToBunk = daysToBunk(present, total);
    return (outputDiv.innerHTML = `You can bunk for <strong>${daysAvailableToBunk}</strong> more days :)<br>Total Attendance will be then(P/T):<strong>${present}/${
      total + daysAvailableToBunk
    }</strong>`);
  }
  const attendanceNeeded = reqAttendance(present, total);
  return (outputDiv.innerHTML = `You need to attend <strong>${attendanceNeeded}</strong> more days to have 75% attendance<br>Total Attendance Required(P/T): <strong>${
    attendanceNeeded + present
  }/${attendanceNeeded + total}</strong>`);
});

const reqAttendance = (present, total) => {
  return 3 * total - 4 * present;
};

const daysToBunk = (present, total) => {
  return Math.floor((4 * present - 3 * total) / 3);
};
