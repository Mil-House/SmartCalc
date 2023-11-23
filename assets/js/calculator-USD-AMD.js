let items = [];
let hasUnsavedData = items.length > 0;


/*----==== AMD / USD Select ====----*/
let usdRate = '400'; // || null
let selectedCurrency = 'AMD'; // По умолчанию выбрана AMD
function changeCurrency() {
  selectedCurrency = document.getElementById("currency").value;
  displayItems();
  calculateTotalCost();
}



/*----========--------======== CREATE Items ========--------========----*/
function addItem() {
  // После добавления элемента установите флаг hasUnsavedData в true
  hasUnsavedData = true;

  const itemName = document.getElementById("itemName").value;
  const itemPrice = parseFloat(document.getElementById("itemPrice").value);
  const itemQuantity = parseInt(document.getElementById("itemQuantity").value);
  const itemComment = document.getElementById("itemComment").value || ''; // пустая строка, если комментария нет

  if (itemName && !isNaN(itemPrice) && !isNaN(itemQuantity)) {
    const newItem = {
      name: itemName,
      price: itemPrice,
      quantity: itemQuantity,
      comment: itemComment,
    };
  
    items.push(newItem);
    displayItems();
    calculateTotalCost();
    clearInputFields();
  } else {
    alert("Пожалуйста, заполните обязательные поля: \n > Название объекта, \n > Цена за 1 шт. \n > и Количество.");
  }
}

function clearInputFields() {
  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";
  document.getElementById("itemQuantity").value = "";
  document.getElementById("itemComment").value = "";
}



/*----========--------======== DISPLAY Items ========--------========----*/
function displayItems() {
  const itemList = document.getElementById("itemList");
  itemList.innerHTML = "";
  
  items.forEach((item, index) => {
    const li = document.createElement("li");
    const itemTotalCost = calculateItemTotalCost(item);

    if (selectedCurrency === 'AMD') {
    li.innerHTML = `
      <div class="obj_name">
       <span class="item-name">${item.name}</span>
      </div> 

      <div class="amount">
        <div class="amount-item"><span class="obj_options">Количество:</span> 
        <span class="obj_nums">${item.quantity}</span></div>

        <div class="amount-item"><span class="obj_options">Цена за 1 шт.:</span> 
        <span class="obj_nums">${itemTotalCost.selectedPrice}֏</span></div>
      </div>

      <div class="max_price">
        <div class="price-item"><span class="obj_options">Общая стоимость объекта AMD:</span> 
        <span class="obj_nums">${itemTotalCost.dram}֏</span></div>

        <div class="price-item"><span class="obj_options">Общая стоимость объекта USD:</span>
        <span class="obj_nums">${usdRate ? ` ${itemTotalCost.usd}$` : ''}</span></div>
      </div>

      <div class="comment">
        <span class="obj_options">Комментарий:</span> ${item.comment}
      </div>

      <div class="obj_btns">
      <button onclick="editItem(${index})">Редактировать</button>
      <button onclick="deleteItem(${index})">Удалить</button>
      </div>
    `;
    }
    if (selectedCurrency === 'USD') {
    li.innerHTML = `
      <div class="obj_name">
       <span class="item-name">${item.name}</span>
      </div> 

      <div class="amount">
        <div class="amount-item"><span class="obj_options">Количество:</span> 
        <span class="obj_nums">${item.quantity}</span></div>

        <div class="amount-item"><span class="obj_options">Цена за 1 шт.:</span> 
        <span class="obj_nums">${itemTotalCost.selectedPrice}$</span></div>
      </div>

      <div class="max_price">
        <div class="price-item"><span class="obj_options">Общая стоимость объекта USD:</span> 
        <span class="obj_nums">${itemTotalCost.usd}$</span></div>

        <div class="price-item"><span class="obj_options">Общая стоимость объекта AMD:</span>
        <span class="obj_nums">${usdRate ? ` ${itemTotalCost.dram}֏` : ''}</span></div>
      </div>

      <div class="comment">
        <span class="obj_options">Комментарий:</span> ${item.comment}
      </div>

      <div class="obj_btns">
      <button onclick="editItem(${index})">Редактировать</button>
      <button onclick="deleteItem(${index})">Удалить</button>
      </div>
    `;  
    }

    itemList.appendChild(li);
  });
}

// Для расчета общей суммы объекта AMD/USD (также добавляет NaN если не указан курс USD)
function calculateItemTotalCost(item) {
  if (selectedCurrency === 'AMD') {
    const unitPriceDram = item.price;
    const itemCostInDram = unitPriceDram * item.quantity;
    const itemCostInUSD = usdRate ? itemCostInDram / usdRate : NaN;

    return {
      selectedPrice: unitPriceDram,
      dram: itemCostInDram.toFixed(2),
      usd: !isNaN(itemCostInUSD) ? itemCostInUSD.toFixed(2) : 'NaN'
    };
  } else if (selectedCurrency === 'USD') {
    const unitPriceUSD = item.price;
    const itemCostInUSD = unitPriceUSD * item.quantity;
    const itemCostInDram = usdRate ? unitPriceUSD * usdRate * item.quantity : NaN;

    return {
      selectedPrice: unitPriceUSD,
      usd: itemCostInUSD.toFixed(2),
      dram: !isNaN(itemCostInDram) ? itemCostInDram.toFixed(2) : 'NaN'
    };
  }
}

