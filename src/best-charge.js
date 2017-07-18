function getInfor(id) {
  var menu = loadAllItems();
  var flag = -1;

  for (var i = 0; i < menu.length; i++) {
    if (id === menu[i].id) {
      flag = i;
      break;
    }
  }
  return flag;
}

function getItems(inputs) {
  var item = [];
  var menu = loadAllItems();

  for (var i = 0; i < inputs.length; i++) {
    var data = inputs[i].split(" x");
    var x = getInfor(data[0]);
    if (x != -1) {
      item.push({
        item: menu[x],
        count: data[1],
        subtotal: parseInt(menu[x].price * parseInt(data[1]))
      });
    }
  }
  return item;
}

function getTotal(item) {
  var total = {list: item, total: 0};

  for (var i = 0; i < item.length; i++) {
    total.total += parseFloat(item[i].count * item[i].item.price);
  }

  return total;
}
function halfPrice(list) {
  var activity = loadPromotions();
  var flag = 0;

  for (var i = 0; i < activity[1].items.length; i++) {
    if (activity[1].items[i] == list.id) {
      flag = 1;
      break;
    }
  }
  return flag;
}

function getPromotion(total) {
  var activity = loadPromotions();
  var receipt = {list: total.list, total: total.total, promotion: []};
  var flag = 0, discount = [], type = [];


  if (total.total >= 30) {
    receipt.promotion.push({type: activity[0].type, save: 6});
  }
  else {
    receipt.promotion.push({type: " ", save: 0});
  }

  for (var i = 0; i < total.list.length; i++) {
    if (halfPrice(total.list[i].item) != 0) {
      flag = 1;
      type.push(total.list[i].item.name);
      discount.push(parseFloat(total.list[i].subtotal / 2))
    }
  }
  if (flag == 1) {
    flag = 0;
    for (var i = 0; i < discount.length; i++) {
      flag += discount[i];
    }
    receipt.promotion.push({type: activity[1].type + "(" + type.join().replace(",","，") + ")", save: flag});
  }
  else {
    receipt.promotion.push({type: " ", save: 0});
  }
  return receipt;
}

function compareCharge(receipt) {
  var charge = receipt;

  if (receipt.promotion[0].save >= receipt.promotion[1].save) {
    charge.type = 0;
    charge.actualTotal = receipt.total - receipt.promotion[0].save;
  }
  else {
    charge.type = 1;
    charge.actualTotal = receipt.total - receipt.promotion[1].save;
  }
  return charge;
}
function getReceipt(charge) {
  var text = "============= 订餐明细 =============\n";

  for (var i = 0; i < charge.list.length; i++) {
    text = text + charge.list[i].item.name + " x" + charge.list[i].count + " = " + charge.list[i].subtotal + "元\n";
  }
  if(charge.promotion[charge.type].save== 0){
    text = text + "-----------------------------------\n总计：" + charge.actualTotal + "元\n" + "===================================";

  }
  else{
    text = text + "-----------------------------------\n" + "使用优惠:\n" + charge.promotion[charge.type].type + "，省" +
      charge.promotion[charge.type].save + "元\n" + "-----------------------------------\n" + "总计：" + charge.actualTotal + "元\n" +
      "===================================";
  }

  return text;
}

function bestCharge(inputs) {
  var item = getItems(inputs);
  var total = getTotal(item);
  var receipt = getPromotion(total);
  var charge = compareCharge(receipt);
  var text = getReceipt(charge);
  console.log(text);
  return text;
}
