class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange);
    this.querySelectorAll(".option-item").forEach((option) => {
      option.addEventListener("click", this.onVariantChange.bind(this))
    })
  }

  onVariantChange(evt) {
    this.target = evt.target
    var select = this.target.closest(".selector-wrapper")
    select?.querySelectorAll('.option-item').forEach((option) => {
      option.classList.remove('selected')
    })

    
    if ( this.target.classList.contains("select__select")) {
      this.target.options[this.target.selectedIndex].classList.add('selected')
      // select.querySelector(".selected-value").innerHTML = this.target.options[this.target.selectedIndex].getAttribute("data-value")
    } else {
      this.target.closest(".option-item").classList.add('selected')
      // select.querySelector(".selected-value").innerHTML = this.target.closest(".option-item").getAttribute("data-value")
    }
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.updatePickupAvailability();

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateSKU();
      this.updateAvailable();
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.updateShareUrl();
    }
  }

  updateOptions() {
    this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }

  updateMedia() {
    if (!this.currentVariant || !this.currentVariant?.featured_media) return;
    const newMedia = document.querySelector(
      `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
    );
    if (!newMedia) return;
    const parent = newMedia.parentElement;
    parent.prepend(newMedia);
    window.setTimeout(() => { parent.scroll(0, 0) });
    if(document.querySelector(".product__media-wrapper .slider-dots")){
      const num = newMedia.getAttribute("data-position");
      const newDot = document.querySelector(`.slider-dot[data-position="${num}"]`);
      const parentDot = newDot.parentElement;
      const parentDotList = parentDot.parentElement;
      parentDotList.prepend(parentDot);
    }
  }

  updateURL() {
    if (!this.currentVariant) return;
    window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }
  updateSKU() {
    if (!this.currentVariant) return;
    var variantSKU = document.querySelector('.variant-sku');
    if (variantSKU) {
      variantSKU.innerText = this.currentVariant.sku;
    }
  }
  updateAvailable() {
    if (!this.currentVariant) return;
    var available = document.querySelector('.product-available');
    if (available) {
      if (this.currentVariant.available) {
        available.innerText = theme.in_stock;
      }else{
        available.innerText = theme.out_stock;
      }
    }
  }
  updateShareUrl() {
    const shareButton = document.getElementById(`Share-${this.dataset.section}`);
    if (!shareButton) return;
    shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector('pickup-availability');
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute('available');
      pickUpAvailability.innerHTML = '';
    }
  }

  renderProductInfo() {
    fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        const id = `price-${this.dataset.section}`;
        const html = new DOMParser().parseFromString(responseText, 'text/html')
        const destination = document.getElementById(id);
        const source = html.getElementById(id);

        if (source && destination) destination.innerHTML = source.innerHTML;

        const price = document.getElementById(`price-${this.dataset.section}`);

        if (price) price.classList.remove('visibility-hidden');
        this.toggleAddButton(!this.currentVariant.available, window.variantStrings.soldOut);
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const addButton = document.getElementById(`product-form-${this.dataset.section}`)?.querySelector('[name="add"]');

    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', true);
      if (text) addButton.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButton.textContent = window.variantStrings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const addButton = document.getElementById(`product-form-${this.dataset.section}`)?.querySelector('[name="add"]');

    if (!addButton) return;
    addButton.textContent = window.variantStrings.unavailable;
    document.getElementById(`price-${this.dataset.section}`)?.classList.add('visibility-hidden');
    var meta_id = `meta-${this.dataset.section}`;
    var meta_destination = document.getElementById(meta_id);
    var available = meta_destination.querySelector(".label-detail-wrapper span[data-available]");
    available.innerHTML = window.variantStrings.unavailable;
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}

customElements.define('variant-selects', VariantSelects);

class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }

  updateOptions() {
    const current_fieldset = Array.from(this.querySelectorAll('.selector-wrapper'));
    this.options = current_fieldset.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll('.option-item'))?.find((radio) => radio.classList.contains('selected')).getAttribute("data-value");
    });
    var all_fieldsets = Array.from(document.querySelectorAll('.selector-wrapper'));
    var other_fieldset = all_fieldsets.filter(x => !current_fieldset.includes(x))
    other_fieldset.map((fieldset) => {
      Array.from(fieldset.querySelectorAll('.option-item')).find((radio) => {
        if (this.options.includes(radio.getAttribute('data-value'))) {
          if (!radio.classList.contains("selected")) {
            radio.classList.add('selected')
            // Trigger change for sticky/main input
            var event = new Event('click');
            radio.dispatchEvent(event)
          }
        } else {
          radio.classList.remove('selected')
        }
      });
    });
  }
}

customElements.define('variant-radios', VariantRadios);
