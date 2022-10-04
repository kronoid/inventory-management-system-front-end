let api_charcoal = sessionStorage.getItem("api_charcoal");

$(document).ready(function () {
  let token = sessionStorage.getItem("x-auth-token");
  if (!token) {
    window.location = "./sign-in.html";
  }
  $(".sign-out").on("click", (e) => {
    sessionStorage.clear();
  });
  $("#dtpicker").datetimepicker({
    format: "DD-MM-YYYY LT",
  });

  $(".timepicker").timepicker({
    showInputs: false,
  });
});
$(function () {
  $("#example1").DataTable();

  $("#example2").DataTable({
    paging: true,

    lengthChange: false,

    searching: false,

    ordering: true,

    info: true,

    autoWidth: false,
  });
});
