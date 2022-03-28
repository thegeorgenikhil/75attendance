const presentInput = document.getElementById("present-input");
const totalInput = document.getElementById("total-input");
const btn = document.getElementById("btn");
const outputDiv = document.getElementById("output-div");

btn.addEventListener("click", () => {
  let present = Number(presentInput.value);
  let total = Number(totalInput.value);
  if (present <= 0 && total <= 0) {
    return (outputDiv.innerText = "Proper values please ¯\\_(ツ)_/¯");
  }
  if (present / total >= 0.75) {
    return (outputDiv.innerText = "You have more that 75% attendance ~(˘▾˘~)");
  }
  const attendanceNeeded = reqAttendance(present, total);
  return (outputDiv.innerHTML = `You need to attend <strong>${attendanceNeeded}</strong> days more to have 75% attendance<br>Total Attendance Required(P/T): <strong>${
    attendanceNeeded + present
  }/${attendanceNeeded + total}</strong>`);
});

const reqAttendance = (present, total) => {
  const initialPresent = present;
  let percent = present / total;
  while (percent <= 0.75) {
    present++;
    total++;
    percent = present / total;
  }
  return present - initialPresent - 1;
};
