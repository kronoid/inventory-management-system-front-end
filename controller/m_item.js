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
  if (!token) {
    window.location = "./sign-in.html";
  }
  $(".sign-out").on("click", (e) => {
    sessionStorage.clear();
  });
  $("#dtpicker").datetimepicker({
    format: "DD-MM-YYYY LT",
  });

  let role = sessionStorage.getItem('role');
  let username = sessionStorage.getItem('user');
  $('#username').append(`<b>${username}</b>`);
  $('#role').append(`<b>${role}</b>`);
  if(role !== 'Admin') window.location = "./dashboard.html";

  $(".timepicker").timepicker({
    showInputs: false,
  });  
});

$.get(`${api_charcoal}/items/`, (result) => {
  let items = result.items;
  let categorys = result.categorys;
  let raws = result.raws;
  let option = "";
  let option_raws = "";
  let tbody = "";

  items.forEach((item) => {
    tbody += `<tr>
                                 <td>
                                    <div class="btn-group">
                                       <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>
                                       <ul class="dropdown-menu">
                                          <li>
                                             <button class="btn-edit btn-default" data-id-item="${item.id}" data-toggle="modal" data-target="#edit">Edit</button>
                                             <button class="btn-delete btn-danger" data-id-item="${item.id}" data-toggle="modal" data-target="#delete">Delete</button>
                                          </li>
                                       </ul>
                                    </div>
                                 </td>
                                 <td>${item.name}</td>
                                 <td>${item.description}</td>
                              </tr>
                              `;
  });

  categorys.forEach((category) => {
    option += `<option value='${category.id}'>${category.name}</option> `;
  });

  raws.forEach((raw) => {
    option_raws += `<option value='${raw.id}'>${raw.name}</option> `;
  });

  $("#example2 > tbody tr:first-child").remove();
  $("#example2 > tbody").append(tbody);
  $("#category").append(option);
  $("#category_edit").append(option);
  $("#raw").append(option_raws);
  $("#raw_edit").append(option_raws);

  $("#btn-save").on("click", async (e) => {
    try {
      let data = {
        name: $("#name").val(),
        id_category: $("#category").val(),
        id_raw: $("#raw").val(),
      };

      if(data.name != '' && data.id_category){
        if(data.id_category == 2 && !data.id_raw) return
        e.preventDefault();
        await $.post(`${api_charcoal}/items/add`, data).done((e) => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.log(error);
    }
  });

  $(".btn-delete").on("click", (e) => {
    const id_item = $(e.target).attr("data-id-item");
    $("#delete-item")
      .off("click")
      .on(`click`, async (e) => {
        try {
          e.preventDefault();
          await $.post(`${api_charcoal}/items/delete`, { id: id_item }).done((e) => {
            window.location.reload();
          });
        } catch (error) {
          console.log(error);
        }
      });
  });

  $(".btn-edit").on(`click`, (e) => {
    const id_item = $(e.target).attr("data-id-item");
    let item = items.find((item) => item.id == id_item);
    $("#name_edit").val(item.name);
    $("#category_edit").val(item.id_category);

    if (item.id_category == 2) {
      $(".raw_edit").show();
      $("#raw_edit").val(item.id_raw);
    } else {
      $(".raw_edit").hide();
    }

    $("#edit-item").on("click", async (e) => {
      try {
        e.preventDefault();
        let data = {
          id: id_item,
          name: $("#name_edit").val(),
          id_category: $("#category_edit").val(),
          id_raw: $("#raw_edit").val(),
        };
        await $.post(`${api_charcoal}/items/edit`, data).done((e) => {
          window.location.reload();
        });
      } catch (error) {
        console.log(error);
      }
    });
  });

  $("#category, #category_edit").change((e) => {
    let id_category = e.target.value;
    if (id_category == 2) {
      $(".raw, .raw_edit").show();
    } else {
      $(".raw, .raw_edit").hide();
    }
  });
});
// $(function () {

//    $('#example1').DataTable()

//    $('#example2').DataTable({

//       'paging'      : true,

//       'lengthChange': false,

//       'searching'   : false,

//       'ordering'    : true,

//       'info'        : true,

//       'autoWidth'   : false

//    })

// })
