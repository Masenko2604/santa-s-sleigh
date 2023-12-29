import { getAllProducts, getCategoriesProducts, getDiscountProducts, getPopularProducts, getProductById, createNewOrder, sendSubscription } from "./fetchAPI"
import { openModal } from "./modal_window"
// import { addToStorageCart, removeFromStorageCart, isExistInCart } from "./localStorage"

const card = document.querySelector('.card');
// Ліміт карток на сторінці
const cardsPerPage = 2;

function createMarkup(images, names, startIndex = 0) {
  const endIndex = startIndex + cardsPerPage;
  const slicedImages = images.slice(startIndex, endIndex);

  const res = slicedImages.map(({ img, price, _id, desc }, index) =>
    `<li class="card_item" data-id="${_id}">
      <div class="discount-icon-container">
        <svg class="discount-icon" width="60" height="60">
          <use href="../img/icons.svg#icon-discount"></use>
        </svg>
      </div>
      <div class="card-content">
        <img src="${img}" alt="${desc}" class="card-img" width="105" height="105">
      </div>
      <div class="title-box">
        <h3 class="card-title">${names[index]}</h3>
        <p class="card-price">$${price}</p>
      </div>
      <button class="basket" data-id="${_id}">
        <svg class="basket-icon" width="18" height="18">
          <use href="../img/icons.svg#icon-cart"></use>
        </svg>
      </button>
    </li>`
  ).join('');
  return res;
};

async function addToBasket() {
  const result = await getDiscountProducts();
  console.log(result);
  const shortNames = result.reduce((acc, product) => {
    if (product.name.length > 10) {
      acc.push(product.name.slice(0, 10) + "...");
    } else {
      acc.push(product.name);
    }
    return acc;
  }, []);

  card.innerHTML = createMarkup(result, shortNames);

  // Виклик модалки
  card.addEventListener('click', (event) => {
    const item = event.target.closest('.card_item');
    if (item) {
      const id = item.dataset.id;
      openModal(id);
    }
  });


  // Зміна кнопки
  const btn = document.querySelectorAll('.basket');
  console.log(btn);

  btn.forEach((button) => {
    button.addEventListener("click", handleAddToCart);
    const id = button.dataset.id;
    if (isExistInCart(id)) {
      button.setAttribute("disabled", true);
      button.innerHTML = `
        <svg class="basket-icon-check" width="18" height="18">
          <use href="../img/icons.svg#icon-check"></use>
        </svg>
      `;
    }
  });
}
addToBasket();

function handleAddToCart(e) {
  const button = e.currentTarget;
  console.log(button);
  const id = button.dataset.id;
  console.log(id);

  if (button.hasAttribute("disabled")) {
    removeFromStorageCart(id)
    console.log(removeFromStorageCart(id));
    button.removeAttribute("disabled");
    button.innerHTML = `
      <svg class="basket-icon" width="18" height="18">
        <use href="../img/icons.svg#icon-cart"></use>
      </svg>
    `;
  } else {
    addToStorageCart(id)
    console.log(addToStorageCart(id));
    button.setAttribute("disabled", true);
    button.innerHTML = `
      <svg class="basket-icon-check" width="18" height="18">
        <use href="../img/icons.svg#icon-check"></use>
      </svg>
    `;
  }
}





function addToStorageCart(productId) {
  const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
  console.log(currentCart);

  if (!currentCart.includes(productId)) {
    currentCart.push(productId);

    localStorage.setItem('cart', JSON.stringify(currentCart));
  }
}


function removeFromStorageCart(productId) {
  const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
  console.log(currentCart);

  const index = currentCart.indexOf(productId);

  if (index !== -1) {
    currentCart.splice(index, 1);

    localStorage.setItem('cart', JSON.stringify(currentCart));
  }
}

function isExistInCart(productId) {
  try {
    const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log(currentCart);
    return currentCart.includes(productId);
  } catch (error) {
    console.error('Помилка парсингу JSON:', error);
    return false;
  }
}

