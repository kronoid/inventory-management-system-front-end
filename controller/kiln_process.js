let api_charcoal = sessionStorage.getItem("api_charcoal");

let token = sessionStorage.getItem("x-auth-token");
$.ajaxSetup({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/x-www-form-urlencoded",
    "x-auth-token": token,
  },
});

$(document).ready(function () {
  let token = sessionStorage.getItem("x-auth-token");
  if (!token) {
    window.location = "./sign-in.html";
  }
  $(".sign-out").on("click", (e) => {
    sessionStorage.clear();
  });
  $(".dtpicker").datetimepicker({
    format: "YYYY-MM-DD HH:mm",
  });
  
  let role = sessionStorage.getItem('role');
  let username = sessionStorage.getItem('user');
  $('#username').append(`<b>${username}</b>`);
  $('#role').append(`<b>${role}</b>`);
  if(role !== 'Admin') $('.admin').hide();

  $(".timepicker").timepicker({
    showInputs: false,
  });
});

$.get(`${api_charcoal}/kiln/`, (result) => {
  let kilns = result.kilns;
  let items = result.items;
  let tbody = "";
  let option = "";

  kilns.forEach((kiln) => {
    tbody += `<tr>
                  <td>
                      <div class="btn-group">
                        <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>
                        <ul class="dropdown-menu">
                            <li>
                              <button class="btn-delete btn-danger" data-id-kiln="${kiln.id}" data-toggle="modal" data-target="#delete">Delete</button>
                            </li>
                        </ul>
                      </div>
                  </td>
                  <td>${kiln.item_name}</td>
                  <td>${kiln.weight}</td>
                  <td>${kiln.date_at}</td>
                </tr>
                `;
  });

  items.forEach((item) => {
    option += `
                  <option value="${item.id}">${item.name}</option>
               `;
  });

  $("#example2 > tbody tr:first-child").remove();
  $("#example2 > tbody").append(tbody);
  $("#item").append(option);
  $("#item_edit").append(option);

  $("#btn-save").on("click", async (e) => {
    try {
      let data = {
        id_item: $("#item").val(),
        weight: $("#weight").val(),
        date_at: $("#date_at").val(),
      };

      if(data.id_item && data.weight != '' && data.date_at != '') {
        e.preventDefault();
        await $.post(`${api_charcoal}/kiln/add`, data, (result) => {
          if (result.saveKiln) {
            window.location.reload();
          } else {
            alert(result.message);
          }
        });       
      };
      
    } catch (error) {
      console.log(error);
    }
  });

  $(".btn-delete").on("click", (e) => {
    const id_kiln = $(e.target).attr("data-id-kiln");

    $("#delete-kiln")
      .off("click")
      .on(`click`, async (e) => {
        try {
          e.preventDefault();
          await $.post(`${api_charcoal}/kiln/delete`, { id: id_kiln }).done((e) => {
            window.location.reload();
          });
        } catch (error) {
          console.log(error);
        }
      });
  });

  $(".btn-edit").on(`click`, (e) => {
    const id_kiln = $(e.target).attr("data-id-kiln");
    let kiln = kilns.find((kiln) => kiln.id == id_kiln);
    $("#item_edit").val(kiln.id_item);
    $("#weight_edit").val(kiln.weight);
    $("#date_at_edit").val(kiln.date_at.split("T")[0]);

    $("#edit-kiln").on("click", async (e) => {
      e.preventDefault();
      try {
        let data = {
          id: id_kiln,
          id_item: $("#item_edit").val(),
          weight: $("#weight_edit").val(),
          date_at: $("#date_at_edit").val(),
        };
        await $.post(`${api_charcoal}/kiln/edit`, data).done((e) => {
          window.location.reload();
        });
      } catch (error) {
        alert(error.responseJSON.errors[0].msg);
      }
    });
  });

  $('#item').on('change', (e) => {
    let value = e.target.value;
    let data = items.find((item) => item.id == value);
    $('#raw_info').text(`Stock available ${new Intl.NumberFormat(`en-EN`).format(data.stock_raw)}`)
  });

  $('#btn-excel').attr('href',`${api_charcoal}/download/kiln_process`);
});


//   $(function () {

//     $('#example1').DataTable()

//     $('#example2').DataTable({

//       'paging'      : true,

//       'lengthChange': false,

//       'searching'   : false,

//       'ordering'    : true,

//       'info'        : true,

//       'autoWidth'   : false

//     })

//   })
