(async () => {
  const hero = window.ADEN_HERO || [];

  /* =========================================================
     SUPABASE
  ========================================================= */

  const SUPABASE_URL =
    "https://vtfodoxsulmnhaahplwf.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_G8TiKAJauItRaxCunDtSzQ_19OZUyOT";

  const supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );


  /* =========================================================
     PRODUCT DATA FROM SUPABASE
  ========================================================= */

  let rawProducts = [];

  try {

    const {
      data: supabaseProducts,
      error: productsError
    } =
      await supabaseClient
        .from("products")
        .select("*")
        .eq("status", "active")
        .order("created_at", {
          ascending: false
        });

    if (productsError) {
      throw productsError;
    }


    const productIds =
      (supabaseProducts || [])
        .map(product => product.id);

    let imageRows = [];

    if (productIds.length) {

      const {
        data: supabaseImages,
        error: imagesError
      } =
        await supabaseClient
          .from("product_images")
          .select(
            "product_id, image_url, sort_order"
          )
          .in(
            "product_id",
            productIds
          )
          .order("sort_order", {
            ascending: true
          });

      if (imagesError) {
        throw imagesError;
      }

      imageRows =
        supabaseImages || [];
    }


    const imagesByProduct = {};

    imageRows.forEach(image => {

      if (!imagesByProduct[image.product_id]) {
        imagesByProduct[image.product_id] = [];
      }

      imagesByProduct[image.product_id].push(
        image.image_url
      );

    });


    rawProducts =
      (supabaseProducts || []).map(product => ({
        ...product,
        images:
          imagesByProduct[product.id] || []
      }));


    console.log(
      "ADEN: Products loaded from Supabase",
      rawProducts
    );


  } catch (error) {

    console.error(
      "ADEN Supabase products error:",
      error
    );


    /* Fallback to products.json */

    try {

      const response =
        await fetch("products.json");

      const data =
        await response.json();

      if (
        Array.isArray(data.products) &&
        data.products.length
      ) {
        rawProducts =
          data.products;
      }

    } catch (fallbackError) {

      console.warn(
        "ADEN products.json fallback failed:",
        fallbackError
      );

    }

  }


  const fallback =
    "assets/images/editorial/editorial-001.webp";

  /* =========================================================
     PRODUCT DATA
  ========================================================= */

  function normalizeProducts(data) {
    );


  /* =========================================================
     PRODUCT DATA FROM SUPABASE
  ========================================================= */

  let rawProducts = [];

  try {

    const {
      data: supabaseProducts,
      error: productsError
    } =
      await supabaseClient
        .from("products")
        .select("*")
        .eq("status", "active")
        .order(
          "created_at",
          {
            ascending: false
          }
        );


    if (productsError) {
      throw productsError;
    }


    const productIds =
      (supabaseProducts || [])
        .map(product => product.id);


    let imageRows = [];


    if (productIds.length) {

      const {
        data: supabaseImages,
        error: imagesError
      } =
        await supabaseClient
          .from("product_images")
          .select(
            "product_id, image_url, sort_order"
          )
          .in(
            "product_id",
            productIds
          )
          .order(
            "sort_order",
            {
              ascending: true
            }
          );


      if (imagesError) {
        throw imagesError;
      }


      imageRows =
        supabaseImages || [];

    }


    /* Attach images to products */

    const imagesByProduct = {};


    imageRows.forEach(
      image => {

        if (
          !imagesByProduct[
            image.product_id
          ]
        ) {
          imagesByProduct[
            image.product_id
          ] = [];
        }


        imagesByProduct[
          image.product_id
        ].push(
          image.image_url
        );

      }
    );


    rawProducts =
      (supabaseProducts || [])
        .map(
          product => ({
            ...product,

            images:
              imagesByProduct[
                product.id
              ] || []
          })
        );


    console.log(
      "ADEN: Products loaded from Supabase",
      rawProducts
    );


  } catch (error) {

    console.error(
      "ADEN Supabase products error:",
      error
    );


    /* Fallback to products.json */

    try {

      const response =
        await fetch(
          "products.json"
        );

      const data =
        await response.json();


      if (
        Array.isArray(
          data.products
        )
      ) {
        rawProducts =
          data.products;
      }

    } catch (fallbackError) {

      console.warn(
        "ADEN products.json fallback failed:",
        fallbackError
      );

    }

  }


  const fallback =
    "assets/images/editorial/editorial-001.webp";


  /* =========================================================
     PRODUCT DATA
  ========================================================= */

  function normalizeProducts(data) {
    let list = data;

    // Support { products: [...] }
    if (!Array.isArray(list) && Array.isArray(list.products)) {
      list = list.products;
    }

    if (!Array.isArray(list)) return [];

    return list.map((p, index) => {
      if (typeof p === "string") {
        return {
          id: `look-${index + 1}`,
          name: `ADEN LOOK ${String(index + 1).padStart(2, "0")}`,
          price: 490000,
          colors: ["Khaki", "Burgundy", "Black"],
          sizes: ["Free Size"],
          images: [p],
          description: ""
        };
      }

      return {
        id: p.id || `aden-${index + 1}`,
        name:
          p.name ||
          p.title ||
          `ADEN PRODUCT ${String(index + 1).padStart(3, "0")}`,

        price:
          typeof p.price === "number"
            ? p.price
            : 490000,

        colors:
          Array.isArray(p.colors)
            ? p.colors
            : ["Khaki", "Burgundy", "Black"],

        sizes:
          Array.isArray(p.sizes)
            ? p.sizes
            : ["Free Size"],

        images:
          Array.isArray(p.images)
            ? p.images
            : [],

        description:
          p.description ||
          "Contemporary ADEN STUDIO menswear designed for a modern silhouette."
      };
    });
  }

  let products = normalizeProducts(rawProducts);

  /* =========================================================
     FALLBACK PRODUCT
  ========================================================= */

  if (!products.length) {
    products = [{
      id: "aden-001",
      name: "ADEN PRODUCT 001",
      price: 490000,
      colors: ["Khaki", "Burgundy", "Black"],
      sizes: ["Free Size"],
      images: [
        "assets/images/products/aden-001/RABIT1.jpg",
        "assets/images/products/aden-001/RABIT2.jpg",
        "assets/images/products/aden-001/RABIT3.jpg",
        "assets/images/products/aden-001/RABIT4.jpg",
        "assets/images/products/aden-001/RABIT5.jpg",
        "assets/images/products/aden-001/RABIT6.jpg",
        "assets/images/products/aden-001/RABIT7.jpg",
        "assets/images/products/aden-001/RABIT8.jpg",
        "assets/images/products/aden-001/RABIT9.jpg"
      ],
      description:
        "Contemporary ribbed long-sleeve henley with graphic typography and cross detail."
    }];
  }

  /* =========================================================
     HERO
  ========================================================= */

  const slides = document.getElementById("heroSlides");
  const heroCount = document.querySelector(".hero-count");

  const heroFiles =
    hero.length
      ? hero
      : [products[0]?.images?.[0] || fallback];

  if (slides) {
    heroFiles.forEach((src, i) => {
      const s = document.createElement("div");

      s.className =
        "hero-slide" +
        (i === 0 ? " active" : "");

      s.style.backgroundImage =
        `url("${src}")`;

      slides.appendChild(s);
    });
  }

  let hi = 0;

  if (heroFiles.length > 1 && slides) {
    setInterval(() => {
      const els = [
        ...document.querySelectorAll(".hero-slide")
      ];

      if (!els.length) return;

      els[hi].classList.remove("active");

      hi = (hi + 1) % els.length;

      els[hi].classList.add("active");

      const b =
        heroCount?.querySelector("b");

      if (b) {
        b.textContent =
          String(hi + 1).padStart(2, "0");
      }
    }, 5000);
  }

  /* =========================================================
     PRICE
  ========================================================= */

  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN").format(
      Number(price || 0)
    ) + " VND";
  }

  /* =========================================================
     CART
  ========================================================= */

  let cart = [];

  try {
    cart =
      JSON.parse(
        localStorage.getItem("aden_cart") || "[]"
      );
  } catch {
    cart = [];
  }

  function saveCart() {
    localStorage.setItem(
      "aden_cart",
      JSON.stringify(cart)
    );

    updateBagCount();
  }

  function updateBagCount() {
    const count =
      cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

    document
      .querySelectorAll(".bag-count")
      .forEach(el => {
        el.textContent = count;
      });

    const bagText =
      document.querySelector(".bag-link");

    if (bagText) {
      bagText.textContent =
        `BAG (${count})`;
    }
  }

  function addToCart(product, color, size) {
    const existing =
      cart.find(item =>
        item.id === product.id &&
        item.color === color &&
        item.size === size
      );

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || fallback,
        color,
        size,
        quantity: 1
      });
    }

    saveCart();
    renderCart();
    openCart();
  }

  /* =========================================================
     PRODUCT DETAIL
  ========================================================= */

  function openProduct(product) {
    let color =
      product.colors?.[0] || "Khaki";

    let size =
      product.sizes?.[0] || "Free Size";

    const overlay =
      document.createElement("div");

    overlay.className =
      "aden-product-modal";

    overlay.innerHTML = `
      <div class="aden-product-panel">

        <button class="aden-product-close"
          aria-label="Close">
          ×
        </button>

        <div class="aden-product-gallery">

          <div class="aden-product-main">
            <img
              class="aden-main-image"
              src="${product.images?.[0] || fallback}"
              alt="${product.name}">
          </div>

          <div class="aden-product-thumbs">
            ${(product.images || [])
              .map((img, i) => `
                <button
                  class="aden-thumb ${i === 0 ? "active" : ""}"
                  data-index="${i}">
                  <img src="${img}" alt="">
                </button>
              `)
              .join("")}
          </div>

        </div>

        <div class="aden-product-info">

          <div class="aden-product-label">
            ADEN STUDIO
          </div>

          <h2>${product.name}</h2>

          <div class="aden-product-price">
            ${formatPrice(product.price)}
          </div>

          <p class="aden-product-description">
            ${product.description || ""}
          </p>

          <div class="aden-option">
            <div class="aden-option-title">
              COLOR
            </div>

            <div class="aden-options colors">
              ${(product.colors || [])
                .map((c, i) => `
                  <button
                    class="aden-option-btn color-btn ${i === 0 ? "selected" : ""}"
                    data-color="${c}">
                    ${c}
                  </button>
                `)
                .join("")}
            </div>
          </div>

          <div class="aden-option">
            <div class="aden-option-title">
              SIZE
            </div>

            <div class="aden-options sizes">
              ${(product.sizes || [])
                .map((s, i) => `
                  <button
                    class="aden-option-btn size-btn ${i === 0 ? "selected" : ""}"
                    data-size="${s}">
                    ${s}
                  </button>
                `)
                .join("")}
            </div>
          </div>

          <button class="aden-add-cart">
            ADD TO BAG
          </button>

          <div class="aden-product-note">
            Free shipping available for international orders.
          </div>

        </div>

      </div>
    `;

    document.body.appendChild(overlay);

    const mainImage =
      overlay.querySelector(".aden-main-image");

    overlay
      .querySelectorAll(".aden-thumb")
      .forEach(btn => {
        btn.addEventListener("click", () => {
          const index =
            Number(btn.dataset.index);

          mainImage.src =
            product.images[index];

          overlay
            .querySelectorAll(".aden-thumb")
            .forEach(x =>
              x.classList.remove("active")
            );

          btn.classList.add("active");
        });
      });

    overlay
      .querySelectorAll(".color-btn")
      .forEach(btn => {
        btn.addEventListener("click", () => {
          color = btn.dataset.color;

          overlay
            .querySelectorAll(".color-btn")
            .forEach(x =>
              x.classList.remove("selected")
            );

          btn.classList.add("selected");
        });
      });

    overlay
      .querySelectorAll(".size-btn")
      .forEach(btn => {
        btn.addEventListener("click", () => {
          size = btn.dataset.size;

          overlay
            .querySelectorAll(".size-btn")
            .forEach(x =>
              x.classList.remove("selected")
            );

          btn.classList.add("selected");
        });
      });

    overlay
      .querySelector(".aden-add-cart")
      .addEventListener("click", () => {
        addToCart(
          product,
          color,
          size
        );
      });

    overlay
      .querySelector(".aden-product-close")
      .addEventListener("click", () => {
        overlay.remove();
      });

    overlay.addEventListener("click", e => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
  }

  /* =========================================================
     PRODUCT GRID
  ========================================================= */

  const grid =
    document.getElementById("productGrid");

  if (grid) {
    grid.innerHTML = "";

    products.slice(0, 8).forEach((product, i) => {

      const image =
        product.images?.[0] ||
        fallback;

      const article =
        document.createElement("article");

      article.className =
        "product-card";

      article.innerHTML = `
        <div class="product-image">

          <span class="new-tag">
            NEW
          </span>

          <img
            src="${image}"
            alt="${product.name}"
            loading="${i < 4 ? "eager" : "lazy"}">

          <span class="product-plus">
            +
          </span>

        </div>

        <div class="product-meta">

          <div class="product-name">
            ${product.name}
          </div>

          <div class="product-price">
            ${formatPrice(product.price)}
          </div>

        </div>
      `;

      article.addEventListener(
        "click",
        () => openProduct(product)
      );

      grid.appendChild(article);
    });
  }

  /* =========================================================
     JOURNAL
  ========================================================= */

  const journal =
    document.getElementById("journalGrid");

  if (journal) {
    const all = [
      ...products.flatMap(
        p => p.images || []
      ),
      ...heroFiles
    ];

    const journalItems =
      [...new Set(all)].slice(0, 10);

    journal.innerHTML = "";

    journalItems.forEach((src, i) => {

      const im =
        document.createElement("img");

      im.src = src;
      im.alt =
        `ADEN Journal ${i + 1}`;
      im.loading = "lazy";

      journal.appendChild(im);
    });
  }

  /* =========================================================
     EDITORIAL
  ========================================================= */

  const ep =
    document.getElementById(
      "editorialPhoto"
    );

  if (ep) {
    ep.style.backgroundImage =
      `url("${heroFiles[1] || heroFiles[0]}")`;
  }

  /* =========================================================
     LIGHTBOX
  ========================================================= */

  const lb =
    document.getElementById("lightbox");

  const lbImg =
    document.getElementById("lbImage");

  const cap =
    document.getElementById("lbCaption");

  let lbItems = [];
  let lbIndex = 0;

  function openLightbox(
    items,
    index,
    title
  ) {
    if (!lb || !lbImg) return;

    lbItems = items;
    lbIndex = index;

    lbImg.src =
      lbItems[lbIndex];

    if (cap) {
      cap.textContent =
        `${title} / ${index + 1} OF ${items.length}`;
    }

    lb.classList.add("open");
    lb.setAttribute(
      "aria-hidden",
      "false"
    );
  }

  function updateLightbox() {
    if (!lbItems.length) return;

    lbImg.src =
      lbItems[lbIndex];

    if (cap) {
      cap.textContent =
        `ADEN / ${lbIndex + 1} OF ${lbItems.length}`;
    }
  }

  function closeLightbox() {
    if (!lb) return;

    lb.classList.remove("open");

    lb.setAttribute(
      "aria-hidden",
      "true"
    );
  }

  document
    .querySelector(".lb-close")
    ?.addEventListener(
      "click",
      closeLightbox
    );

  document
    .querySelector(".lb-prev")
    ?.addEventListener(
      "click",
      () => {
        if (!lbItems.length) return;

        lbIndex =
          (lbIndex - 1 + lbItems.length) %
          lbItems.length;

        updateLightbox();
      }
    );

  document
    .querySelector(".lb-next")
    ?.addEventListener(
      "click",
      () => {
        if (!lbItems.length) return;

        lbIndex =
          (lbIndex + 1) %
          lbItems.length;

        updateLightbox();
      }
    );

  lb?.addEventListener(
    "click",
    e => {
      if (e.target === lb) {
        closeLightbox();
      }
    }
  );

  document.addEventListener(
    "keydown",
    e => {

      if (!lb?.classList.contains("open")) {
        return;
      }

      if (e.key === "Escape") {
        closeLightbox();
      }

      if (e.key === "ArrowLeft") {
        document
          .querySelector(".lb-prev")
          ?.click();
      }

      if (e.key === "ArrowRight") {
        document
          .querySelector(".lb-next")
          ?.click();
      }
    }
  );

  /* =========================================================
     SEARCH
  ========================================================= */

  const sp =
    document.getElementById(
      "searchPanel"
    );

  document
    .getElementById("searchBtn")
    ?.addEventListener(
      "click",
      () => {
        sp?.classList.add("open");

        setTimeout(() => {
          document
            .getElementById("searchInput")
            ?.focus();
        }, 50);
      }
    );

  document
    .getElementById("searchClose")
    ?.addEventListener(
      "click",
      () => {
        sp?.classList.remove("open");
      }
    );

  /* =========================================================
     MOBILE MENU
  ========================================================= */

  const mm =
    document.getElementById(
      "mobileMenu"
    );

  document
    .getElementById("menuToggle")
    ?.addEventListener(
      "click",
      () => {
        mm?.classList.add("open");
      }
    );

  document
    .getElementById("mobileClose")
    ?.addEventListener(
      "click",
      () => {
        mm?.classList.remove("open");
      }
    );

  mm
    ?.querySelectorAll("a")
    .forEach(a => {
      a.addEventListener(
        "click",
        () => {
          mm.classList.remove("open");
        }
      );
    });

  /* =========================================================
     NEWSLETTER
  ========================================================= */

  document
    .getElementById("subscribeForm")
    ?.addEventListener(
      "submit",
      e => {

        e.preventDefault();

        const btn =
          e.currentTarget.querySelector(
            "button"
          );

        if (btn) {
          btn.innerHTML =
            "THANK YOU ✓";
        }
      }
    );

  /* =========================================================
     CART UI
  ========================================================= */

  let cartPanel =
    document.getElementById(
      "adenCartPanel"
    );

  if (!cartPanel) {

    cartPanel =
      document.createElement("div");

    cartPanel.id =
      "adenCartPanel";

    cartPanel.innerHTML = `
      <div class="aden-cart-overlay"></div>

      <aside class="aden-cart">

        <div class="aden-cart-header">
          <h2>YOUR BAG</h2>

          <button
            class="aden-cart-close">
            ×
          </button>
        </div>

        <div class="aden-cart-items"></div>

        <div class="aden-cart-footer">

          <div class="aden-cart-total">
            <span>TOTAL</span>
            <strong class="aden-total-price">
              0 VND
            </strong>
          </div>

          <button class="aden-checkout">
            CHECKOUT
          </button>

        </div>

      </aside>
    `;

    document.body.appendChild(
      cartPanel
    );
  }

  function openCart() {
    cartPanel.classList.add("open");
  }

  function closeCart() {
    cartPanel.classList.remove("open");
  }

  function renderCart() {

    const container =
      cartPanel.querySelector(
        ".aden-cart-items"
      );

    const totalEl =
      cartPanel.querySelector(
        ".aden-total-price"
      );

    if (!cart.length) {

      container.innerHTML = `
        <div class="aden-empty-cart">
          YOUR BAG IS EMPTY
        </div>
      `;

      totalEl.textContent =
        "0 VND";

      return;
    }

    let total = 0;

    container.innerHTML =
      cart.map((item, index) => {

        total +=
          item.price *
          item.quantity;

        return `
          <div
            class="aden-cart-item"
            data-index="${index}">

            <img
              src="${item.image}"
              alt="${item.name}">

            <div class="aden-cart-item-info">

              <div class="aden-cart-item-name">
                ${item.name}
              </div>

              <div>
                ${item.color}
                / ${item.size}
              </div>

              <div class="aden-cart-item-price">
                ${formatPrice(item.price)}
              </div>

              <div class="aden-quantity">

                <button
                  class="qty-minus">
                  −
                </button>

                <span>
                  ${item.quantity}
                </span>

                <button
                  class="qty-plus">
                  +
                </button>

                <button
                  class="qty-remove">
                  REMOVE
                </button>

              </div>

            </div>

          </div>
        `;
      }).join("");

    totalEl.textContent =
      formatPrice(total);

    container
      .querySelectorAll(".aden-cart-item")
      .forEach(row => {

        const index =
          Number(row.dataset.index);

        row
          .querySelector(".qty-minus")
          .onclick = () => {

            if (cart[index].quantity > 1) {
              cart[index].quantity--;
            } else {
              cart.splice(index, 1);
            }

            saveCart();
            renderCart();
          };

        row
          .querySelector(".qty-plus")
          .onclick = () => {

            cart[index].quantity++;

            saveCart();
            renderCart();
          };

        row
          .querySelector(".qty-remove")
          .onclick = () => {

            cart.splice(index, 1);

            saveCart();
            renderCart();
          };
      });
  }

  cartPanel
    .querySelector(".aden-cart-close")
    .onclick = closeCart;

  cartPanel
    .querySelector(".aden-cart-overlay")
    .onclick = closeCart;

  cartPanel
    .querySelector(".aden-checkout")
    .onclick = () => {

      if (!cart.length) {
        alert("YOUR BAG IS EMPTY");
        return;
      }

      alert(
        "CHECKOUT\n\n" +
        "The checkout page will be connected next."
      );
    };

  /* =========================================================
     BAG BUTTON
  ========================================================= */

  document
    .querySelectorAll(
      ".bag-link, [data-bag], .bag"
    )
    .forEach(el => {

      el.addEventListener(
        "click",
        e => {
          e.preventDefault();
          renderCart();
          openCart();
        }
      );
    });

  updateBagCount();
  renderCart();

})();
