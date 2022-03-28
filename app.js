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
    return (outputDiv.innerText = "You have more than 75% attendance ~(˘▾˘~)");
  }
  const attendanceNeeded = reqAttendance(present, total);
  return (outputDiv.innerHTML = `You need to attend <strong>${attendanceNeeded}</strong> more days to have 75% attendance<br>Total Attendance Required(P/T): <strong>${
    attendanceNeeded + present
  }/${attendanceNeeded + total}</strong>`);
});

const reqAttendance = (present, total) => {
  return 3 * total - 4 * present;
};
