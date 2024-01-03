import { getProducts, getCategoriesProducts } from './fetchAPI';
import { disableScroll, openModal } from './modal_window';
import svg from '../img/icons.svg';
import { addToStorageCart, isExistInCart, removeFromStorageCart } from './localStorage.js';
import { handleCartItem, qty_card_products } from './header.js';

const list = document.querySelector('.list-product');

const formSearch = document.querySelector('.form-search');
const errors = document.querySelector('.error');
const selected = document.querySelector('#selected');

errors.style.display = 'none';

export let keywords;
export let selectedForm;

formSearch.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  const { search } = event.currentTarget.elements;
  keywords = search.value;

  localStorage.setItem('SaveFilters', JSON.stringify(keywords) || null);
  renderFood();
}

formSearch.elements.search.value = localStorage.getItem('savetext');

renderFood();

selected.addEventListener('change', handleChange);

function handleChange(event) {
  const select = event.target.value;
  const selecteds = event.target.value;
  selectedForm = selecteds;
  selectedForm = selecteds;
  localStorage.setItem('SaveCategpries', JSON.stringify(selectedForm) || null);
  renderFood();
}

formSearch.elements.selecteds.value = localStorage.getItem('saveselected');

function renderCategory() {
  getCategoriesProducts()
    .then(data => {
      const category = data
        .map(data => {
          return `<option value="${data}">${String(data)
            .replace('_', ' ')
            .replace('_', ' ')}</option>`;
        })
        .join('');
      selected.insertAdjacentHTML('beforeend', category);
    })
    .catch(error => {
      console.log(error);
    });
}

renderCategory();

export async function renderFood() {
  await getProducts()
    .then(foodImages => {
      if (foodImages.results.length === 0) {
        errors.style.display = 'flex';
      } else {
        errors.style.display = "none";
      }
      createMarkup(foodImages.results);

      /////////////////BUTTONS CHECK//////////
      const btn = document.querySelectorAll('.basket');
      btn.forEach((button) => {
        button.addEventListener("click", handleAddToCart);
        const id = button.dataset.id;
        if (isExistInCart(id)) {
          button.setAttribute("disabled", "true");
          button.innerHTML = `
        <svg class="basket-icon-check" width="18" height="18">
          <use href="${svg}#icon-check"></use>
        </svg>
      `;
        }
      });

      function handleAddToCart(e) {
        const button = e.currentTarget;
        const id = button.dataset.id;

        if (isExistInCart(id)) {
          removeFromStorageCart(id)
          button.removeAttribute(id);
          button.innerHTML = `
      <svg class="basket-icon" width="18" height="18">
        <use href="${svg}#icon-cart"></use>
      </svg>
    `;
        } else {
          addToStorageCart(id)
          button.setAttribute("disabled", true);
          button.innerHTML = `
      <svg class="basket-icon-check" width="18" height="18">
        <use href="${svg}#icon-check"></use>
      </svg>
    `;
          handleCartItem(Number(qty_card_products.outerText) + Number(1))
        }
      }

    })
    .catch(error => {
      throw new Error(error);
    });
}

function createMarkup(array) {
  const markup = array
    .map(
      ({
        name,
        img,
        category,
        price,
        size,
        popularity,
        is10PercentOff,
        _id,
      }) => {
        if (is10PercentOff == true) {
          return `
              <li class="item-product" data-id="${_id}">
                <div class="product-container" id="svg-discount">
                  <svg width="60" height="60" class="discount-svg">
                    <use href="${svg}#icon-discount"></use>
                  </svg>
                  <img class="img-product" src="${img}" width="400" height="200">
                  <h2 class="caption-product">${name}</h2>
                  <div class="features-container">
                      <p class="feature">Category: <span class=feature-black>${category}</span></p>
                      <p class="feature">Size: <span class=feature-black>${size}</span></p>
                      <p class="feature popularity">Popularity: <span class=feature-black>${popularity}</span></p>
                  </div>
                  <div class="sell-container">
                      <p class="price-product">$${price}</p>
                      <button class="basket" data-id="${_id}">
        <svg class="basket-icon" width="18" height="18">
          <use href="${svg}#icon-cart"></use>
        </svg>
      </button>
                  </div>
                </div>
              </li>
              `;
        } else {
          return `
              <li class="item-product" data-id="${_id}">
                <div class="product-container" id="svg-discount">
                  <img class="img-product" src="${img}" width="400" height="200">
                  <h2 class="caption-product">${name}</h2>
                  <div class="features-container">
                      <p class="feature">Category: <span class=feature-black>${String(
                        category
                      )
                        .replace('_', ' ')
                        .replace('_', ' ')}</span></p>
                      <p class="feature">Size: <span class=feature-black>${size}</span></p>
                      <p class="feature popularity">Popularity: <span class=feature-black>${popularity}</span></p>
                  </div>
                  <div class="sell-container">
                      <p class="price-product">$${price}</p>
                      <button class="basket" data-id="${_id}">
        <svg class="basket-icon" width="18" height="18">
          <use href="${svg}#icon-cart"></use>
        </svg>
      </button>
                  </div>
                </div>
              </li>
              `;
        }
      }
    )
    .join('');
  list.innerHTML = '';
  list.insertAdjacentHTML('beforeend', markup);
}




function callModal(event) {
  const item = event.target.closest('.item-product');

  if (item) {
    const id = item.dataset.id;
    openModal(id).then(disableScroll)
  }


}

list.addEventListener('click', callModal);



export { createMarkup };
