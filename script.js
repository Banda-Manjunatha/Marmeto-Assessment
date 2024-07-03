console.log("====================================");
console.log("Connected");
console.log("====================================");

// Function to fetch product data
async function fetchProductData() {
  const response = await fetch(
    "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json",
  );
  const data = await response.json();
  console.log(data);
  return data.product;
}

// Function to render product details
function renderProductDetails(product) {
  const productDetailsElement = document.getElementById("product-details");

  const colorOptions = product.options.find(
    (option) => option.name === "Color",
  ).values;
  const sizeOptions = product.options.find(
    (option) => option.name === "Size",
  ).values;

  const discountPercentage = Math.round(
    (1 -
      parseFloat(product.price.replace("$", "")) /
        parseFloat(product.compare_at_price.replace("$", ""))) *
      100,
  );

  const mainImages = {
    src1: "https://res.cloudinary.com/dmn7qksnf/image/upload/v1709533335/p1_product_lro5o4.png",
  };
  const thumbnailImages = {
    src2: "https://res.cloudinary.com/dmn7qksnf/image/upload/v1709533335/p1_product_i3_jk7lvv.png",
    src3: "https://res.cloudinary.com/dmn7qksnf/image/upload/v1709533335/p1_product_i4_m7qhev.png",
    src4: "https://res.cloudinary.com/dmn7qksnf/image/upload/v1709533335/p1_product_i2_tb9srq.png",
    src5: "https://res.cloudinary.com/dmn7qksnf/image/upload/v1709533335/p1_product_i1_xdwytx.png",
  };

  const html = `
    <div class='product-container'>
        <div class="product-image">
            <img src="${mainImages.src1}" alt="${
    product.title
  }" class="mainImage">
            <div class="thumbnail-images">
                ${Object.values(thumbnailImages)
                  .map(
                    (imageSrc, index) =>
                      `<img src="${imageSrc}" alt="Thumbnail" data-index="${
                        index + 1
                      }">`,
                  )
                  .join("")}
            </div>
        </div>
        <div class="product-info">
            <small class="vendor">${product.vendor}</small>
            <h2 class="product-title">${product.title}</h2>
            <div class="price-info">
                <div class="currentPrice-container">
                    <span class="current-price">${product.price}.00</span>
                    <span class="discount">${discountPercentage}% Off</span>
                </div>
                <span class="original-price">${
                  product.compare_at_price
                }.00</span>
            </div>
            <div class="color-selector">
                <p class='sub-heading'>Choose a Color</p>
                <div class="color-options">
                    ${colorOptions
                      .map(
                        (color, index) => `
                        <button class="color-button ${
                          index === 0 ? "selected" : ""
                        }" style="background-color: ${
                          Object.values(color)[0]
                        };" data-color="${Object.keys(color)[0]}">
                            ${
                              index === 0
                                ? '<img src="checkIcon.png" alt="Check Icon">'
                                : ""
                            }
                        </button>`,
                      )
                      .join("")}
                </div>
            </div>
            <div class="size-selector">
                <p class='sub-heading'>Choose a Size</p>
                <div class="size-options">
                    ${sizeOptions
                      .map(
                        (size, index) => `
                        <label class="${index === 0 ? "selected" : ""}">
                            <input type="radio" name="size" value="${size}" ${
                          index === 0 ? "checked" : ""
                        }>
                            ${size}
                        </label>`,
                      )
                      .join("")}
                </div>
            </div>
            <div class='cart-container'>
                <div class='quantity-cart'>
                    <div class="quantity-selector">
                        <button class="quantity-decrease">-</button>
                        <p class="quantity">1</p>
                        <button class="quantity-increase">+</button>
                    </div>
                    <button class="add-to-cart"><i class="fas fa-shopping-bag"></i>Add To Cart</button>
                </div>
                <div class="add-to-cart-message"></div> 
            </div>
            
            <div class="product-description">${product.description}</div>
        </div>
    </div>
    `;

  productDetailsElement.innerHTML = html;

  // Event listeners for color buttons
  const colorButtons = document.querySelectorAll(".color-button");
  colorButtons.forEach((button, index) => {
    button.addEventListener("click", (event) => {
      colorButtons.forEach((btn) => {
        btn.classList.remove("selected");
        btn.innerHTML = "";
      });
      event.currentTarget.classList.add("selected");
      event.currentTarget.innerHTML =
        '<img src="checkIcon.png" alt="Check Icon">';
    });
  });

  // Event listener for Add to Cart button
  const addToCartButton = productDetailsElement.querySelector(".add-to-cart");
  const addToCartMessage = productDetailsElement.querySelector(
    ".add-to-cart-message",
  );

  addToCartButton.addEventListener("click", () => {
    const selectedColor = productDetailsElement.querySelector(
      ".color-button.selected",
    ).dataset.color;
    const selectedSize = productDetailsElement.querySelector(
      'input[name="size"]:checked',
    ).value;

    const message = `${product.title} with color '${selectedColor}' and Size '${selectedSize}' added to cart.`;
    addToCartMessage.textContent = message;
    addToCartMessage.style.display = "block";
  });

  // Thumbnail click functionality
  const thumbImages = productDetailsElement.querySelectorAll(
    ".thumbnail-images img",
  );
  thumbImages.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const mainImage = productDetailsElement.querySelector(".mainImage");
      mainImage.src = thumbnail.src;
      mainImage.alt = thumbnail.alt;
    });
  });

  // size labels
  const sizeLabels = productDetailsElement.querySelectorAll(
    ".size-options label",
  );
  sizeLabels.forEach((label, index) => {
    label.addEventListener("click", () => {
      sizeLabels.forEach((lbl) => lbl.classList.remove("selected"));
      label.classList.add("selected");
    });
  });
}

// main which fetches the product data
async function initProductPage() {
  try {
    const productData = await fetchProductData();
    renderProductDetails(productData);
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
}

// we need to calling this main function when the page loads
window.addEventListener("load", initProductPage);
