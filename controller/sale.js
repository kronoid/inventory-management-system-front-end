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
    format: "YYYY-MM-DD HH:mm",
  });
  
  let role = sessionStorage.getItem('role');
  let username = sessionStorage.getItem('user');
  $('#username').append(`<b>${username}</b>`);
  $('#role').append(`<b>${role}</b>`);
  if(role !== 'Admin') $('.admin').hide();
});

$.get(`${api_charcoal}/sale/`, (result) => {
  let sales = result.sales
  let items = result.items;
  let tbody = "";
  let option = "";

  sales.forEach((sale) => {
    tbody += `<tr>
                                <td>
                                   <div class="btn-group">
                                      <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>
                                      <ul class="dropdown-menu">
                                         <li>
                                            <button class="btn-delete btn-danger" data-id-sale="${sale.id}" data-toggle="modal" data-target="#delete">Delete</button>
                                         </li>
                                      </ul>
                                   </div>
                                </td>
                                <td>${sale.name_item}</td>
                                <td>${sale.date}</td>
                                <td>${sale.username}</td>
                                <td>${sale.weight}</td>
                             </tr>
                             `;
  });

  items.forEach((item) => {
    option += `<option value='${item.id}'>${item.name}</option>`;
  });

  $("#example2 > tbody tr:first-child").remove();
  $("#example2 > tbody").append(tbody);

  $("#item").append(option);
  $("#item_edit").append(option);

  $("#btn-save").on("click", async (e) => {
    try {
      let data = {
        id_item: $("#item").val(),
        date: $("#date").val(),
        weight: $("#weight").val(),
      };
      if(data.id_item && data.date != '' && data.weight != ''){
        e.preventDefault();
        await $.post(`${api_charcoal}/sale/add`, data).done((e) => {
          window.location.reload();
        });
      }
    } catch (error) {
      alert(error.responseJSON.errors[0].msg);
    }
  });

  $(".btn-delete").on("click", (e) => {
    const id_sale = $(e.target).attr("data-id-sale");
    $("#delete-sale")
      .off("click")
      .on(`click`, async (e) => {
        try {
          e.preventDefault();
          await $.post(`${api_charcoal}/sale/delete`, {
            id: id_sale,
          }).done((e) => {
            window.location.reload();
          });
        } catch (error) {
          console.log(error);
        }
      });
  });

  $('#btn-excel').attr('href',`${api_charcoal}/download/sale`);

  // $('.btn-edit').on(`click`, (e) => {
  //    const id_user = $(e.target).attr('data-id-user');
  //    let user = users.find(user => user.id == id_user );
  //    $('#username_edit').val(user.username);
  //    $('#level_edit').val(user.id_level);

  //    $('#edit-user').on('click', async (e) => {
  //       e.preventDefault();
  //       try{
  //          let data = {
  //             id: id_user,
  //             username: $('#username_edit').val(),
  //             password:$('#password_edit').val(),
  //             id_level: $('#level_edit').val(),
  //          }
  //          await $.post('${api_charcoal}/users/edit',data, (result) => {
  //             window.location.reload();
  //          });
  //       }catch(error){
  //          alert(error.responseJSON.errors[0].msg)
  //       }
  //    })
  // })
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
