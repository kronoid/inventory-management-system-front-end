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
  $(".sidebar-menu").tree();
  
  let role = sessionStorage.getItem('role');
  let username = sessionStorage.getItem('user');
  $('#username').append(`<b>${username}</b>`);
  $('#role').append(`<b>${role}</b>`);
  if(role !== 'Admin') $('.admin').hide();
});

$.get(`${api_charcoal}/dashboard/`, (result) => {
  let raw_materials = result.raw_materials;
  let production_goods = result.production_goods;
  let production_goods_sold = result.production_goods_sold;
  let total_production = result.total_production_goods;
  let total_production_goods_sold = result.total_production_goods_sold;
  let raw_box = "";
  let production_box = "";
  let production_sold_box ="";

  raw_materials.forEach((raw, i) => {
    raw_box += `<span class="info-box-number">${raw.weight} ${raw.name}</span>`;
    if (i + 1 === raw_materials.length) {
      raw_box += `<span class="progress-description">${raw.notif}</span>`;
    }
  });

  production_goods.forEach((production, i) => {
    production_box += `<span class="info-box-number">${production.weight} ${production.name}</span>`;
    if (i + 1 === production_goods.length) {
      production_box += `<span class="progress-description"> ${total_production} Total Production </span>`;
    }
  });

  production_goods_sold.forEach((production, i) => {
    production_sold_box += `<span class="info-box-number">${production.weight} ${production.name}</span>`;
    if (i + 1 === production_goods.length) {
      production_sold_box += `<span class="progress-description"> ${total_production_goods_sold} Total Production </span>`;
    }
  });  

  $("#raw_material").append(raw_box);
  $("#production_goods").append(production_box);
  $("#production_goods_sold").append(production_sold_box);
});
