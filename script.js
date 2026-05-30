$(window).on('load', function(){

  showCartList();
  showItemList();
  showHistory();

});

//data//

var cart = [];

var dataitem = [

  {
    name:'Paket Sambal Ijo + Es',
    img:'assets/Paket Sambal Ijo+es.jpeg',
    price:13000
  },

  {
    name:'Ayam',
    img:'assets/Ayam.jpeg',
    price:9000
  },

  {
    name:'Paket Sambal Merah + Es',
    img:'assets/Paket Sambal Merah+es.jpeg',
    price:13000
  },

  {
    name:'Paket Sambal Mix + Es',
    img:'assets/mix.jpeg',
    price:13000
  },

  {
    name:'Paket Saos + Es',
    img:'assets/Paket saos + es.jpg',
    price:13000
  },

  {
    name:'Es Teh',
    img:'assets/es.jpg',
    price:3000
  },

  {
    name:'Nasi',
    img:'assets/nasi.jpg',
    price:3000
  },

  {
    name:'Sambal Ijo',
    img:'assets/samball ijo.jpg',
    price:3000
  },

  {
    name:'Sambal Merah',
    img:'assets/samball merah.jpg',
    price:3000
  }

];

var item = dataitem;

var sortcount = 0;

//cart//

function addToCart(name,count,price){

  var existingItem =
  cart.find(x => x.name === name);

  if(!existingItem){

    cart.push({
      name:name,
      count:count,
      price:price
    });

  }else{

    existingItem.count++;

  }

  showCartList();

}

function plusFromCart(index){

  cart[index].count++;

  showCartList();

}

function minusFromCart(index){

  if(cart[index].count == 1){

    removeFromCart(index);

  }else{

    cart[index].count--;

  }

  showCartList();

}

function removeFromCart(index){

  if(confirm("Hapus item?")){

    cart.splice(index,1);

  }

  showCartList();

}

function clearall(){

  if(confirm("Hapus semua cart?")){

    cart = [];

  }

  showCartList();

}

//total//

function Famount(){

  let amount = 0;

  cart.forEach(function(item){

    amount += item.price * item.count;

  });

  return amount;

}

function Ftotal(){

  return Famount();

}

function Fcash(){

  return Number($("#int-cash").val());

}

function Fchange(){

  return Fcash() - Ftotal();

}

//tampil cart//

function showCartList(){

  $(".cartlist").empty();

  cart.forEach(function(cart,index){

    let total =
    cart.price * cart.count;

    $(".cartlist").append(`

    <div class="card-cart">

      <div class="card-cart-row">

        <div class="bold">
          ${cart.name}
        </div>

        <div class="bold">
          Rp ${total.toLocaleString()}
        </div>

      </div>

      <div class="card-cart-row">

        <div>
          Rp ${cart.price.toLocaleString()}
        </div>

        <div>

          <button class="cart-btn"
          onclick="minusFromCart(${index})">
            -
          </button>

          ${cart.count}

          <button class="cart-btn"
          onclick="plusFromCart(${index})">
            +
          </button>

        </div>

      </div>

    </div>

    `);

  });

  $("#amount-text").text(
    "Rp " + Famount().toLocaleString()
  );

  $("#total-text").text(
    "Rp " + Ftotal().toLocaleString()
  );

  $("#change-text").text(
    "Rp " + Fchange().toLocaleString()
  );

  printContentCart();

}

//tampil item//

function showItemList(){

  $(".itemlist").empty();

  item.forEach(function(item){

    $(".itemlist").append(`

    <div class="card-item"
    onclick="addToCart('${item.name}',1,${item.price})">

      <div class="card-item-img">

        <img src="${item.img}">

      </div>

      <div class="card-item-content">

        <h3>${item.name}</h3>

        <p>
          Rp ${item.price.toLocaleString()}
        </p>

      </div>

    </div>

    `);

  });

}

//cari//

$("#search").on('input', function(){

  var key =
  $(this).val().toLowerCase();

  item = dataitem.filter(function(obj){

    return obj.name
    .toLowerCase()
    .includes(key);

  });

  showItemList();

});

//cash//

$("#int-cash").on('input', function(){

  showCartList();

});

//search//

function bar(){

  $("#search").toggle();

}

//sort//

function sort(){

  if(sortcount == 0){

    item.sort((a,b)=>
      a.name.localeCompare(b.name)
    );

    sortcount++;

  }else{

    item.reverse();

    sortcount--;

  }

  showItemList();

}

//print//

function printContentCart(){

  $(".item").empty();

  cart.forEach(function(item){

    let total =
    item.price * item.count;

    $(".item").append(`

    <div class="row">

      <span>
        ${item.name} x${item.count}
      </span>

      <span>
        ${total.toLocaleString()}
      </span>

    </div>

    `);

  });

  $("#price-amount").text(
    Famount().toLocaleString()
  );

  $("#price-total").text(
    Ftotal().toLocaleString()
  );

  $("#price-cash").text(
    Fcash().toLocaleString()
  );

  $("#price-change").text(
    Fchange().toLocaleString()
  );

  $("#inf-datetime").text(
    new Date().toLocaleString()
  );

}

//payment//

function saveTransaction(){

  if(cart.length == 0){

    alert("Cart kosong");

    return false;

  }

  let history =
  JSON.parse(localStorage.getItem("history"))
  || [];

  history.push({

    date:new Date().toISOString(),
    total:Ftotal(),
    cash:Fcash(),
    change:Fchange()

  });

  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );

  return true;

}

function saveAndPrint(){

  let success = saveTransaction();

  if(success){

    window.print();

    clearall();

    showHistory();

  }

}

function saveWithoutPrint(){

  let success = saveTransaction();

  if(success){

    alert("Pembayaran berhasil");

    clearall();

    showHistory();

  }

}

//histori//

function showHistory(data = null){

  let history =
  data ||
  JSON.parse(localStorage.getItem("history"))
  || [];

  $("#history-list").empty();

  if(history.length == 0){

    $("#history-list").html(
      "<p>Tidak ada histori</p>"
    );

    return;

  }

  history.reverse().forEach(function(item){

    let date = new Date(item.date);

    $("#history-list").append(`

    <div class="history-item">

      <b>
        ${date.toLocaleDateString()}
      </b>

      <p>
        Total :
        Rp ${item.total.toLocaleString()}
      </p>

      <p>
        Cash :
        Rp ${item.cash.toLocaleString()}
      </p>

      <p>
        Kembalian :
        Rp ${item.change.toLocaleString()}
      </p>

    </div>

    `);

  });

}

//filter histori//

function filterHistory(){

  let history =
  JSON.parse(localStorage.getItem("history"))
  || [];

  let dateFilter =
  $("#history-date").val();

  if(dateFilter == ""){

    showHistory();

    return;

  }

  let filtered =
  history.filter(function(item){

    let d = new Date(item.date);

    let itemDate =
    d.toISOString().split("T")[0];

    return itemDate == dateFilter;

  });

  showHistory(filtered);

}

//toggle cart//

function cartbtn(){

  $(".content-cart").toggle();

}