/*----========--------======== EDIT ========--------========----*/
function editItem(index) {
  const editedName = prompt("Введите новое название объекта:", items[index].name);
  const editedPrice = parseFloat(prompt("Введите новую цену за 1 шт.:", items[index].price));
  const editedQuantity = parseInt(prompt("Введите новое количество:", items[index].quantity));
  const editedComment = prompt("Введите комментарий к объекту:", items[index].comment);

  if (editedName && !isNaN(editedPrice) && !isNaN(editedQuantity)) {
    items[index].name = editedName;
    items[index].price = editedPrice;
    items[index].quantity = editedQuantity;
    items[index].comment = editedComment;
    displayItems();
    calculateTotalCost();
  } else {
    alert("Пожалуйста, введите корректные данные.");
  }
}

/*----========--------======== DELETE ========--------========----*/
function deleteItem(index) {
  if (confirm("Вы уверены, что хотите удалить этот объект?")) {
    items.splice(index, 1);
    displayItems();
    calculateTotalCost();

    // После удаления элемента обновляем флаг hasUnsavedData
    hasUnsavedData = items.length > 0;
  }
}


/*----========--------======== Calculate Total Cost ========--------========----*/
function calculateTotalCost() {
  const totalCostElement = document.getElementById("totalCost");
  let totalCostDram = 0;
  let totalCostUSD = 0;

  // dobavili dlya USD
  if (selectedCurrency === 'AMD') {
    items.forEach((item) => {
      // totalCost += item.price * item.quantity;
      totalCostDram += item.price * item.quantity;
      totalCostUSD += usdRate ? item.price * item.quantity / usdRate : NaN; // Вычисляем общую стоимость в USD
    });

    totalCostElement.innerHTML = 
    `
    <div class="totalcost-item">AMD: ${totalCostDram.toFixed(2)}֏</div>
    <div class="totalcost-item">USD: ${isNaN(totalCostUSD) ? 'NaN' : totalCostUSD.toFixed(2)}$</div>
    `;
  }
  if (selectedCurrency === 'USD') {
    items.forEach((item) => {
      totalCostUSD += item.price * item.quantity;
      totalCostDram += usdRate ? item.price * usdRate : NaN; // Установка в NaN, если usdRate не определен
    });
  
    totalCostElement.innerHTML = 
    `
     <div class="totalcost-item">USD: ${totalCostUSD.toFixed(2)}$</div>
     <div class="totalcost-item">AMD: ${isNaN(totalCostDram) ? 'NaN' : totalCostDram.toFixed(2)}֏</div>
    `;
  }
}




/*----========--------======== USD COURSE ========--------========----*/
// Устанавливаем значение по умолчанию для поля ввода курса USD
document.getElementById("usdRate").value = usdRate || '400';

// Обработчик изменения курса USD
document.getElementById("usdRate").addEventListener('input', function() {

  // Установить значение usdRate введенным значением
  usdRate = parseFloat(inputValue) || null;
  displayItems();
  calculateTotalCost(); // При изменении курса вызываем пересчет общей стоимости
});

document.getElementById("usdRate").addEventListener('change', function() {
  const inputValue = this.value.trim();

  if (inputValue.length < 3 || inputValue > 550 || isNaN(parseFloat(inputValue))) {
    // Показать предупреждение, если введено менее трех цифр или значение не является числом
    alert("Пожалуйста, введите корректный курс USD, содержащий не менее трех цифр.");
    this.value = "400"; // By Default 400
  }
});




// ---=== Предупреждение что после перезагрузки данные исчезнут ===---
window.addEventListener('beforeunload', function(event) {
  if (hasUnsavedData) {
    event.preventDefault();
    event.returnValue = '';   // Это нужно для поддержки старых браузеров
    return '';                // Стандартный способ
  }
});


/*----========--------======== HELPER ========--------========----*/
document.addEventListener('DOMContentLoaded', function() {
  // const navHelp = document.querySelector('.nav-help');
  const helperBtn = document.querySelector('.helper-btn');
  const helperText = document.querySelector('.helper');

  // Обработчик события клика на кнопку "Help"
  helperBtn.addEventListener('click', function() {
    helperText.classList.toggle('show-helper'); // Переключение отображения текста помощи

    if (helperText.classList.contains('show-helper')) {
      helperBtn.textContent = 'X'; // Изменение текста кнопки на "X", если помощь отображается
      helperBtn.classList.add('close-helper'); // Добавление класса для стилизации кнопки закрытия
    } else {
      helperBtn.textContent = 'Help'; // Иначе изменение текста кнопки на "Help"
      helperBtn.classList.remove('close-helper'); // Удаление класса, если блок помощи скрыт
    }
  });
});
