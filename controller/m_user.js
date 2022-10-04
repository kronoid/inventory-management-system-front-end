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

$.get(`${api_charcoal}/users/`, (result) => {
  let users = result.users;
  let tbody = "";
  users.forEach((user) => {
    tbody += `<tr>
                                 <td>
                                    <div class="btn-group">
                                       <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown"><span class="caret"></span></button>
                                       <ul class="dropdown-menu">
                                          <li>
                                             <button class="btn-edit btn-default" data-id-user="${user.id}" data-toggle="modal" data-target="#edit">Edit</button>
                                             <button class="btn-delete btn-danger" data-id-user="${user.id}" data-toggle="modal" data-target="#delete">Delete</button>
                                          </li>
                                       </ul>
                                    </div>
                                 </td>
                                 <td>${user.username}</td>
                                 <td>${user.description}</td>
                              </tr>
                              `;
  });
  $("#example2 > tbody tr:first-child").remove();
  $("#example2 > tbody").append(tbody);

  $.get(`${api_charcoal}/level/`, (result) => {
    let levels = result.levels;
    let option = "";
    levels.forEach((level) => {
      option += `<option value='${level.id}'>${level.name}</option> `;
    });
    $("#level").append(option);
    $("#level_edit").append(option);
  });

  $("#btn-save").on("click", async (e) => {
    try {
      let data = {
        username: $("#username").val(),
        password: $("#password").val(),
        id_level: $("#level").val(),
      };
      
      if(data.username != '' && data.password != '' && data.id_level){
        e.preventDefault();
        await $.post(`${api_charcoal}/users/add`, data).done((e) => {
          window.location.reload();
        });
      }
    } catch (error) {
      alert(error.responseJSON.errors[0].msg);
    }
  });

  $(".btn-delete").on("click", (e) => {
    const id_user = $(e.target).attr("data-id-user");
    $("#delete-user")
      .off("click")
      .on(`click`, async (e) => {
        try {
          e.preventDefault();
          await $.post(`${api_charcoal}/users/delete`, { id: id_user }).done((e) => {
            window.location.reload();
          });
        } catch (error) {
          console.log(error);
        }
      });
  });
  $(".btn-edit").on(`click`, (e) => {
    const id_user = $(e.target).attr("data-id-user");
    let user = users.find((user) => user.id == id_user);
    $("#username_edit").val(user.username);
    $("#level_edit").val(user.id_level);

    $("#edit-user").on("click", async (e) => {
      e.preventDefault();
      try {
        e.preventDefault();
        let data = {
          id: id_user,
          username: $("#username_edit").val(),
          password: $("#password_edit").val(),
          id_level: $("#level_edit").val(),
        };
        await $.post(`${api_charcoal}/users/edit`, data).done((e) => {
          window.location.reload();
        });
      } catch (error) {
        alert(error.responseJSON.errors[0].msg);
      }
    });
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
